import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { fetchUsers } from "../../apis/authService";
import showToast from "../Utils/Toast";
import { useNavigate } from "react-router";

const Users = () => {
  const nevigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState([]);

  const fetchAllUsers = async () => {
    try {
      setIsLoading(true);
      const resData = await fetchUsers();
      setUsers(resData?.data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      showToast(error?.response?.data?.message || error?.message, "error");
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  function formatDateToDDMMYYYY(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-80px)] text-sm text-gray-500">
        Loading...
      </div>
    );
  }
  return (
    <div className="container max-w-7xl mx-auto px-4 mt-5">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-2xl font-semibold">Users Details</h1>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-lg shadow-md">
          <thead className="bg-blue-200 text-gray-600 text-sm font-medium">
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Role</th>
              <th className="px-4 py-2 text-left">Phone</th>
              <th className="px-4 py-2 text-left">Created At</th>
            </tr>
          </thead>
          <tbody>
            {users?.map((user, index) => (
              <tr
                key={index}
                className="border-b border-gray-300 last:border-b-0 even:bg-blue-100 text-sm font-medium"
              >
                <td className="px-4 py-2 text-gray-700">{user.name}</td>
                <td className="px-4 py-2 text-gray-700">{user.email}</td>
                <td className="px-4 py-2 text-gray-700">{user.role}</td>
                <td className="px-4 py-2 text-gray-700">{user.phone}</td>
                <td className="px-4 py-2 text-gray-700">
                  {formatDateToDDMMYYYY(user.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center mt-10">
        {" "}
        {user?.role === "admin" && (
          <button
            className="flex justify-center items-center px-4 py-2 text-white text-sm border rounded-md bg-blue-600 hover:bg-blue-700"
            onClick={() => nevigate("/profile")}
          >
            Go to Profile
          </button>
        )}
      </div>
    </div>
  );
};

export default Users;
