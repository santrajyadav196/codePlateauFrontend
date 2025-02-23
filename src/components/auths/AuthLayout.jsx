import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router";

function AuthLayout() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  if (isAuthenticated) {
    // If not authenticated, redirect to login page
    return <Navigate to="/profile" />;
  }

  return (
    <div className="flex h-[calc(100vh-80px)] items-center justify-center">
      <div className="w-full max-w-lg bg-white p-6 rounded-lg shadow-lg">
        <Outlet />
      </div>
    </div>
  );
}

export default AuthLayout;
