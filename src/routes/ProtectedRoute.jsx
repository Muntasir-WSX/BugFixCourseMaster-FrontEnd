import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getToken, clearToken } from "../utils/auth";
import { getMe } from "../services/auth.api";

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const [isValid, setIsValid] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const token = getToken();

  useEffect(() => {
    // Fixed Bug-040: Removed security backdoor (dev_bypass logic)
    if (!token) {
      setIsValid(false);
      return;
    }

    // Verify token validity with server
    getMe()
      .then((res) => {
        setIsValid(true);
        setUserRole(res.data?.role || "student");
      })
      .catch(() => {
        // Fixed Bug-041: Do not grant access on expired/failed token verification
        clearToken();
        setIsValid(false);
      });
  }, [token]);

  if (isValid === null) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-base-100">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (!isValid) {
    return <Navigate to="/login" replace />;
  }

  // Fixed Bug-042: Role-based access validation
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    return <Navigate to="/student" replace />;
  }

  return children;
}