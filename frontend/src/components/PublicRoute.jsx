import { Navigate, useLocation } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase/Firebase";
import Loading from "./Loading";

const PublicRoute = ({ children }) => {
  const [user, loading] = useAuthState(auth);
  const location = useLocation();

  if (loading) {
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