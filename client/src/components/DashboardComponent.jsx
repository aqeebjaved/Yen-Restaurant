import { useEffect, useState } from "react";
import { HiArrowNarrowUp } from "react-icons/hi";
import { FaUserTie } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Card } from "flowbite-react";

export default function DashboardComponent() {
  const [managers, setManagers] = useState([]);
  const [users, setUsers] = useState([]);
  const [totalManagers, setTotalManagers] = useState(0);
  const [lastMonthManagers, setLastMonthManagers] = useState(0);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchManagers = async () => {
      try {
        const res = await fetch(`/api/employee/getemployee?role=Manager&limit=5`);
        const data = await res.json();
        if (res.ok) {
          setManagers(data.employees);
          setTotalManagers(data.totalEmployees);
          setLastMonthManagers(data.lastMonthEmployees);
        } else {
          console.error("Failed to fetch managers");
        }
      } catch (error) {
        console.error("Error fetching managers:", error.message);
      }
    };

    const fetchUsers = async () => {
      try {
        const res = await fetch(`/api/user/getusers?limit=5`);
        const data = await res.json();
        if (res.ok) {
          setUsers(data.users);
        } else {
          console.error("Failed to fetch users");
        }
      } catch (error) {
        console.error("Error fetching users:", error.message);
      }
    };

    if (currentUser.isAdmin) {
      fetchManagers();
      fetchUsers();
    }
  }, [currentUser]);

  return (
    <div className="p-6 mx-auto max-w-7xl">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-2xl shadow-xl p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase">Total Managers</h3>
              <p className="text-3xl font-bold text-gray-800">{totalManagers}</p>
            </div>
            <div className="p-4 rounded-full bg-blue-900 text-white">
              <FaUserTie size={32} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-gray-500">
            <HiArrowNarrowUp className="text-green-500 mr-1" />
            <span className="text-green-600 font-semibold">{lastMonthManagers}</span>
            <span className="ml-2">Managers added last month</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="rounded-2xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h5 className="text-xl font-bold text-gray-800 dark:text-white">Managers</h5>
            <Link to="/admin-dashboard?tab=admin-managers">
              <p className="text-sm font-medium text-blue-600 hover:underline">View all</p>
            </Link>
          </div>
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {managers.map((manager) => (
              <li className="py-3 flex items-center space-x-4" key={manager._id}>
                <img
                  className="w-10 h-10 rounded-full"
                  src={manager.profilePicture}
                  alt="Manager"
                />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800 truncate dark:text-white">
                    {manager.firstname} {manager.lastname}
                  </p>
                  <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                    {manager.email}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="rounded-2xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h5 className="text-xl font-bold text-gray-800 dark:text-white">Latest Members</h5>
            <Link to="/admin-dashboard?tab=admin-users">
              <p className="text-sm font-medium text-blue-600 hover:underline">View all</p>
            </Link>
          </div>
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {users.map((user) => (
              <li className="py-3 flex items-center space-x-4" key={user._id}>
                <img
                  className="w-10 h-10 rounded-full"
                  src={user.profilePicture}
                  alt="User"
                />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800 truncate dark:text-white">
                    {user.name}
                  </p>
                  <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                    {user.email}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}