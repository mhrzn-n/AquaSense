import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { createTank, updateTank } from "../services/api";

const TankForm = ({ isOpen, onClose, onSave, tankData = null }) => {
  const [formData, setFormData] = useState({
    tankName: "",
    tankType: "",
    capacity: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (tankData) {
      setFormData({
        tankName: tankData.tankName || "",
        tankType: tankData.tankType || "",
        capacity: tankData.capacity || "",
      });
    } else {
      setFormData({
        tankName: "",
        tankType: "",
        capacity: "",
      });
    }
    setErrors({});
  }, [tankData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.tankName.trim()) newErrors.tankName = "Tank name is required";
    if (!formData.tankType.trim()) newErrors.tankType = "Tank type is required";
    if (!formData.capacity.toString().trim()) newErrors.capacity = "Capacity is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      if (tankData?.tankId) {
        await updateTank(tankData.tankId, formData);
      } else {
        await createTank(formData);
      }
      await onSave();
      onClose();
    } catch (error) {
      console.error("Error saving tank:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">
            {tankData ? "Edit Tank" : "Add New Tank"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X size={20} className="text-slate-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label htmlFor="tankName" className="block text-sm font-medium text-slate-700 mb-2">
              Tank Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="tankName"
              name="tankName"
              value={formData.tankName}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                errors.tankName ? "border-red-300 bg-red-50" : "border-slate-300"
              }`}
              placeholder="e.g., Rooftop Tank"
            />
            {errors.tankName && (
              <p className="mt-1 text-sm text-red-600">{errors.tankName}</p>
            )}
          </div>

          <div>
            <label htmlFor="tankType" className="block text-sm font-medium text-slate-700 mb-2">
              Tank Type <span className="text-red-500">*</span>
            </label>
            <select
              id="tankType"
              name="tankType"
              value={formData.tankType}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-white ${
                errors.tankType ? "border-red-300 bg-red-50" : "border-slate-300"
              }`}
            >
              <option value="">Select type</option>
              <option value="overhead">Overhead</option>
              <option value="underground">Underground</option>
              <option value="ground">Ground Level</option>
            </select>
            {errors.tankType && (
              <p className="mt-1 text-sm text-red-600">{errors.tankType}</p>
            )}
          </div>

          <div>
            <label htmlFor="capacity" className="block text-sm font-medium text-slate-700 mb-2">
              Capacity (Litres) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="capacity"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                errors.capacity ? "border-red-300 bg-red-50" : "border-slate-300"
              }`}
              placeholder="e.g., 1000"
            />
            {errors.capacity && (
              <p className="mt-1 text-sm text-red-600">{errors.capacity}</p>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-slate-300 rounded-xl font-medium text-slate-700 hover:bg-slate-50 transition"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Saving..." : tankData ? "Update Tank" : "Add Tank"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TankForm;