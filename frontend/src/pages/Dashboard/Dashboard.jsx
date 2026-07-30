import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Droplet, Thermometer, Beaker, Wind, FlaskConical, Activity } from "lucide-react";
import { collection, onSnapshot } from "firebase/firestore";
import { db, auth } from "../../firebase/Firebase";
import TankForm from "../../components/TankForm";
import ForecastWidget from "../../components/ForecastWidget";
import { deleteTank } from "../../services/api";
import { getStatus } from "../../utils/getStatus";

const sensorConfig = [
  { key: "temperature", label: "Temperature", unit: "°C", icon: Thermometer },
  { key: "tds", label: "TDS", unit: "ppm", icon: Beaker },
  { key: "ph", label: "pH Level", unit: "", icon: FlaskConical },
  { key: "freshness_window_hours", label: "Freshness", unit: "hrs", icon: Droplet },
];

const statusStyles = {
  good: {
    card: "bg-emerald-50 border-emerald-100",
    badge: "bg-emerald-100 text-emerald-700",
    icon: "text-emerald-500",
    dot: "bg-emerald-400",
  },
  warning: {
    card: "bg-amber-50 border-amber-100",
    badge: "bg-amber-100 text-amber-700",
    icon: "text-amber-500",
    dot: "bg-amber-400",
  },
  danger: {
    card: "bg-red-50 border-red-100",
    badge: "bg-red-100 text-red-700",
    icon: "text-red-500",
    dot: "bg-red-400",
  },
  unknown: {
    card: "bg-slate-50 border-slate-100",
    badge: "bg-slate-100 text-slate-500",
    icon: "text-slate-400",
    dot: "bg-slate-300",
  },
};

const SensorCard = ({ label, value, unit, status, Icon }) => {
  const style = statusStyles[status] || statusStyles.unknown;
  return (
    <div className={`rounded-2xl border p-4 transition-all duration-200 ${style.card}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
          {label}
        </span>
        <div className={`p-1.5 rounded-lg bg-white shadow-sm ${style.icon}`}>
          <Icon size={14} />
        </div>
      </div>
      <div className="text-2xl font-bold text-slate-800">
        {value !== null && value !== undefined ? value : "—"}
        {value !== null && value !== undefined && unit && (
          <span className="text-sm font-normal text-slate-400 ml-1">{unit}</span>
        )}
      </div>
      <div className="mt-2 flex items-center gap-1.5">
        <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
        <span className={`text-xs font-medium px-1.5 py-0.5 rounded-full ${style.badge}`}>
          {status === "unknown" ? "No data" : status}
        </span>
      </div>
    </div>
  );
};
                      const WaterTank = ({ level }) => {
                        const waterLevel = Math.max(0, Math.min(level || 0, 100));

                        return (
                          <div className="flex flex-col items-center">
                            {/* Tank Cap */}
                            <div className="w-20 h-4 bg-slate-700 rounded-t-xl"></div>

                            {/* Tank */}
                            <div className="relative w-48 h-72 border-[5px] border-slate-700 rounded-[35px] overflow-hidden bg-slate-100 shadow-lg">

                              {/* Water */}
                              <div
                                className="absolute bottom-0 left-0 w-full transition-all duration-1000 ease-in-out"
                                style={{
                                  height: `${waterLevel}%`,
                                  background:
                                    "linear-gradient(to top,#38bdf8,#60a5fa,#93c5fd)",
                                }}
                              >
                                {/* Wave */}
                                <div className="absolute -top-3 left-0 w-full h-6 opacity-70">
                                  <svg
                                    viewBox="0 0 500 40"
                                    preserveAspectRatio="none"
                                    className="w-full h-full"
                                  >
                                    <path
                                      d="M0,20 C80,0 150,40 250,20 C350,0 420,40 500,20 L500,40 L0,40 Z"
                                      fill="#7dd3fc"
                                    />
                                  </svg>
                                </div>
                              </div>

                              {/* Percentage */}
                              <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-3xl font-bold text-slate-800 drop-shadow-sm">
                                  {waterLevel}%
                                </span>
                              </div>
                            </div>

                            <p className="mt-4 text-lg font-semibold text-slate-700">
                              Water Level
                            </p>
                          </div>
                        );
                      };

const Dashboard = () => {
  const [tanks, setTanks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTank, setEditingTank] = useState(null);
  const [selectedTankId, setSelectedTankId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const tanksRef = collection(db, "users", user.uid, "tanks");
    const unsubscribe = onSnapshot(
      tanksRef,
      (snapshot) => {
        const tankList = snapshot.docs.map(doc => ({
          tankId: doc.id,
          ...doc.data(),
        }));
        setTanks(tankList);
        if (tankList.length > 0 && !selectedTankId) {
          setSelectedTankId(tankList[0].tankId);
        }
        setLoading(false);
      },
      (err) => {
        console.error("Firestore listener error:", err);
        setError("Failed to load tanks. Please try again.");
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  const handleAddTank = () => { setEditingTank(null); setIsFormOpen(true); };
  const handleEditTank = (tank) => { setEditingTank(tank); setIsFormOpen(true); };
  const handleDeleteTank = async (tankId) => {
    if (!window.confirm("Are you sure you want to delete this tank?")) return;
    try {
      await deleteTank(tankId);
    } catch (err) {
      alert("Failed to delete tank. Please try again.");
    }
  };

  const selectedTank = tanks.find(t => t.tankId === selectedTankId);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Dashboard
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Real-time water quality monitoring
            </p>
          </div>
          <button
            onClick={handleAddTank}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-all shadow-sm shadow-blue-600/20"
          >
            <Plus size={16} />
            Add Tank
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-32">
            <div className="flex flex-col items-center gap-3">
              <div className="animate-spin rounded-full h-10 w-10 border-2 border-blue-600 border-t-transparent" />
              <p className="text-sm text-slate-400">Loading your tanks...</p>
            </div>
          </div>
        ) : tanks.length === 0 ? (
          <div className="text-center py-32 bg-white rounded-2xl border border-slate-200">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Droplet size={28} className="text-blue-500" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No tanks yet</h3>
            <p className="text-sm text-slate-400 mb-6 max-w-xs mx-auto">
              Add your first tank to start monitoring water quality in real time.
            </p>
            <button
              onClick={handleAddTank}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition shadow-sm"
            >
              <Plus size={16} />
              Add Your First Tank
            </button>
          </div>
        ) : (
          <>
            {/* TANK SELECTOR */}
            <div className="flex gap-2 mb-6 flex-wrap">
              {tanks.map(tank => (
                <button
                  key={tank.tankId}
                  onClick={() => setSelectedTankId(tank.tankId)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    selectedTankId === tank.tankId
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                      : 'bg-white text-slate-600 border border-slate-200 hover:border-blue-200 hover:text-blue-600'
                  }`}
                >
                  {tank.tankName}
                </button>
              ))}
            </div>

            {selectedTank && (
              <div className="space-y-5">

                {/* TANK OVERVIEW CARD */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6">
                  <div className="flex items-start justify-between mb-5">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h2 className="text-xl font-bold text-slate-900">
                          {selectedTank.tankName}
                        </h2>
                        <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          Live
                        </span>
                      </div>
                      <p className="text-sm text-slate-400 capitalize">
                        {selectedTank.tankType} tank · {selectedTank.capacity}L capacity
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleEditTank(selectedTank)}
                        className="p-2 hover:bg-slate-100 rounded-lg transition text-slate-400 hover:text-blue-600"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteTank(selectedTank.tankId)}
                        className="p-2 hover:bg-red-50 rounded-lg transition text-slate-400 hover:text-red-500"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* WATER LEVEL */}
                  <div>
                  <div className="flex flex-col items-center py-6">

  <WaterTank level={selectedTank.level ?? 0} />

  {selectedTank.updated && (
    <p className="mt-5 text-sm text-slate-400 text-center">
      Last Updated • {new Date(selectedTank.updated).toLocaleString()}
    </p>
  )}

</div>
                  </div>
                </div>

                {/* SENSOR CARDS */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                  {sensorConfig.map(({ key, label, unit, icon: Icon }) => (
                    <SensorCard
                      key={key}
                      label={label}
                      value={selectedTank[key]}
                      unit={unit}
                      status={getStatus(key, selectedTank[key])}
                      Icon={Icon}
                    />
                  ))}
                </div>

                {/* FORECAST WIDGET */}
                <ForecastWidget tankId={selectedTank.tankId} />

              </div>
            )}
          </>
        )}
      </div>

      <TankForm
        isOpen={isFormOpen}
        onClose={() => { setIsFormOpen(false); setEditingTank(null); }}
        onSave={() => {}}
        tankData={editingTank}
      />
    </div>
  );
};

export default Dashboard;