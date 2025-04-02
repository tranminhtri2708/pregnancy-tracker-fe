import { useEffect, useState } from "react";
import { FaEye, FaEyeSlash, FaLock, FaUser } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { logout } from "../../redux/features/userSlice";
import api from "../../config/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { login } from "../../redux/features/userSlice";
import { useDispatch } from "react-redux";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    userEmail: "",
    password: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(formData.userEmail)) {
      newErrors.userEmail = "Invalid email format";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    console.log("Đăng xuất...");
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
    localStorage.clear();

    dispatch(logout());
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      try {
        const response = await api.post("Auth/login", formData);
        console.log("API response:", response.data); // Để debug

        if (response.data.isSuccess && response.data.result) {
          const token = response.data.result;
          localStorage.setItem("token", token);
          toast.success("Đăng nhập thành công");

          // Giải mã JWT để lấy thông tin role
          const base64Url = token.split(".")[1];
          const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
          const payload = JSON.parse(window.atob(base64));
          const role = payload.Role; // Lấy role từ JWT
          // Dispatch thông tin người dùng từ payload JWT
          dispatch(
            login({
              token,
              role,
              email: payload.Email,
              userId: payload.UserId,
              fullName: payload.FullName,
            })
          );

          // Điều hướng dựa trên role
          if (role === "Manager" || role === "MANAGER") {
            navigate("/dashboard");
          } else {
            navigate("/homepage");
          }
        } else {
          toast.error(response.data.errorMessage || "Invalid credentials");
        }
      } catch (err) {
        console.error("Login error:", err);
        toast.error(
          err.response?.data?.errorMessage || "Đăng nhập không thành công"
        );
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-rose-200 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div>
          <img
            className="mx-auto h-12 w-auto"
            src="https://cdn-icons-png.flaticon.com/512/5087/5087579.png"
            alt="Logo"
          />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Chào mừng trở lại!
          </h2>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="userEmail" className="sr-only">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="userEmail"
                  name="userEmail"
                  type="email"
                  autoComplete="userEmail"
                  required
                  className={`appearance-none rounded-lg relative block w-full pl-10 pr-3 py-2 border ${
                    errors.userEmail ? "border-red-300" : "border-gray-300"
                  } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                  placeholder="Email"
                  value={formData.userEmail}
                  onChange={handleChange}
                  aria-invalid={errors.userEmail ? "true" : "false"}
                />
              </div>
              {errors.userEmail && (
                <p className="mt-2 text-sm text-red-600" role="alert">
                  {errors.userEmail}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  className={`appearance-none rounded-lg relative block w-full pl-10 pr-10 py-2 border ${
                    errors.password ? "border-red-300" : "border-gray-300"
                  } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  aria-invalid={errors.password ? "true" : "false"}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <FaEyeSlash className="h-5 w-5 text-gray-400" />
                  ) : (
                    <FaEye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-600" role="alert">
                  {errors.password}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="rememberMe"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                checked={formData.rememberMe}
                onChange={handleChange}
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-900"
              >
                Lưu thông tin đăng nhập
              </label>
            </div>

            <div className="text-sm">
              <a
                href="/forget"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Quên mật khẩu của bạn?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-colors duration-200"
            >
              {isLoading ? (
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : null}
              {isLoading ? "Đăng đăng nhập..." : "Đăng nhập"}
            </button>

            <p className="mt-4 text-center text-sm text-gray-600">
              Bạn chưa có tài khoản?
              <a
                href="/register"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Đăng kí tại đây
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
