import { BrowserRouter, Routes, Route } from "react-router";
import HomePage from "./components/homes/HomePage";
import UserProfile from "./components/userProfiles/UserProfile.jsx";
import Login from "./components/auths/login.jsx";
import AuthLayout from "./components/auths/AuthLayout.jsx";
import Register from "./components/auths/register.jsx";
import Layout from "./components/navbars/Layout.jsx";
import PageNotFound from "./components/errorPage/PageNotFound.jsx";
import { ToastContainer } from "react-toastify";
import ProtectedRoute from "./components/auths/ProtectedRoute.jsx";
import Users from "./components/users/users.jsx";

function App() {
  return (
    <BrowserRouter>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route element={<AuthLayout />}>
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route path="profile" element={<UserProfile />} />
            <Route path="users" element={<Users />} />
          </Route>
        </Route>
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
