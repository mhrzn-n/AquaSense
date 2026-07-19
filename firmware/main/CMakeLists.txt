idf_component_register(
    SRCS "main.c"
    PRIV_REQUIRES
        esp_wifi
        esp_event
        esp_netif
        nvs_flash
        esp_http_client
        esp-tls
        esp_timer
        driver
        esp_adc
)