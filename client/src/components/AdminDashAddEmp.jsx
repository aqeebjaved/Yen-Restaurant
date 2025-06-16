import { Alert, Spinner } from "flowbite-react";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminDasAddEmp() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.firstname ||
      !formData.lastname ||
      !formData.username ||
      !formData.address ||
      !formData.phone ||
      !formData.email ||
      !formData.nic ||
      formData.role === "Select the role" ||
      !formData.role ||
      !formData.password
    ) {
      return enqueueSnackbar("All fields are required", { variant: "error" });
    }

    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/employee/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.success === false) {
        setLoading(false);
        setSuccess(null);
        return enqueueSnackbar(data.message, { variant: "error" });
      }

      setLoading(false);
      if (res.ok) {
        enqueueSnackbar("Employee added successfully", { variant: "success" });
        navigate("/admin-dashboard");
      }
    } catch (error) {
      setError(error.message);
      setLoading(false);
      setSuccess(null);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white py-10 px-4">
      <div className="w-full max-w-2xl bg-white shadow-2xl rounded-2xl p-10">
        <h3 className="text-3xl font-bold text-center text-cyan-800 mb-8">
          Add New Employee
        </h3>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="firstname" className="block text-sm font-medium text-gray-700">
                First Name
              </label>
              <input
                type="text"
                id="firstname"
                placeholder="John"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-cyan-600 focus:border-cyan-600"
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="lastname" className="block text-sm font-medium text-gray-700">
                Last Name
              </label>
              <input
                type="text"
                id="lastname"
                placeholder="Doe"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-cyan-600 focus:border-cyan-600"
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="johndoe@example.com"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-cyan-600 focus:border-cyan-600"
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="text"
                id="phone"
                placeholder="0712345678"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-cyan-600 focus:border-cyan-600"
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <input
                type="text"
                id="address"
                placeholder="123 Main Street"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-cyan-600 focus:border-cyan-600"
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="nic" className="block text-sm font-medium text-gray-700">
                NIC
              </label>
              <input
                type="text"
                id="nic"
                placeholder="123456789V"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-cyan-600 focus:border-cyan-600"
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                type="text"
                id="username"
                placeholder="johndoe01"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-cyan-600 focus:border-cyan-600"
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="••••••••"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-cyan-600 focus:border-cyan-600"
                onChange={handleChange}
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                Role
              </label>
              <select
                id="role"
                value={formData.role || ""}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-cyan-600 focus:border-cyan-600"
              >
                <option>Select the role</option>
                <option value="Manager">Manager</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 mt-6 font-medium text-white bg-cyan-600 rounded-md shadow-md hover:bg-cyan-800 transition duration-300"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <Spinner size="sm" />
                <span className="pl-3">Submitting...</span>
              </div>
            ) : (
              "Add Employee"
            )}
          </button>

          {error && <Alert color="failure" className="mt-4">{error}</Alert>}
          {success && <Alert color="success" className="mt-4">{success}</Alert>}
        </form>
      </div>
    </div>
  );
}