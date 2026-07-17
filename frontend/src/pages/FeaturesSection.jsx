import Container from "../components/Container";

const features = [
  {
    title: "Real-time Level Monitoring",
    desc: "Always know your water tank status instantly.",
  },
  {
    title: "Automatic Pump Control",
    desc: "Turn pumps ON/OFF automatically based on level.",
  },
  {
    title: "Mobile Notifications",
    desc: "Get alerts on your phone for overflow or low water.",
  },
  {
    title: "Cloud Database",
    desc: "Store all readings securely on Firebase.",
  },
];

const FeaturesSection = () => {
  return (
    <Container>
      <section id="features" className="w-full py-12 md:py-20 min-h-[85vh] flex items-center">
        <div className="max-w-6xl px-4 mx-auto text-center">
          <h3 className="mb-10 text-2xl font-bold text-gray-800 md:text-3xl">
            Key Features
          </h3>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center p-6 text-center transition-all duration-300 shadow-md bg-blue-50 rounded-xl hover:shadow-lg hover:-translate-y-1"
              >
                <h4 className="mb-2 text-xl font-semibold text-blue-700">
                  {feature.title}
                </h4>
                <p className="text-gray-700">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Container>
  );
};

export default FeaturesSection;
