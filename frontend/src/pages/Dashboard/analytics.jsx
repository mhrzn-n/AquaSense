import { useState, useEffect } from "react";
import { Card } from "flowbite-react";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  BarElement,
  PointElement,
  LinearScale,
  CategoryScale,
} from "chart.js";
import { motion } from "motion/react";

ChartJS.register(
  LineElement,
  PointElement,
  BarElement,
  LinearScale,
  CategoryScale
);

// Function to generate a bubble with random properties
const generateBubble = () => ({
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: 30 + Math.random() * 60,
  offsetX: Math.random() * 20 - 10,
  offsetY: Math.random() * 20 - 10,
});

const Analytics = () => {
  const [filter, setFilter] = useState("today");

  // Initialize bubbles
  const [bubbles, setBubbles] = useState(
    Array.from({ length: 14 }).map(() => generateBubble())
  );

  // Update bubble offsets periodically for smooth drifting
  useEffect(() => {
    const interval = setInterval(() => {
      setBubbles((prev) =>
        prev.map((b) => ({
          ...b,
          offsetX: Math.random() * 20 - 10,
          offsetY: Math.random() * 20 - 10,
        }))
      );
    }, 4000); // update every 4 seconds
    return () => clearInterval(interval);
  }, []);

  const mockData = {
    today: {
      waterLevels: [
        { time: "10:00", value: 80 },
        { time: "10:10", value: 78 },
        { time: "10:20", value: 76 },
        { time: "10:30", value: 74 },
        { time: "10:40", value: 72 },
      ],
      pumpHours: [{ day: "Today", hours: 2.3 }],
    },
    week: {
      waterLevels: [
        { time: "Mon", value: 90 },
        { time: "Tue", value: 85 },
        { time: "Wed", value: 82 },
        { time: "Thu", value: 78 },
        { time: "Fri", value: 80 },
        { time: "Sat", value: 75 },
        { time: "Sun", value: 70 },
      ],
      pumpHours: [
        { day: "Mon", hours: 4 },
        { day: "Tue", hours: 3.5 },
        { day: "Wed", hours: 4.2 },
        { day: "Thu", hours: 3.8 },
        { day: "Fri", hours: 4.5 },
        { day: "Sat", hours: 2 },
        { day: "Sun", hours: 1.5 },
      ],
    },
    month: {
      waterLevels: [
        { time: "Week 1", value: 88 },
        { time: "Week 2", value: 82 },
        { time: "Week 3", value: 79 },
        { time: "Week 4", value: 73 },
      ],
      pumpHours: [
        { day: "Week 1", hours: 15 },
        { day: "Week 2", hours: 18 },
        { day: "Week 3", hours: 16 },
        { day: "Week 4", hours: 12 },
      ],
    },
  };

  const current = mockData[filter];

  const lineChartData = {
    labels: current.waterLevels.map((x) => x.time),
    datasets: [
      {
        label: "Water Level (%)",
        data: current.waterLevels.map((x) => x.value),
        borderWidth: 3,
        borderColor: "#0099cc",
        backgroundColor: "rgba(0, 153, 204, 0.25)",
      },
    ],
  };

  const barChartData = {
    labels: current.pumpHours.map((x) => x.day),
    datasets: [
      {
        label: "Pump Run Hours",
        data: current.pumpHours.map((x) => x.hours),
        backgroundColor: "rgba(0, 180, 255, 0.55)",
        borderColor: "#00aaff",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="relative min-h-screen p-6 overflow-hidden">
      {/* Smooth drifting bubbles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {bubbles.map((b, i) => (
          <motion.div
            key={i}
            animate={{
              x: b.x + b.offsetX,
              y: b.y + b.offsetY,
              scale: [1, 1.15, 1],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              type: "spring",
              stiffness: 15,
              damping: 12,
              repeat: Infinity,
              repeatType: "mirror",
            }}
            className="absolute rounded-full bg-blue-300/40 blur-md shadow-xl"
            style={{
              width: b.size,
              height: b.size,
              left: `${b.x}%`,
              top: `${b.y}%`,
            }}
          />
        ))}
      </div>

      <h1 className="font-bold drop-shadow-md relative z-10 md:text-4xl">
        Analytics Overview
      </h1>

      <div className="flex justify-end mb-4 relative z-10">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border rounded-xl px-3 py-2 bg-white/70 backdrop-blur-md shadow-md"
        >
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
        </select>
      </div>

      <Card className="water-card mb-6 relative z-10">
        <h2 className="text-2xl font-semibold mb-4 text-blue-700">
          Water Level Trend
        </h2>
        <Line data={lineChartData} />
      </Card>

      <Card className="water-card relative z-10">
        <h2 className="text-2xl font-semibold mb-4 text-blue-700">
          Pump Activity (Hours)
        </h2>
        <Bar data={barChartData} />
      </Card>
    </div>
  );
};

export default Analytics;
