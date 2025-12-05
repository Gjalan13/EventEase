import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../UserContext";

export default function ProtectedRoute({ children }) {
  const { user } = useContext(UserContext);

  if (!user) {
    alert("You must be logged in to access this page!");
    return <Navigate to="/login" />;
  }

  return children;
}
