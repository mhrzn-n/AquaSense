import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
} from "chart.js";
import { getTanks, getReadings } from "../../services/api";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend
);

const chartOptions = {
  responsive: true,
  plugins: { legend: { display: false } },
  scales: {
    x: { grid: { display: false } },
    y: { grid: { color: 'rgba(0,0,0,0.05)' } },
  },
};

const makeChartData = (readings, field, color) => ({
  labels: readings.map(r =>
    new Date(r.recorded_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  ),
  datasets: [{
    data: readings.map(r => r[field]),
    borderColor: color,
    backgroundColor: color + '33',
    borderWidth: 2,
    pointRadius: 3,
    tension: 0.4,
  }],
});

const Analytics = () => {
  const [tanks, setTanks] = useState([]);
  const [selectedTankId, setSelectedTankId] = useState(null);
  const [readings, setReadings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getTanks()
      .then(data => {
        const list = data.tanks || [];
        setTanks(list);
        if (list.length > 0) setSelectedTankId(list[0].tankId);
      })
      .catch(() => setError('Failed to load tanks.'));
  }, []);

  useEffect(() => {
    if (!selectedTankId) return;
    setLoading(true);
    getReadings(selectedTankId, 50)
      .then(data => setReadings(data.readings || []))
      .catch(() => setError('Failed to load readings.'))
      .finally(() => setLoading(false));
  }, [selectedTankId]);

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-5xl mx-auto">

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Analytics</h1>
          <p className="mt-2 text-slate-600">
            Historical sensor readings for your tanks
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
            {error}
          </div>
        )}

        {/* TANK SELECTOR */}
        {tanks.length > 0 && (
          <div className="flex gap-3 mb-6 flex-wrap">
            {tanks.map(tank => (
              <button
                key={tank.tankId}
                onClick={() => setSelectedTankId(tank.tankId)}
                className={`px-4 py-2 rounded-xl font-medium transition ${
                  selectedTankId === tank.tankId
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-blue-50'
                }`}
              >
                {tank.tankName}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : readings.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-slate-200">
            <p className="text-slate-500">No readings yet for this tank.</p>
            <p className="text-slate-400 text-sm mt-2">
              Readings will appear here once your ESP32 starts sending data.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* WATER LEVEL */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
              <h2 className="text-lg font-semibold text-slate-800 mb-1">
                Water Level
              </h2>
              <p className="text-xs text-slate-400 mb-4">%</p>
              <Line data={makeChartData(readings, 'level', '#3b82f6')} options={chartOptions} />
            </div>

            {/* TEMPERATURE */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
              <h2 className="text-lg font-semibold text-slate-800 mb-1">
                Temperature
              </h2>
              <p className="text-xs text-slate-400 mb-4">°C</p>
              <Line data={makeChartData(readings, 'temperature', '#f97316')} options={chartOptions} />
            </div>

            {/* TDS */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
              <h2 className="text-lg font-semibold text-slate-800 mb-1">
                TDS — Total Dissolved Solids
              </h2>
              <p className="text-xs text-slate-400 mb-4">ppm — good below 300</p>
              <Line data={makeChartData(readings, 'tds', '#8b5cf6')} options={chartOptions} />
            </div>

            {/* PH */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
              <h2 className="text-lg font-semibold text-slate-800 mb-1">
                pH Level
              </h2>
              <p className="text-xs text-slate-400 mb-4">good range 6.5–8.5</p>
              <Line data={makeChartData(readings, 'ph', '#10b981')} options={chartOptions} />
            </div>

            {/* TURBIDITY */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
              <h2 className="text-lg font-semibold text-slate-800 mb-1">
                Turbidity
              </h2>
              <p className="text-xs text-slate-400 mb-4">NTU — good below 2</p>
              <Line data={makeChartData(readings, 'turbidity', '#06b6d4')} options={chartOptions} />
            </div>

            {/* FRESHNESS WINDOW */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
              <h2 className="text-lg font-semibold text-slate-800 mb-1">
                Freshness Window
              </h2>
              <p className="text-xs text-slate-400 mb-4">hours remaining — not a safety verdict</p>
              <Line data={makeChartData(readings, 'freshness_window_hours', '#f59e0b')} options={chartOptions} />
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;