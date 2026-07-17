import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Droplet, Thermometer, Beaker, Wind, FlaskConical } from "lucide-react";
import { collection, onSnapshot } from "firebase/firestore";
import { db, auth } from "../../firebase/Firebase";
import TankForm from "../../components/TankForm";
import SensorCard from "../../components/SensorCard";
import ForecastWidget from "../../components/ForecastWidget";
import { deleteTank } from "../../services/api";
import { getStatus } from "../../utils/getStatus";

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

  const handleAddTank = () => {
    setEditingTank(null);
    setIsFormOpen(true);
  };

  const handleEditTank = (tank) => {
    setEditingTank(tank);
    setIsFormOpen(true);
  };

  const handleDeleteTank = async (tankId) => {
    if (!window.confirm("Are you sure you want to delete this tank?")) return;
    try {
      await deleteTank(tankId);
    } catch (err) {
      console.error("Error deleting tank:", err);
      alert("Failed to delete tank. Please try again.");
    }
  };

  const handleSaveTank = async () => {
    // Firestore listener will auto-update tanks list
  };

  const selectedTank = tanks.find(t => t.tankId === selectedTankId);

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Tank Dashboard</h1>
          <p className="mt-2 text-slate-600">
            Monitor your water quality in real time
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : tanks.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-slate-200">
            <Droplet className="mx-auto h-16 w-16 text-slate-400 mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              No tanks yet
            </h3>
            <p className="text-slate-600 mb-6">
              Get started by adding your first tank
            </p>
            <button
              onClick={handleAddTank}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition shadow-lg shadow-blue-600/20"
            >
              <Plus size={20} />
              Add Your First Tank
            </button>
          </div>
        ) : (
          <>
            {/* TANK SELECTOR */}
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

            {selectedTank && (
              <>
                {/* TANK HEADER CARD */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900">
                        {selectedTank.tankName}
                      </h2>
                      <p className="text-slate-500 mt-1">
                        {selectedTank.tankType} — Capacity: {selectedTank.capacity}L
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditTank(selectedTank)}
                        className="p-2 hover:bg-blue-50 rounded-lg transition text-blue-600"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteTank(selectedTank.tankId)}
                        className="p-2 hover:bg-red-50 rounded-lg transition text-red-600"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  {/* WATER LEVEL BAR */}
                  <div className="mt-4">
                    <div className="flex justify-between text-sm text-slate-600 mb-1">
                      <span>Water Level</span>
                      <span className="font-semibold">
                        {selectedTank.level !== null && selectedTank.level !== undefined
                          ? `${selectedTank.level}%`
                          : 'No data yet'}
                      </span>
                    </div>
                    {selectedTank.level !== null && selectedTank.level !== undefined && (
                      <div className="w-full bg-slate-200 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full transition-all ${
                            selectedTank.level < 20
                              ? 'bg-red-500'
                              : selectedTank.level < 50
                              ? 'bg-yellow-500'
                              : 'bg-green-500'
                          }`}
                          style={{ width: `${selectedTank.level}%` }}
                        />
                      </div>
                    )}
                  </div>

                  {/* LAST UPDATED */}
                  {selectedTank.updated && (
                    <p className="text-xs text-slate-400 mt-3">
                      Last updated: {new Date(selectedTank.updated).toLocaleString()}
                    </p>
                  )}
                </div>

                {/* SENSOR CARDS */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
                  <SensorCard
                    label="Temperature"
                    value={selectedTank.temperature}
                    unit="°C"
                    status={getStatus('temperature', selectedTank.temperature)}
                    icon={<Thermometer size={16} />}
                  />
                  <SensorCard
                    label="TDS"
                    value={selectedTank.tds}
                    unit="ppm"
                    status={getStatus('tds', selectedTank.tds)}
                    icon={<Beaker size={16} />}
                  />
                  <SensorCard
                    label="pH Level"
                    value={selectedTank.ph}
                    unit=""
                    status={getStatus('ph', selectedTank.ph)}
                    icon={<FlaskConical size={16} />}
                  />
                  <SensorCard
                    label="Turbidity"
                    value={selectedTank.turbidity}
                    unit="NTU"
                    status={getStatus('turbidity', selectedTank.turbidity)}
                    icon={<Wind size={16} />}
                  />
                  <SensorCard
                    label="Freshness"
                    value={selectedTank.freshness_window_hours}
                    unit="hrs"
                    status={getStatus('freshness_window_hours', selectedTank.freshness_window_hours)}
                    icon={<Droplet size={16} />}
                  />
                </div>

                {/* FORECAST WIDGET */}
                <ForecastWidget tankId={selectedTank.tankId} />
              </>
            )}
          </>
        )}

        {/* ADD TANK BUTTON */}
        {!loading && (
          <button
            onClick={handleAddTank}
            className="fixed bottom-8 right-8 w-14 h-14 bg-blue-600 text-white rounded-full shadow-2xl hover:bg-blue-700 transition-all duration-300 hover:scale-110 flex items-center justify-center z-40"
          >
            <Plus size={24} />
          </button>
        )}

        <TankForm
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setEditingTank(null);
          }}
          onSave={handleSaveTank}
          tankData={editingTank}
        />
      </div>
    </div>
  );
};

export default Dashboard;