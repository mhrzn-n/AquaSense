import Container from "../components/Container";
import viedo from "../assets/viedo.mp4";

const H20Video = () => {
  return (
    <Container>
      <section className="w-full py-12 md:py-20 min-h-[85vh] flex items-center">
        <div className="flex flex-col items-center justify-between gap-10 px-4 mx-auto md:flex-row">
          <div className="flex-1 text-center md:text-left">
            <h3 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
              Smart IoT Water Tank Monitoring System
            </h3>

            <p className="mb-4 text-gray-700 leading-relaxed text-justify">
              Our Smart IoT Water Tank Monitoring System is designed to simplify
              and automate the way you manage your home, commercial, or
              industrial water supply. Using real-time IoT technology, the
              system continuously tracks water levels, consumption patterns, and
              tank status — directly from your mobile device.
            </p>

            <p className="mb-4 text-gray-700 leading-relaxed text-justify">
              The system uses high-precision sensors to detect water volume and
              sends instant alerts when the tank is full, running low, or
              experiencing abnormal usage. This eliminates manual checking and
              prevents issues such as overflow, pump burnout, or unexpected
              water shortages.
            </p>

            <p className="mb-4 text-gray-700 leading-relaxed text-justify">
              With live dashboards, automated pump control, and long-range
              wireless communication, the system ensures maximum efficiency
              while reducing water wastage. Whether it's for residential
              buildings, farms, schools, or factories, our solution offers
              reliability, convenience, and complete transparency over your
              water system.
            </p>

            <p className="text-gray-700 leading-relaxed text-justify">
              Built with modern IoT architecture, this system is scalable,
              energy-efficient, and customizable — making it a smart investment
              for sustainable water management in today's world.
            </p>
          </div>

          <div className="flex-1 flex justify-center">
            <video
              className="w-full max-w-md rounded-lg shadow-lg"
              src={viedo}
              autoPlay
              muted
              loop
              playsInline
            />
          </div>
        </div>
      </section>
    </Container>
  );
};

export default H20Video;
