import { useState } from "react";
import { sendEmailVerification } from "firebase/auth";
import { auth } from "../firebase/Firebase";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";

const VerifyEmail = () => {
  const [resent, setResent] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleResend = async () => {
    setLoading(true);
    try {
      await sendEmailVerification(auth.currentUser);
      setResent(true);
    } catch (error) {
      console.error("Failed to resend verification email:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = async () => {
    await auth.currentUser?.reload();
    if (auth.currentUser?.emailVerified) {
      navigate("/dashboard", { replace: true });
    } else {
      alert("Your email is not verified yet. Please check your inbox.");
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
    navigate("/signin", { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="w-full max-w-md bg-white/40 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-8 mx-4">
        <div className="text-center mb-6">
          <div className="text-5xl mb-4">📧</div>
          <h1 className="text-2xl font-bold text-blue-700 mb-2">
            Verify your email
          </h1>
          <p className="text-gray-600 text-sm">
            We sent a verification link to your email address. Please check
            your inbox and click the link to activate your account.
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleContinue}
            className="w-full py-2 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
          >
            I've verified my email — Continue
          </button>

          <button
            onClick={handleResend}
            disabled={loading || resent}
            className="w-full py-2 border border-blue-300 text-blue-600 rounded-xl font-medium hover:bg-blue-50 transition disabled:opacity-50"
          >
            {resent ? "Verification email resent!" : loading ? "Sending..." : "Resend verification email"}
          </button>

          <button
            onClick={handleSignOut}
            className="w-full py-2 text-slate-500 text-sm hover:text-slate-700 transition"
          >
            Sign out and use a different account
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;