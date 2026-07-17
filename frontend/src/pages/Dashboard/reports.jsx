import { useState, useEffect } from "react";
import { getTanks, getReadings } from "../../services/api";

const Reports = () => {
  const [tanks, setTanks] = useState([]);
  const [selectedTankId, setSelectedTankId] = useState(null);
  const [readings, setReadings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    getTanks()
      .then(data => {
        const list = data.tanks || [];
        setTanks(list);
        if (list.length > 0) setSelectedTankId(list[0].tankId);
      })
      .catch(() => setError("Failed to load tanks."));
  }, []);

  useEffect(() => {
    if (!selectedTankId) return;
    setLoading(true);
    getReadings(selectedTankId, 100)
      .then(data => setReadings(data.readings || []))
      .catch(() => setError("Failed to load readings."))
      .finally(() => setLoading(false));
  }, [selectedTankId]);

  const filteredReadings = readings.filter(r => {
    const date = new Date(r.recorded_at);
    if (fromDate && date < new Date(fromDate)) return false;
    if (toDate && date > new Date(toDate + "T23:59:59")) return false;
    return true;
  });

  const downloadCSV = () => {
    if (!filteredReadings.length) return;

    const headers = "Timestamp,Level (%),Temperature (°C),TDS (ppm),pH,Turbidity (NTU),Freshness Window (hrs),Risk Score";
    const rows = filteredReadings.map(r =>
      `${new Date(r.recorded_at).toLocaleString()},${r.level},${r.temperature},${r.tds},${r.ph},${r.turbidity},${r.freshness_window_hours},${r.risk_score}`
    );
    const csv = [headers, ...rows].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `AquaSense_Report_${selectedTankId}_${fromDate || "all"}_to_${toDate || "now"}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Reports</h1>
          <p className="mt-2 text-slate-600">
            Export historical sensor readings for your tanks
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

        {/* FILTERS AND DOWNLOAD */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 mb-6">
          <div className="flex flex-wrap gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">
                From Date
              </label>
              <input
                type="date"
                value={fromDate}
                onChange={e => setFromDate(e.target.value)}
                className="px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-blue-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">
                To Date
              </label>
              <input
                type="date"
                value={toDate}
                onChange={e => setToDate(e.target.value)}
                className="px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-blue-400"
              />
            </div>
            <button
              onClick={downloadCSV}
              disabled={!filteredReadings.length}
              className="px-5 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition disabled:opacity-50"
            >
              Download CSV
            </button>
            <span className="text-sm text-slate-400 self-center">
              {filteredReadings.length} reading{filteredReadings.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* TABLE */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredReadings.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-slate-200">
            <p className="text-slate-500">No readings found for the selected range.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">Timestamp</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">Level %</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">Temp °C</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">TDS ppm</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">pH</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">Turbidity NTU</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">Freshness hrs</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">Risk Score</th>
                </tr>
              </thead>
              <tbody>
                {filteredReadings.map((r, i) => (
                  <tr key={i} className="border-b border-slate-50 hover:bg-slate-50 transition">
                    <td className="px-4 py-3 text-slate-700">
                      {new Date(r.recorded_at).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-slate-700">{r.level ?? '—'}</td>
                    <td className="px-4 py-3 text-slate-700">{r.temperature ?? '—'}</td>
                    <td className="px-4 py-3 text-slate-700">{r.tds ?? '—'}</td>
                    <td className="px-4 py-3 text-slate-700">{r.ph ?? '—'}</td>
                    <td className="px-4 py-3 text-slate-700">{r.turbidity ?? '—'}</td>
                    <td className="px-4 py-3 text-slate-700">{r.freshness_window_hours ?? '—'}</td>
                    <td className="px-4 py-3 text-slate-700">{r.risk_score ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;