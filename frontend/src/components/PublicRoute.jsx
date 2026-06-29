import { Navigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";

const PublicRoute = ({ children }) => {
  const token = Cookies.get("authToken");
  const location = useLocation();

  // Only block signin/signup
  if (
    token &&
    (location.pathname === "/signin" || location.pathname === "/signup")
  ) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default PublicRoute;
