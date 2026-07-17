import { motion as Motion } from "motion/react";
import Container from "../components/Container";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const plans = [
  {
    name: "Basic",
    price: "1000Rs/mo",
    priceId: "price_1Nxxx1BASIC",
    features: [
      "Monitor 1 Water Tank",
      "Real-Time Level Updates",
      "Email Alerts",
    ],
    color: "from-blue-400 to-blue-600",
  },
  {
    name: "Pro",
    price: "2000Rs/mo",
    priceId: "price_1Nxxx2PRO",
    features: [
      "Monitor up to 3 Tanks",
      "Real-Time Control Access",
      "SMS + Email Alerts",
      "Usage Analytics",
    ],
    color: "from-teal-400 to-blue-500",
    popular: true,
  },
  {
    name: "Premium",
    price: "4000Rs/mo",
    priceId: "price_1Nxxx3PREMIUM",
    features: [
      "Unlimited Tanks",
      "Full Automation Control",
      "Priority Support",
    ],
    color: "from-cyan-400 to-blue-600",
  },
];

const SubscriptionPage = () => {
  const navigate = useNavigate();
  const [loadingPlan, setLoadingPlan] = useState(null);

  const handleSubscribe = async (plan) => {
    const token = Cookies.get("authToken");

    // If not logged in, redirect to signin first
    if (!token) {
      navigate("/signin");
      return;
    }

    setLoadingPlan(plan.name);

    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.post(
        "https://AquaSense.onrender.com/api/payment",
        {
          planName: plan.name,
          priceId: plan.priceId,
          price: plan.price,
        },
        { headers }
      );

      window.location.href = response.data.url;
    } catch (err) {
      console.error("Payment error:", err);
      alert("Failed to initiate payment. Please try again.");
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <Container>
      <section className="min-h-screen flex flex-col items-center justify-center py-16 px-4 md:px-10">
        <Motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-blue-700 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-gray-600 md:text-lg">
            Get started with the perfect plan for your smart water monitoring
            system.
          </p>
        </Motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full">
          {plans.map((plan, i) => (
            <Motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2, duration: 0.8, ease: "easeOut" }}
              whileHover={{ scale: 1.05 }}
              className={`relative bg-white/60 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-white/40 hover:shadow-2xl transition-all duration-500 ${
                plan.popular ? "ring-2 ring-blue-400" : ""
              }`}
            >
              <Motion.div
                className={`absolute inset-0 rounded-2xl bg-linear-to-r ${plan.color} opacity-20 blur-xl`}
                animate={{ opacity: [0.15, 0.25, 0.15] }}
                transition={{
                  repeat: Infinity,
                  duration: 3,
                  ease: "easeInOut",
                }}
              ></Motion.div>

              <div className="relative z-10">
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-sm font-semibold px-3 py-1 rounded-full shadow-md">
                    Most Popular
                  </div>
                )}

                <h2 className="text-2xl font-bold text-blue-700 mb-4">
                  {plan.name}
                </h2>
                <p className="text-4xl font-bold text-blue-600 mb-6">
                  {plan.price}
                </p>

                <ul className="space-y-3 text-gray-700 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="text-blue-500">✔</span> {feature}
                    </li>
                  ))}
                </ul>

                <Motion.button
                  onClick={() => handleSubscribe(plan)}
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ backgroundColor: "#2563eb" }}
                  className="w-full py-3 font-semibold text-white bg-blue-500 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                >
                  {loadingPlan === plan.name ? "Processing..." : "Subscribe"}
                </Motion.button>
              </div>
            </Motion.div>
          ))}
        </div>
      </section>
    </Container>
  );
};

export default SubscriptionPage;
