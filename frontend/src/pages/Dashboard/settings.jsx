import { useEffect, useState } from "react";
import { User, Mail, Lock, X } from "lucide-react";
import { auth } from "../../firebase/Firebase";
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";

const Settings = () => {
  const [user, setUser] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState("");

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUser({
        name: currentUser.displayName || "AquaSense User",
        email: currentUser.email,
      });
    }
  }, []);

  const closePasswordModal = () => {
    setShowPasswordModal(false);
    setOldPassword("");
    setNewPassword("");
    setPasswordMessage("");
  };

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword) {
      setPasswordMessage("Please fill in all fields.");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordMessage("New password must be at least 6 characters.");
      return;
    }

    setIsUpdatingPassword(true);
    setPasswordMessage("");

    try {
      const currentUser = auth.currentUser;
      const credential = EmailAuthProvider.credential(
        currentUser.email,
        oldPassword
      );

      await reauthenticateWithCredential(currentUser, credential);
      await updatePassword(currentUser, newPassword);

      setPasswordMessage("Password updated successfully!");
      setTimeout(() => closePasswordModal(), 1500);
    } catch (error) {
      if (error.code === "auth/wrong-password") {
        setPasswordMessage("Old password is incorrect.");
      } else {
        setPasswordMessage("Failed to update password. Try again.");
      }
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-2xl mx-auto">

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
          <p className="mt-2 text-slate-600">Manage your account details</p>
        </div>

        <div className="bg-white shadow-sm rounded-2xl p-8 border border-slate-200">

          {/* PROFILE HEADER */}
          <div className="flex items-center gap-6 pb-8 border-b border-slate-100">
            <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center">
              <User size={36} className="text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">
                {user.name}
              </h2>
              <p className="text-slate-500">{user.email}</p>
            </div>
          </div>

          {/* USER INFO */}
          <div className="mt-8 space-y-6">

            {/* NAME */}
            <div>
              <label className="text-sm font-medium text-slate-600 mb-1 block">
                Full Name
              </label>
              <div className="flex items-center gap-3 p-3 border border-slate-200 rounded-xl bg-slate-50">
                <User size={18} className="text-slate-400" />
                <input
                  type="text"
                  defaultValue={user.name}
                  className="w-full outline-none bg-transparent text-slate-700"
                  disabled
                />
              </div>
            </div>

            {/* EMAIL */}
            <div>
              <label className="text-sm font-medium text-slate-600 mb-1 block">
                Email
              </label>
              <div className="flex items-center gap-3 p-3 border border-slate-200 rounded-xl bg-slate-50">
                <Mail size={18} className="text-slate-400" />
                <input
                  type="email"
                  defaultValue={user.email}
                  className="w-full outline-none bg-transparent text-slate-700"
                  disabled
                />
              </div>
            </div>

            {/* CHANGE PASSWORD */}
            <button
              onClick={() => setShowPasswordModal(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-xl hover:bg-blue-700 transition font-medium"
            >
              <Lock size={18} />
              Change Password
            </button>
          </div>
        </div>
      </div>

      {/* PASSWORD MODAL */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-96 relative shadow-xl">
            <button
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
              onClick={closePasswordModal}
            >
              <X size={20} />
            </button>

            <h2 className="text-xl font-semibold text-slate-900 mb-6">
              Change Password
            </h2>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-600 mb-1 block">
                  Current Password
                </label>
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:border-blue-400"
                  placeholder="Enter current password"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-600 mb-1 block">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:border-blue-400"
                  placeholder="Enter new password"
                />
              </div>

              {passwordMessage && (
                <p className={`text-sm ${
                  passwordMessage.includes("successfully")
                    ? "text-green-600"
                    : "text-red-600"
                }`}>
                  {passwordMessage}
                </p>
              )}

              <button
                onClick={handleChangePassword}
                disabled={isUpdatingPassword}
                className="w-full bg-blue-600 text-white px-4 py-3 rounded-xl hover:bg-blue-700 transition font-medium disabled:opacity-50"
              >
                {isUpdatingPassword ? "Updating..." : "Update Password"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;