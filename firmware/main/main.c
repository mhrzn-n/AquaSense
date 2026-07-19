#include <stdio.h>
#include <stdbool.h>
#include <stdint.h>
#include <math.h>
#include <string.h>

#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "freertos/event_groups.h"

#include "esp_log.h"
#include "esp_err.h"
#include "esp_event.h"
#include "esp_netif.h"
#include "esp_wifi.h"
#include "nvs_flash.h"
#include "esp_http_client.h"
#include "esp_crt_bundle.h"
#include "esp_timer.h"
#include "esp_rom_sys.h"

#include "driver/gpio.h"
#include "esp_adc/adc_oneshot.h"
#include "esp_adc/adc_cali.h"
#include "esp_adc/adc_cali_scheme.h"

#include "onewire_bus.h"
#include "ds18b20.h"

#include "../config/config.h"

// Holding shared state
static const char *TAG = "AQUASENSE";

static onewire_bus_handle_t s_onewire_bus = NULL;
static ds18b20_device_handle_t s_ds18b20 = NULL;
static bool s_ds18b20_found = false;

static adc_oneshot_unit_handle_t s_adc_handle = NULL;
static adc_cali_handle_t s_adc_cali_handle = NULL;
static bool s_adc_calibrated = false;

static EventGroupHandle_t s_wifi_event_group = NULL;
static int s_wifi_retry_count = 0;

#define WIFI_CONNECTED_BIT BIT0
#define WIFI_FAIL_BIT BIT1
#define ADC_SAMPLE_COUNT 15
#define ADC_ATTEN ADC_ATTEN_DB_12

// Connecting to WiFi

static void wifi_event_handler(void *arg,
                               esp_event_base_t event_base,
                               int32_t event_id,
                               void *event_data)
{
    if (event_base == WIFI_EVENT && event_id == WIFI_EVENT_STA_START)
    {
        esp_wifi_connect();
    }
    else if (event_base == WIFI_EVENT && event_id == WIFI_EVENT_STA_DISCONNECTED)
    {
        if (s_wifi_retry_count < WIFI_MAX_RETRY)
        {
            esp_wifi_connect();
            s_wifi_retry_count++;
            ESP_LOGW(TAG, "Retrying WiFi (%d/%d)", s_wifi_retry_count, WIFI_MAX_RETRY);
        }
        else
        {
            xEventGroupSetBits(s_wifi_event_group, WIFI_FAIL_BIT);
        }
    }
    else if (event_base == IP_EVENT && event_id == IP_EVENT_STA_GOT_IP)
    {
        ESP_LOGI(TAG, "WiFi connected");
        s_wifi_retry_count = 0;
        xEventGroupSetBits(s_wifi_event_group, WIFI_CONNECTED_BIT);
    }
}

static void wifi_init(void)
{
    s_wifi_event_group = xEventGroupCreate();

    ESP_ERROR_CHECK(nvs_flash_init());
    ESP_ERROR_CHECK(esp_netif_init());
    ESP_ERROR_CHECK(esp_event_loop_create_default());
    esp_netif_create_default_wifi_sta();

    wifi_init_config_t cfg = WIFI_INIT_CONFIG_DEFAULT();
    ESP_ERROR_CHECK(esp_wifi_init(&cfg));

    esp_event_handler_instance_t instance_any_id;
    esp_event_handler_instance_t instance_got_ip;

    ESP_ERROR_CHECK(esp_event_handler_instance_register(
        WIFI_EVENT, ESP_EVENT_ANY_ID, &wifi_event_handler, NULL, &instance_any_id));
    ESP_ERROR_CHECK(esp_event_handler_instance_register(
        IP_EVENT, IP_EVENT_STA_GOT_IP, &wifi_event_handler, NULL, &instance_got_ip));

    wifi_config_t wifi_config = {
        .sta = {
            .ssid = WIFI_SSID,
            .password = WIFI_PASSWORD,
            .threshold.authmode = WIFI_AUTH_WPA2_PSK,
        },
    };

    ESP_ERROR_CHECK(esp_wifi_set_mode(WIFI_MODE_STA));
    ESP_ERROR_CHECK(esp_wifi_set_config(WIFI_IF_STA, &wifi_config));
    ESP_ERROR_CHECK(esp_wifi_start());

    EventBits_t bits = xEventGroupWaitBits(
        s_wifi_event_group,
        WIFI_CONNECTED_BIT | WIFI_FAIL_BIT,
        pdFALSE, pdFALSE,
        portMAX_DELAY);

    if (bits & WIFI_CONNECTED_BIT)
    {
        ESP_LOGI(TAG, "WiFi ready");
    }
    else
    {
        ESP_LOGE(TAG, "WiFi failed — check credentials in config.h");
    }
}

// Reading from the shared ADC unit (TDS and pH)

static void adc_init(void)
{
    adc_oneshot_unit_init_cfg_t unit_cfg = {
        .unit_id = ADC_UNIT_1,
    };
    ESP_ERROR_CHECK(adc_oneshot_new_unit(&unit_cfg, &s_adc_handle));

    adc_oneshot_chan_cfg_t chan_cfg = {
        .bitwidth = ADC_BITWIDTH_DEFAULT,
        .atten = ADC_ATTEN,
    };

    ESP_ERROR_CHECK(adc_oneshot_config_channel(s_adc_handle, TDS_ADC_CHANNEL, &chan_cfg));
    ESP_ERROR_CHECK(adc_oneshot_config_channel(s_adc_handle, PH_ADC_CHANNEL, &chan_cfg));

#if ADC_CALI_SCHEME_LINE_FITTING_SUPPORTED
    adc_cali_line_fitting_config_t cali_cfg = {
        .unit_id = ADC_UNIT_1,
        .atten = ADC_ATTEN,
        .bitwidth = ADC_BITWIDTH_DEFAULT,
    };
    esp_err_t ret = adc_cali_create_scheme_line_fitting(&cali_cfg, &s_adc_cali_handle);
    s_adc_calibrated = (ret == ESP_OK);
#endif

    ESP_LOGI(TAG, "ADC initialised — TDS on GPIO32, pH on GPIO34");
}

static float adc_read_voltage(adc_channel_t channel, const char *name)
{
    int raw_sum = 0;
    int count = 0;

    for (int i = 0; i < ADC_SAMPLE_COUNT; i++)
    {
        int raw = 0;
        if (adc_oneshot_read(s_adc_handle, channel, &raw) == ESP_OK)
        {
            raw_sum += raw;
            count++;
        }
        vTaskDelay(pdMS_TO_TICKS(10));
    }

    if (count == 0)
        return NAN;

    int raw_avg = raw_sum / count;

    if (s_adc_calibrated)
    {
        int voltage_mv = 0;
        if (adc_cali_raw_to_voltage(s_adc_cali_handle, raw_avg, &voltage_mv) == ESP_OK)
        {
            return voltage_mv / 1000.0f;
        }
        return NAN;
    }

    return (raw_avg / 4095.0f) * 3.3f;
}

// Reading TDS

static float tds_read(float temperature)
{
    float voltage = adc_read_voltage(TDS_ADC_CHANNEL, "TDS");
    if (isnan(voltage) || voltage <= 0.0f)
        return NAN;

    // Compensating for temperature
    float compensation = 1.0f + 0.02f * (temperature - 25.0f);
    if (compensation <= 0.0f)
        return NAN;

    float compensated_voltage = voltage / compensation;

    // Converting voltage to ppm
    float tds = (133.42f * powf(compensated_voltage, 3.0f) - 255.86f * powf(compensated_voltage, 2.0f) + 857.39f * compensated_voltage) * 0.5f;

    return tds < 0.0f ? 0.0f : tds;
}

// Reading pH

static float ph_read(void)
{
    float voltage = adc_read_voltage(PH_ADC_CHANNEL, "pH");
    if (isnan(voltage) || voltage <= 0.0f)
        return NAN;

    float ph = 7.0f + ((2.50f - voltage) / 0.18f);
    if (ph < 0.0f)
        return 0.0f;
    if (ph > 14.0f)
        return 14.0f;
    return ph;
}

// Reading temperature from the DS18B20

static void ds18b20_init(void)
{
    onewire_bus_config_t bus_cfg = {
        .bus_gpio_num = DS18B20_GPIO,
        .flags = {.en_pull_up = true},
    };
    onewire_bus_rmt_config_t rmt_cfg = {.max_rx_bytes = 10};

    ESP_ERROR_CHECK(onewire_new_bus_rmt(&bus_cfg, &rmt_cfg, &s_onewire_bus));

    onewire_device_iter_handle_t iter = NULL;
    onewire_device_t device = {0};

    ESP_ERROR_CHECK(onewire_new_device_iter(s_onewire_bus, &iter));

    if (onewire_device_iter_get_next(iter, &device) == ESP_OK)
    {
        ds18b20_config_t ds_cfg = {};
        if (ds18b20_new_device_from_enumeration(&device, &ds_cfg, &s_ds18b20) == ESP_OK)
        {
            s_ds18b20_found = true;
            ds18b20_set_resolution(s_ds18b20, DS18B20_RESOLUTION_12B);
            ESP_LOGI(TAG, "DS18B20 found");
        }
    }
    else
    {
        ESP_LOGW(TAG, "DS18B20 not found — check wiring on GPIO5");
    }

    onewire_del_device_iter(iter);
}

static float temperature_read(void)
{
    if (!s_ds18b20_found || s_ds18b20 == NULL)
        return NAN;

    float temp = 0.0f;
    if (ds18b20_trigger_temperature_conversion(s_ds18b20) != ESP_OK)
        return NAN;
    if (ds18b20_get_temperature(s_ds18b20, &temp) != ESP_OK)
        return NAN;
    return temp;
}

// Measuring water level with the HC-SR04

static void ultrasonic_init(void)
{
    gpio_config_t trig_cfg = {
        .pin_bit_mask = (1ULL << ULTRASONIC_TRIG_PIN),
        .mode = GPIO_MODE_OUTPUT,
        .pull_down_en = GPIO_PULLDOWN_DISABLE,
        .pull_up_en = GPIO_PULLUP_DISABLE,
        .intr_type = GPIO_INTR_DISABLE,
    };
    ESP_ERROR_CHECK(gpio_config(&trig_cfg));
    gpio_set_level(ULTRASONIC_TRIG_PIN, 0);

    gpio_config_t echo_cfg = {
        .pin_bit_mask = (1ULL << ULTRASONIC_ECHO_PIN),
        .mode = GPIO_MODE_INPUT,
        .pull_down_en = GPIO_PULLDOWN_DISABLE,
        .pull_up_en = GPIO_PULLUP_DISABLE,
        .intr_type = GPIO_INTR_DISABLE,
    };
    ESP_ERROR_CHECK(gpio_config(&echo_cfg));
}

static float ultrasonic_read_distance_cm(void)
{
    gpio_set_level(ULTRASONIC_TRIG_PIN, 0);
    esp_rom_delay_us(2);
    gpio_set_level(ULTRASONIC_TRIG_PIN, 1);
    esp_rom_delay_us(10);
    gpio_set_level(ULTRASONIC_TRIG_PIN, 0);

    int64_t start = esp_timer_get_time();
    while (gpio_get_level(ULTRASONIC_ECHO_PIN) == 0)
    {
        if ((esp_timer_get_time() - start) > 30000)
            return NAN;
    }

    int64_t echo_start = esp_timer_get_time();
    while (gpio_get_level(ULTRASONIC_ECHO_PIN) == 1)
    {
        if ((esp_timer_get_time() - echo_start) > 30000)
            return NAN;
    }
    int64_t echo_end = esp_timer_get_time();

    float distance_cm = (echo_end - echo_start) * 0.0343f / 2.0f;

    if (distance_cm < 2.0f || distance_cm > 400.0f)
        return NAN;
    return distance_cm;
}

// Converting distance to a water level percentage
// Sensor sits at the top of the tank pointing down: 2cm means full, TANK_HEIGHT_CM means empty
static float distance_to_level_percent(float distance_cm)
{
    if (isnan(distance_cm))
        return NAN;

    float water_depth = TANK_HEIGHT_CM - distance_cm;
    if (water_depth < 0.0f)
        water_depth = 0.0f;

    float level_percent = (water_depth / TANK_HEIGHT_CM) * 100.0f;
    if (level_percent > 100.0f)
        level_percent = 100.0f;

    return level_percent;
}

// Posting a reading to the AquaSense backend

static bool post_reading(float level, float temperature, float tds, float ph)
{
    // Building the JSON payload — turbidity stays null until the sensor is wired and confirmed
    char json[300];
    snprintf(json, sizeof(json),
             "{\"level\":%.1f,\"temperature\":%.2f,\"tds\":%.1f,\"ph\":%.2f,\"turbidity\":null}",
             level, temperature, tds, ph);

    ESP_LOGI(TAG, "Posting: %s", json);

    esp_http_client_config_t config = {
        .url = READINGS_ENDPOINT,
        .method = HTTP_METHOD_POST,
        .crt_bundle_attach = esp_crt_bundle_attach,
        .timeout_ms = 15000,
    };

    esp_http_client_handle_t client = esp_http_client_init(&config);
    if (client == NULL)
    {
        ESP_LOGE(TAG, "Failed to create HTTP client");
        return false;
    }

    // Setting the headers AquaSense needs for device authentication
    esp_http_client_set_header(client, "Content-Type", "application/json");
    esp_http_client_set_header(client, "X-Device-Key", DEVICE_API_KEY);
    esp_http_client_set_post_field(client, json, strlen(json));

    esp_err_t err = esp_http_client_perform(client);
    int status = esp_http_client_get_status_code(client);
    esp_http_client_cleanup(client);

    if (err != ESP_OK || status < 200 || status >= 300)
    {
        ESP_LOGE(TAG, "POST failed: err=%s status=%d", esp_err_to_name(err), status);
        return false;
    }

    ESP_LOGI(TAG, "Reading posted successfully — HTTP %d", status);
    return true;
}

// Running the main loop

void app_main(void)
{
    ESP_LOGI(TAG, "AquaSense ESP32 starting...");

    // Bringing up WiFi and all sensors
    wifi_init();
    ultrasonic_init();
    adc_init();
    ds18b20_init();

    ESP_LOGI(TAG, "All sensors initialised. Starting reading loop.");

    while (1)
    {
        ESP_LOGI(TAG, "--- Reading sensors ---");

        // Reading temperature first since TDS needs it for compensation
        float temperature = temperature_read();
        float ref_temp = isnan(temperature) ? 25.0f : temperature;

        // Reading the remaining sensors
        float distance_cm = ultrasonic_read_distance_cm();
        float level = distance_to_level_percent(distance_cm);
        float tds = tds_read(ref_temp);
        float ph = ph_read();

        // Logging everything
        ESP_LOGI(TAG, "Temperature: %.2f C", isnan(temperature) ? 0.0f : temperature);
        ESP_LOGI(TAG, "Distance: %.2f cm | Level: %.1f%%",
                 isnan(distance_cm) ? 0.0f : distance_cm,
                 isnan(level) ? 0.0f : level);
        ESP_LOGI(TAG, "TDS: %.1f ppm", isnan(tds) ? 0.0f : tds);
        ESP_LOGI(TAG, "pH: %.2f", isnan(ph) ? 0.0f : ph);

        // Posting only when the core sensors give valid readings
        if (!isnan(level) && !isnan(tds) && !isnan(ph))
        {
            post_reading(level, ref_temp, tds, ph);
        }
        else
        {
            ESP_LOGW(TAG, "Skipping POST — one or more sensors returned invalid reading");
        }

        ESP_LOGI(TAG, "--- Waiting %d seconds ---", READING_INTERVAL_MS / 1000);
        vTaskDelay(pdMS_TO_TICKS(READING_INTERVAL_MS));
    }
}