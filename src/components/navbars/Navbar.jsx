import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router";
import { logoutUser } from "../../apis/authService";
import showToast from "../Utils/Toast";
import { logout } from "../../stores/slices/authSlice";

const Navbar = () => {
  const loaction = useLocation();
  const dispatch = useDispatch();
  const nevigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user);

  const logoutHandler = async () => {
    try {
      const resData = await logoutUser("/api/logout");
      dispatch(logout());
      nevigate("/");
      showToast(resData.message, "success");
    } catch (error) {
      showToast(error?.response?.data?.message || error?.message, "error");
    }
  };

  return (
    <nav className="bg-blue-600 sticky top-0 w-full z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-[80px]">
          {/* Brand Name */}
          <Link to="/" className="text-white text-2xl font-bold">
            CodePlateau
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-4">
            {!isAuthenticated && (
              <Link
                to="/login"
                className="text-white border border-white px-4 py-2 rounded hover:bg-white hover:text-blue-600 transition"
              >
                Login
              </Link>
            )}
            {!isAuthenticated && (
              <Link
                to="/register"
                className="text-white border border-white px-4 py-2 rounded hover:bg-white hover:text-blue-600 transition"
              >
                Signup
              </Link>
            )}

            {isAuthenticated && loaction.pathname !== "/profile" && (
              <Link
                to="/profile"
                className="text-white border border-white px-4 py-2 rounded hover:bg-white hover:text-blue-600 transition"
              >
                Profile
              </Link>
            )}

            {isAuthenticated && (
              <button
                className="text-white bg-red-500 px-4 py-2 rounded hover:bg-red-600"
                onClick={logoutHandler}
              >
                Logout
              </button>
            )}
            {isAuthenticated && user?.name && (
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-blue-600 font-bold text-2xl">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white focus:outline-none"
          >
            ☰
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden flex flex-col space-y-2 py-3 bg-blue-600 text-center">
            {!isAuthenticated && (
              <Link
                to="/login"
                className="text-white border border-white px-4 py-2 rounded hover:bg-white hover:text-blue-600 transition"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
            )}

            {!isAuthenticated && (
              <Link
                to="/signup"
                className="text-white border border-white px-4 py-2 rounded hover:bg-white hover:text-blue-600 transition"
                onClick={() => setIsOpen(false)}
              >
                Signup
              </Link>
            )}

            {isAuthenticated && (
              <button
                className="text-white bg-red-500 px-4 py-2 rounded hover:bg-red-600"
                onClick={() => {
                  logoutHandler();
                  setIsOpen(false);
                }}
              >
                Logout
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
