import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loading from "./Loading";

const PublicRoute = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (user === undefined) {
    return <Loading />;
  }

  if (
    user &&
    (location.pathname === "/signin" || location.pathname === "/signup")
  ) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default PublicRoute;