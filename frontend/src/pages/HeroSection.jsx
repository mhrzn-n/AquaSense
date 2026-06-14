import { motion } from "motion/react";
import Container from "../components/Container";
import { Link } from "react-router-dom";
import WaterButton from "../components/WaterButton";

const containerVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1,
      ease: "easeOut",
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const HeroSection = () => {
  return (
    <Container>
      <section className="flex flex-col items-center justify-center w-full min-h-[80vh] text-center px-4 md:px-8">
        <motion.div
          className="max-w-4xl"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h2
            className="mb-4 text-3xl font-bold leading-tight text-gray-800 md:text-5xl"
            variants={itemVariants}
          >
            Smart IoT Water Tank Monitoring System
          </motion.h2>

          <motion.p
            className="mb-8 text-base text-gray-700 md:text-lg"
            variants={itemVariants}
          >
            Monitor and control your water tank remotely in real time with smart
            automation and live insights.
          </motion.p>

          {/* Buttons */}
          <motion.div
            className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6"
            variants={itemVariants}
          >
            <WaterButton to="/demo">Live Demo</WaterButton>

            <Link
              to="/features"
              className="px-8 py-3 text-blue-600 transition-all duration-300 bg-white border border-blue-600 rounded-lg shadow hover:bg-blue-50"
            >
              Learn More
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </Container>
  );
};

export default HeroSection;
