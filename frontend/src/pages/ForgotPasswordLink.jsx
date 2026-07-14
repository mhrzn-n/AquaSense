import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase/Firebase";

function ForgotPasswordLink() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email.");
      return;
    }

    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setSuccessMessage("Password reset link sent to your email!");
      setEmail("");
    } catch (err) {
      if (err.code === "auth/user-not-found") {
        setError("No account found with this email.");
      } else if (err.code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else {
        setError("Failed to send reset email. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsPopupOpen(false);
    setEmail("");
    setError("");
    setSuccessMessage("");
  };

  return (
    <div>
      <div className="text-right mb-4">
        
         {(e) => {
            e.preventDefault();
            setIsPopupOpen(true);
          }}
          <a className="text-sm text-blue-600 hover:underline"
        >
          Forgot password?
        </a>
      </div>

      {isPopupOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-96">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">
              Reset Password
            </h2>
            <p className="text-sm text-slate-500 mb-4">
              Enter your email and we'll send you a reset link.
            </p>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="reset-email"
                  className="block text-sm font-medium text-slate-700 mb-1"
                >
                  Email address
                </label>
                <input
                  type="email"
                  id="reset-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none focus:border-blue-400"
                  placeholder="email@gmail.com"
                />
              </div>

              {error && (
                <p className="text-red-500 text-sm mb-3">{error}</p>
              )}
              {successMessage && (
                <p className="text-green-600 text-sm mb-3">{successMessage}</p>
              )}

              <div className="flex justify-between items-center">
                <button
                  type="button"
                  className="text-sm text-slate-500 hover:text-slate-700"
                  onClick={handleClose}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 text-white py-2 px-5 rounded-xl hover:bg-blue-700 transition disabled:opacity-50 text-sm font-medium"
                >
                  {loading ? "Sending..." : "Send Reset Link"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ForgotPasswordLink;