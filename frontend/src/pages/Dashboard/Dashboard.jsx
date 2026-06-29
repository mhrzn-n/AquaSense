import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Plus, Edit2, Trash2, Droplet, Zap } from "lucide-react";
import TankForm from "../../components/TankForm";
import { auth } from "../../firebase/Firebase";

const API_BASE_URL = "https://AquaSense.onrender.com/api";
// const API_BASE_URL = "http://localhost:3000/api";

const Dashboard = () => {
  const [tanks, setTanks] = useState({});
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTank, setEditingTank] = useState(null);
  const [error, setError] = useState("");

  // -------------------------------
  // AUTH HEADERS
  // -------------------------------
  const getAuthHeaders = async () => {
    let idToken;

    if (auth.currentUser) {
      idToken = await auth.currentUser.getIdToken();
    } else {
      const tokenFromCookie = Cookies.get("authToken");
      if (!tokenFromCookie) throw new Error("User is not authenticated");
      idToken = tokenFromCookie;
    }

    return {
      Authorization: `Bearer ${idToken}`,
      "Content-Type": "application/json",
    };
  };

  // -------------------------------
  // FETCH TANKS
  // -------------------------------
  const fetchTanks = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(`${API_BASE_URL}/tanks/getTanks`, {
        headers: await getAuthHeaders(),
      });

      if (response.data.success) {
        setTanks(response.data.tanks || {});
      }
    } catch (err) {
      console.error("Error fetching tanks:", err);
      setError("Failed to load tanks. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTanks();
  }, [fetchTanks]);

  // -------------------------------
  // BUTTON HANDLERS
  // -------------------------------
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
      await axios.delete(`${API_BASE_URL}/tanks/delete`, {
        headers: await getAuthHeaders(),
        data: { tankId },
      });

      await fetchTanks();
    } catch (err) {
      console.error("Error deleting tank:", err);
      alert("Failed to delete tank. Please try again.");
    }
  };

  // -------------------------------
  // CREATE TANK
  // -------------------------------
  const createTank = async (formData) => {
    const payload = {
      tankName: formData.tankName,
      tankType: formData.tankType,
      capacity: formData.capacity,
      level: formData.level,
      pumpStatus: formData.pumpStatus,
    };

    await axios.post(`${API_BASE_URL}/tanks/create`, payload, {
      headers: await getAuthHeaders(),
    });
  };

  // -------------------------------
  // UPDATE TANK
  // -------------------------------
  const updateTank = async (formData) => {
    if (!formData.tankId) {
      throw new Error("Tank ID missing for update");
    }

    const payload = {
      tankId: formData.tankId,
      tankName: formData.tankName,
      tankType: formData.tankType,
      capacity: formData.capacity,
      level: formData.level !== undefined ? Number(formData.level) : undefined,
      pumpStatus: formData.pumpStatus,
    };

    try {
      const headers = await getAuthHeaders();
      const res = await axios.post(
        `${API_BASE_URL}/tanks/update`,
        payload,
        {
          headers,
        }
      );
      alert("Tank updated successfully");
      return res.data;
    } catch (err) {
      console.error("Error updating tank:", err.response?.data || err.message);
      throw err;
    }
  };

  // -------------------------------
  // SAVE HANDLER (CREATE OR UPDATE)
  // -------------------------------
  const handleSaveTank = async (formData) => {
    try {
      if (formData.tankId) {
        await updateTank(formData);
      } else {
        await createTank(formData);
      }

      await fetchTanks();
    } catch (err) {
      console.error("Error saving tank:", err);
      throw new Error(err.response?.data?.message || "Failed to save tank");
    }
  };

  // Convert tanks object → array
  const tankArray = Object.values(tanks);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Tank Dashboard</h1>
          <p className="mt-2 text-slate-600">
            Manage and monitor your water tanks
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
        ) : tankArray.length === 0 ? (
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tankArray.map((tank) => (
              <div
                key={tank.tankId}
                className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-all duration-300"
              >
                {/* CARD HEADER */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900 mb-1">
                      {tank.tankName}
                    </h3>
                    <p className="text-sm text-slate-500">{tank.tankType}</p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditTank(tank)}
                      className="p-2 hover:bg-blue-50 rounded-lg transition text-blue-600"
                    >
                      <Edit2 size={18} />
                    </button>

                    <button
                      onClick={() => handleDeleteTank(tank.tankId)}
                      className="p-2 hover:bg-red-50 rounded-lg transition text-red-600"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-slate-600">
                        Capacity
                      </span>
                      <span className="text-sm font-semibold text-slate-900">
                        {tank.capacity}
                      </span>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-slate-600 flex items-center gap-1">
                        <Droplet size={16} />
                        Level
                      </span>

                      <span className="text-sm font-semibold text-slate-900">
                        {tank.level !== undefined ? `${tank.level}%` : "N/A"}
                      </span>
                    </div>

                    {tank.level !== undefined && (
                      <div className="w-full bg-slate-200 rounded-full h-2.5">
                        <div
                          className={`h-2.5 rounded-full transition-all ${
                            tank.level < 20
                              ? "bg-red-500"
                              : tank.level < 50
                              ? "bg-yellow-500"
                              : "bg-green-500"
                          }`}
                          style={{ width: `${tank.level}%` }}
                        ></div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-600 flex items-center gap-1">
                      <Zap size={16} />
                      Pump Status
                    </span>
                    <span
                      className={`text-sm font-semibold px-3 py-1 rounded-full ${
                        tank.pumpStatus === "ON"
                          ? "bg-green-100 text-green-700"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {tank.pumpStatus}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && (
          <button
            onClick={handleAddTank}
            className="fixed bottom-8 right-8 w-14 h-14 bg-blue-600 text-white rounded-full shadow-2xl hover:bg-blue-700
            transition-all duration-300 hover:scale-110 flex items-center justify-center z-40"
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
