import { Navigate } from "react-router-dom";

const RequireGuest = ({ children }: { children: JSX.Element }) => {
  const token = localStorage.getItem("token");
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

export default RequireGuest;
