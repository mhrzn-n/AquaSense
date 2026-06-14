import Container from "../components/Container";

const DemoSection = () => {
  const demoData = {
    waterLevel: 65,
    pumpStatus: "ON",
    temperature: 28,
    sensorHealth: "OK",
  };

  return (
    <Container>
      <section id="demo" className="w-full py-12 md:py-20 min-h-[85vh] flex items-center">
        <div className="max-w-4xl px-4 mx-auto text-center">
          <h3 className="mb-10 text-2xl font-bold text-gray-800 md:text-3xl">
            Live Demo
          </h3>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {/* Water Level */}
            <div className="p-6 transition-all bg-white shadow-md rounded-xl hover:shadow-lg">
              <p className="mb-3 text-lg font-semibold text-gray-700">
                Water Level
              </p>
              <div className="w-full h-5 bg-gray-200 rounded-full">
                <div
                  className="h-5 transition-all duration-500 bg-blue-600 rounded-full"
                  style={{ width: `${demoData.waterLevel}%` }}
                ></div>
              </div>
              <p className="mt-2 font-medium text-gray-600">
                {demoData.waterLevel}%
              </p>
            </div>

            {/* Pump Status */}
            <div className="p-6 transition-all bg-white shadow-md rounded-xl hover:shadow-lg">
              <p className="mb-2 text-lg font-semibold text-gray-700">
                Pump Status
              </p>
              <p
                className={`text-xl font-bold ${
                  demoData.pumpStatus === "ON"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {demoData.pumpStatus}
              </p>
            </div>

            {/* Temperature */}
            <div className="p-6 transition-all bg-white shadow-md rounded-xl hover:shadow-lg">
              <p className="mb-2 text-lg font-semibold text-gray-700">
                Temperature
              </p>
              <p className="text-xl font-bold text-blue-500">
                {demoData.temperature}°C
              </p>
            </div>

            {/* Sensor Health */}
            <div className="p-6 transition-all bg-white shadow-md rounded-xl hover:shadow-lg">
              <p className="mb-2 text-lg font-semibold text-gray-700">
                Sensor Health
              </p>
              <p
                className={`text-xl font-bold ${
                  demoData.sensorHealth === "OK"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {demoData.sensorHealth}
              </p>
            </div>
          </div>
        </div>
      </section>
    </Container>
  );
};

export default DemoSection;
