import { Navigate } from "react-router-dom";

export default function AdminRoute({ children, me }) {
  if (!me) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-base-100">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }
  
  if (me.role !== "admin") {
    return <Navigate to="/student" replace />;
  }
  
  return children;
}