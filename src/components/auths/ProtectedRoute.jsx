import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router";

const ProtectedRoute = () => {
  const location = useLocation();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  if (!isAuthenticated) {
    // If not authenticated, redirect to login page
    return <Navigate to="/" state={{ from: location }} />;
  }

  return <Outlet />; // Render the protected route if authenticated
};

export default ProtectedRoute;
