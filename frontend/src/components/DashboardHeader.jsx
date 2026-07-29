import { useEffect, useState } from "react";
import { auth } from "../firebase/Firebase";

const DashboardHeader = () => {
  const [firstName, setFirstName] = useState("User");

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    if (user.displayName) {
      // Google sign-in gives a full display name — take first word
      setFirstName(user.displayName.split(" ")[0]);
    } else if (user.email) {
      // Email/password signup — extract from email before @
      const nameFromEmail = user.email.split("@")[0];
      setFirstName(
        nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1)
      );
    }
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="sticky top-0 z-20 bg-white border-b border-slate-100">
      <div className="px-6 py-4">
        <h1 className="text-2xl font-bold text-slate-900">
          {getGreeting()}, {firstName}!
        </h1>
        <p className="text-sm text-slate-400 mt-0.5">
          Here's your water quality overview
        </p>
      </div>
    </div>
  );
};

export default DashboardHeader;