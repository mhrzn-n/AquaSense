import { Navigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import isTokenValid from "../Utils/validToken";

const ProtectedRoute = ({ children }) => {
  const token = Cookies.get("authToken");
  const location = useLocation();

  // Only redirect if token is missing or invalid
  if (!token || !isTokenValid(token)) {
    Cookies.remove("authToken");
    return <Navigate to="/signin" replace state={{ from: location }} />;
  }

  return children;
};

export default ProtectedRoute;
