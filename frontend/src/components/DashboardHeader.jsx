import { useState, useEffect } from "react";
import Cookies from "js-cookie";

const DashboardHeader = () => {
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const token = Cookies.get("authToken");
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split(".")[1])); // Decode JWT payload
        const email = decoded.email || "";
        setUserEmail(email);
        
        // Extract name from email (part before @) or use email
        if (email) {
          const nameFromEmail = email.split("@")[0];
          // Capitalize first letter
          const formattedName = nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1);
          setUserName(formattedName);
        }
      } catch (err) {
        console.error("Error decoding token:", err);
        setUserName("User");
      }
    }
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="sticky top-0 z-20 bg-white border-b border-slate-200 shadow-sm">
      <div className="px-4 py-4 md:px-6 md:py-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
              {getGreeting()}, {userName || "User"}!
            </h1>
            <p className="mt-1 text-sm md:text-base text-slate-600">
              {userEmail && `Welcome back, ${userName}`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;

