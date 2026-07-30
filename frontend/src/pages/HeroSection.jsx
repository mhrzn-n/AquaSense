import { Link } from "react-router-dom";
import { Droplet, Activity, Shield, ArrowRight } from "lucide-react";

const stats = [
  { label: "Sensors Monitored", value: "5" },
  { label: "Update Interval", value: "30s" },
  { label: "Freshness Forecast", value: "AI" },
];

const mockReadings = [
  { label: "TDS", value: "340 ppm", status: "good" },
  { label: "pH Level", value: "7.2", status: "good" },
  { label: "Temperature", value: "27.3°C", status: "good" },
  { label: "Water Level", value: "72%", status: "warning" },
  { label: "Freshness", value: "18.5 hrs", status: "good" },
];

const statusColor = {
  good: "bg-green-100 text-green-700",
  warning: "bg-yellow-100 text-yellow-700",
  danger: "bg-red-100 text-red-700",
};

const HeroSection = () => {
  return (
    <section className="relative w-full overflow-hidden bg-white">
      {/* Radial glow background */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(59,169,252,0.15) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 pt-24 pb-16">
        {/* Badge */}
        <div className="flex justify-center mb-6">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-semibold tracking-wide uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            IoT Water Quality Monitoring
          </span>
        </div>

        {/* Headline */}
        <div className="text-center max-w-3xl mx-auto mb-6">
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 leading-tight tracking-tight">
            Every Drop,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
              Under Control
            </span>
          </h1>
        </div>

        {/* Subheading */}
        <p className="text-center text-lg text-slate-500 max-w-xl mx-auto mb-10 leading-relaxed">
          AquaSense monitors your water tank in real time-tracking TDS, pH,
          temperature, and predicting freshness before quality degrades.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-lg shadow-blue-600/25"
          >
            Get Started Free
            <ArrowRight size={16} />
          </Link>
          <Link
            to="/demo"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-slate-700 text-sm font-semibold rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all duration-200 shadow-sm"
          >
            View Demo
          </Link>
        </div>

        {/* Stats Row */}
        <div className="flex items-center justify-center gap-8 mb-16">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
              <div className="text-xs text-slate-400 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Dashboard Mockup */}
        <div className="relative max-w-4xl mx-auto">
          {/* Glow behind mockup */}
          <div className="absolute inset-0 bg-gradient-to-b from-blue-100/40 to-transparent rounded-3xl blur-2xl -z-10 scale-95" />

          <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl shadow-slate-200/60 overflow-hidden">
            {/* Mockup Header Bar */}
            <div className="flex items-center gap-2 px-5 py-3 border-b border-slate-100 bg-slate-50">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
              <div className="flex-1 mx-4">
                <div className="bg-white border border-slate-200 rounded-md px-3 py-1 text-xs text-slate-400 text-center">
                  aquasense.vercel.app/dashboard
                </div>
              </div>
            </div>

            {/* Mockup Content */}
            <div className="p-6 bg-slate-50">
              {/* Tank Header */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">Rooftop Tank</h3>
                  <p className="text-xs text-slate-400">overhead — 1000L capacity</p>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 font-medium">
                  Live
                </span>
              </div>

              {/* Water Level Bar */}
              <div className="mb-5">
                <div className="flex justify-between text-xs text-slate-500 mb-1">
                  <span>Water Level</span>
                  <span className="font-semibold text-slate-700">72%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400"
                    style={{ width: "72%" }}
                  />
                </div>
              </div>

              {/* Sensor Cards Grid */}
<div className="grid grid-cols-3 gap-3 mb-5">
  {mockReadings.map((reading, i) => {
    const cardStyle = {
      good: "bg-emerald-50 border-emerald-100",
      warning: "bg-amber-50 border-amber-100",
      danger: "bg-red-50 border-red-100",
    }[reading.status];
    const badgeStyle = {
      good: "bg-emerald-100 text-emerald-700",
      warning: "bg-amber-100 text-amber-700",
      danger: "bg-red-100 text-red-700",
    }[reading.status];
    const dotStyle = {
      good: "bg-emerald-400",
      warning: "bg-amber-400",
      danger: "bg-red-400",
    }[reading.status];
    return (
      <div
        key={i}
        className={`rounded-2xl border p-3 ${cardStyle}`}
      >
        <div className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">
          {reading.label}
        </div>
        <div className="text-sm font-bold text-slate-800">{reading.value}</div>
        <div className="mt-1.5 flex items-center gap-1">
          <span className={`w-1.5 h-1.5 rounded-full ${dotStyle}`} />
          <span className={`text-xs font-medium px-1.5 py-0.5 rounded-full ${badgeStyle}`}>
            {reading.status}
          </span>
        </div>
      </div>
    );
  })}
</div>

              {/* Forecast Bar */}
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Droplet size={18} className="text-blue-500" />
                  <div>
                    <div className="text-xs font-semibold text-blue-700">
                      Predictive Freshness Forecast
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      Not a safety certification
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-blue-700">18.5h</div>
                  <div className="text-xs text-slate-400">remaining</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Pills */}
      <div className="max-w-7xl mx-auto px-6 pb-20">
        <div className="flex flex-wrap justify-center gap-3 mt-10">
          {[
            { icon: <Droplet size={14} />, text: "Real-time sensor data" },
            { icon: <Activity size={14} />, text: "Predictive freshness forecasting" },
            { icon: <Shield size={14} />, text: "Automated quality alerts" },
          ].map((pill, i) => (
            <div
              key={i}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50 border border-slate-200 text-slate-600 text-sm font-medium"
            >
              <span className="text-blue-500">{pill.icon}</span>
              {pill.text}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;