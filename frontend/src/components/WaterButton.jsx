import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { useState } from "react";

const WaterButton = ({ to, children }) => {
  const [ripples, setRipples] = useState([]);

  const handleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newRipple = { x, y, id: Date.now() };
    setRipples((prev) => [...prev, newRipple]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 1000);
  };

  return (
    <Link
      to={to}
      onClick={handleClick}
      className="relative inline-block rounded-lg overflow-hidden px-8 py-3 font-semibold text-white text-lg"
    >
      {/* Smooth wavy water background */}
      <motion.div
        className="absolute inset-0 rounded-lg"
        style={{
          background:
            "radial-gradient(circle at 20% 30%, #6ec6ff, transparent 40%)," +
            "radial-gradient(circle at 80% 70%, #4fc3f7, transparent 40%)," +
            "radial-gradient(circle at 50% 50%, #29b6f6, transparent 40%)",
          backgroundSize: "200% 200%",
        }}
        animate={{
          backgroundPosition: [
            "0% 0%",
            "25% 25%",
            "50% 50%",
            "75% 25%",
            "100% 0%",
            "0% 0%",
          ],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Button Text */}
      <div className="relative z-10">{children}</div>

      {/* Ripple effect */}
      {ripples.map((r) => (
        <motion.span
          key={r.id}
          className="absolute rounded-full bg-white/30"
          style={{
            left: r.x,
            top: r.y,
            width: 20,
            height: 20,
            translateX: "-50%",
            translateY: "-50%",
          }}
          initial={{ scale: 0, opacity: 0.6 }}
          animate={{ scale: 12, opacity: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      ))}

      {/* Optional subtle overlay for shimmer */}
      <motion.div
        className="absolute inset-0 rounded-lg pointer-events-none"
        style={{
          background:
            "repeating-linear-gradient(45deg, rgba(255,255,255,0.08) 0, rgba(255,255,255,0.02) 10px, rgba(255,255,255,0.08) 20px)",
          mixBlendMode: "overlay",
        }}
        animate={{ x: ["-20%", "20%"], y: ["0%", "10%"] }}
        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
      />
    </Link>
  );
};

export default WaterButton;
