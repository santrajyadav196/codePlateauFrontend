import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserProfile, updateUserRole } from "../../apis/authService";
import { setProfile } from "../../stores/slices/authSlice";
import Button from "../Utils/Button";
import showToast from "../Utils/Toast";
import { useNavigate } from "react-router";

const UserProfile = () => {
  const nevigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [isLoading, setIsLoading] = useState(false);

  const fetchUserProfile = async () => {
    try {
      const resData = await getUserProfile();
      dispatch(setProfile({ user: resData?.data }));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  function formatDateToDDMMYYYY(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  const updateUserRoleHandler = async (data) => {
    const formData = {
      role: data,
    };

    try {
      setIsLoading(true);
      const resData = await updateUserRole(formData);
      dispatch(
        setProfile({
          user: resData?.data,
        })
      );
      setIsLoading(false);
      showToast(resData.message, "success");
    } catch (error) {
      setIsLoading(false);
      showToast(error?.response?.data?.message || error?.message, "error");
    }
  };

  return (
    <div className="flex h-[calc(100vh-80px)] items-center justify-center">
      <div className="max-w-md min-w-sm mx-auto bg-white shadow-lg rounded-xl overflow-hidden p-6">
        <div className="flex items-center space-x-4">
          {/* User Initial Badge */}
          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-blue-600 text-white text-2xl font-bold">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              {user?.name}
            </h2>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-gray-700 text-sm">
            <span className="font-medium">User Type:</span>
            <span className="text-gray-500">{user?.role || "N/A"}</span>
          </div>
          <div className="flex justify-between text-gray-700 text-sm">
            <span className="font-medium">Phone:</span>
            <span className="text-gray-500">{user?.phone || "N/A"}</span>
          </div>
          <div className="flex justify-between text-gray-700 text-sm">
            <span className="font-medium">CreatedAt:</span>
            <span className="text-gray-500">
              {(user?.createdAt && formatDateToDDMMYYYY(user?.createdAt)) ||
                "N/A"}
            </span>
          </div>
        </div>

        <div className="flex justify-center mt-4">
          {user?.role === "admin" && (
            <button
              className="flex justify-center items-center px-4 py-2 text-white text-sm border rounded-md bg-blue-600 hover:bg-blue-700"
              onClick={() => nevigate("/users")}
            >
              See all the users
            </button>
          )}
          {user?.role === "user" && (
            <Button
              onClick={() => updateUserRoleHandler("admin")}
              disabled={isLoading}
              isLoading={isLoading}
              text="Change Role to Admin"
              width="w-fit"
              size="18px"
              rounded="xl"
              fontWeight="medium"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
