/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { User, Mail, Phone, Camera, Lock, X } from "lucide-react";

const Settings = () => {
  const [user, setUser] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState("");

  // Password modal state
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const API_BASE_URL = "https://AquaSense.onrender.com/api";
  // const API_BASE_URL = "http://localhost:3000/api";

  // Helper to convert file to Base64
  const readFileAsBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = Cookies.get("authToken");
        if (!token) return;

        const res = await axios.get(`${API_BASE_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(res.data);

        // Load profile image from localStorage
        const savedImage = localStorage.getItem("profileImage");
        if (savedImage) setProfileImage(savedImage);

        // Load phone number from localStorage if exists
        const savedPhone = localStorage.getItem("phoneNumber");
        if (savedPhone) setPhoneNumber(savedPhone);
        else setPhoneNumber(res.data.phoneNumber || "");
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };

    fetchUser();
  }, []);

  // Profile image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert("Image must be less than 2MB");
      return;
    }
    const base64 = await readFileAsBase64(file);
    localStorage.setItem("profileImage", base64);
    setProfileImage(base64);
  };

  // Phone number handling
  const handlePhoneChange = (e) => setPhoneNumber(e.target.value);
  const handlePhoneSave = () => {
    localStorage.setItem("phoneNumber", phoneNumber);
    alert("Phone number saved!");
  };

  // Open/close password modal
  const openPasswordModal = () => setShowPasswordModal(true);
  const closePasswordModal = () => {
    setShowPasswordModal(false);
    setOldPassword("");
    setNewPassword("");
  };

  // Change password (authenticated users only)
  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword) {
      alert("Please fill in all fields");
      return;
    }
    setIsUpdatingPassword(true);

    try {
      const token = Cookies.get("authToken");
      if (!token) {
        alert("User not authenticated!");
        setIsUpdatingPassword(false);
        return;
      }

      await axios.post(
        `${API_BASE_URL}/auth/resetPassword`,
        {
          email: user.email,
          oldPassword,
          newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Password updated successfully!");
      closePasswordModal();
    } catch (error) {
      alert(
        error.response?.data?.message || "Failed to update password. Try again."
      );
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  if (!user) {
    return (
      <div className="text-center py-10 text-gray-500">
        Loading user data...
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 md:px-12 py-10">
      <h1 className="text-3xl font-bold text-slate-800 mb-8">Settings</h1>

      <div className="bg-white shadow-lg rounded-xl p-8 border border-slate-200">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-center gap-6 pb-8 border-b">
          <div className="relative w-32 h-32">
            {!imageLoaded && (profileImage || user.picture) && (
              <div className="absolute inset-0 rounded-full bg-slate-200 animate-pulse" />
            )}

            {profileImage || user.picture ? (
              <img
                src={profileImage || user.picture}
                alt="User"
                onLoad={() => setImageLoaded(true)}
                className="w-32 h-32 rounded-full object-cover transition-opacity duration-300"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-slate-200 flex items-center justify-center">
                <User size={40} className="text-slate-500" />
              </div>
            )}

            <label className="absolute bottom-2 right-2 bg-blue-600 text-white p-2 rounded-full cursor-pointer shadow-md hover:bg-blue-700">
              <Camera size={16} />
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </label>
          </div>

          <div>
            <h2 className="text-2xl font-semibold">{user.name}</h2>
            <p className="text-slate-500">{user.email}</p>
          </div>
        </div>

        {/* User Info */}
        <div className="mt-8 space-y-6">
          {/* Name */}
          <div>
            <label className="text-sm font-medium">Full Name</label>
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <User size={18} />
              <input
                type="text"
                defaultValue={user.name}
                className="w-full outline-none"
                disabled
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="text-sm font-medium">Email</label>
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <Mail size={18} />
              <input
                type="email"
                defaultValue={user.email}
                className="w-full outline-none"
                disabled
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="text-sm font-medium">Phone Number</label>
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <Phone size={18} />
              <input
                type="text"
                value={phoneNumber}
                onChange={handlePhoneChange}
                className="w-full outline-none"
                placeholder="Enter phone number"
              />
            </div>
            <button
              onClick={handlePhoneSave}
              className="mt-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              Save Phone Number
            </button>
          </div>

          {/* Change Password */}
          <button
            onClick={() => setShowPasswordModal(true)}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-3 rounded-lg hover:bg-indigo-700"
          >
            <Lock size={18} />
            Change Password
          </button>
        </div>
      </div>

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-96 relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              onClick={closePasswordModal}
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-semibold mb-4">Change Password</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Old Password</label>
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full p-2 border rounded-lg outline-none"
                  placeholder="Enter old password"
                />
              </div>
              <div>
                <label className="text-sm font-medium">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full p-2 border rounded-lg outline-none"
                  placeholder="Enter new password"
                />
              </div>
              <button
                onClick={handleChangePassword}
                disabled={isUpdatingPassword}
                className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
              >
                {isUpdatingPassword ? "Updating..." : "Change Password"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
