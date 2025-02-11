import { useState, useEffect } from "react";
import {
  FaEye,
  FaEyeSlash,
  FaCheckCircle,
  FaTimesCircle,
  FaGoogle,
} from "react-icons/fa";
import { auth } from "../../config/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { Link } from "react-router-dom";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    username: "",
    password: "",
    terms: false,
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const validatePassword = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (name === "password") {
      setPasswordStrength(validatePassword(value));
    }

    validateField(name, type === "checkbox" ? checked : value);
  };

  const validateField = (name, value) => {
    let newErrors = { ...errors };

    switch (name) {
      case "fullName":
        if (!value) newErrors.fullName = "Full name is required";
        else if (value.length < 2)
          newErrors.fullName = "Name must be at least 2 characters";
        else if (!/^[A-Za-z\s]+$/.test(value))
          newErrors.fullName = "Only alphabets and spaces allowed";
        else delete newErrors.fullName;
        break;

      case "email":
        if (!value) newErrors.email = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          newErrors.email = "Invalid email format";
        else delete newErrors.email;
        break;

      case "username":
        if (!value) newErrors.username = "Username is required";
        else if (value.length < 4)
          newErrors.username = "Username must be at least 4 characters";
        else if (value.length > 20)
          newErrors.username = "Username must not exceed 20 characters";
        else if (!/^[a-zA-Z0-9]+$/.test(value))
          newErrors.username = "Only alphanumeric characters allowed";
        else delete newErrors.username;
        break;

      case "password":
        if (!value) newErrors.password = "Password is required";
        else if (value.length < 8)
          newErrors.password = "Password must be at least 8 characters";
        else if (!/(?=.*[A-Z])/.test(value))
          newErrors.password = "Include at least one uppercase letter";
        else if (!/(?=.*[a-z])/.test(value))
          newErrors.password = "Include at least one lowercase letter";
        else if (!/(?=.*[0-9])/.test(value))
          newErrors.password = "Include at least one number";
        else if (!/(?=.*[!@#$%^&*])/.test(value))
          newErrors.password = "Include at least one special character";
        else delete newErrors.password;
        break;

      case "terms":
        if (!value)
          newErrors.terms = "You must accept the terms and conditions";
        else delete newErrors.terms;
        break;

      default:
        break;
    }

    setErrors(newErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields
    Object.keys(formData).forEach((key) => validateField(key, formData[key]));

    if (Object.keys(errors).length === 0) {
      setIsLoading(true);

      // Simulate API call
      try {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setIsSuccess(true);
        // Reset form after successful submission
        setFormData({
          fullName: "",
          email: "",
          username: "",
          password: "",
          terms: false,
        });
      } catch (error) {
        setErrors({ submit: "Registration failed. Please try again." });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const getStrengthColor = () => {
    switch (passwordStrength) {
      case 0:
        return "bg-red-500";
      case 1:
        return "bg-red-400";
      case 2:
        return "bg-yellow-500";
      case 3:
        return "bg-yellow-400";
      case 4:
        return "bg-green-500";
      case 5:
        return "bg-green-400";
      default:
        return "bg-gray-200";
    }
  };
  const handleLoginGoogle = () => {
    console.log("login google...");
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        const token = result.user.accessToken;
        const user = result.user;

        console.log(user);
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-pink-200 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        {isSuccess ? (
          <div className="text-center">
            <FaCheckCircle className="mx-auto h-12 w-12 text-green-500" />
            <h2 className="mt-4 text-2xl font-bold text-gray-900">
              Registration Successful!
            </h2>
            <p className="mt-2 text-gray-600">
              Thank you for registering with us.
            </p>
            <button
              onClick={() => setIsSuccess(false)}
              className="mt-4 w-full inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Register Another Account
            </button>
          </div>
        ) : (
          <>
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-gray-900">
                Create your account
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Join us today and experience all our features
              </p>
            </div>

            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="fullName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Full Name
                  </label>
                  <div className="mt-1 relative">
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      value={formData.fullName}
                      onChange={handleChange}
                      className={`appearance-none block w-full px-3 py-2 border ${
                        errors.fullName ? "border-red-300" : "border-gray-300"
                      } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                      placeholder="John Doe"
                    />
                    {errors.fullName && (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <FaTimesCircle className="h-5 w-5 text-red-500" />
                      </div>
                    )}
                  </div>
                  {errors.fullName && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.fullName}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email address
                  </label>
                  <div className="mt-1 relative">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`appearance-none block w-full px-3 py-2 border ${
                        errors.email ? "border-red-300" : "border-gray-300"
                      } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                      placeholder="you@example.com"
                    />
                    {errors.email && (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <FaTimesCircle className="h-5 w-5 text-red-500" />
                      </div>
                    )}
                  </div>
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Username
                  </label>
                  <div className="mt-1 relative">
                    <input
                      id="username"
                      name="username"
                      type="text"
                      value={formData.username}
                      onChange={handleChange}
                      className={`appearance-none block w-full px-3 py-2 border ${
                        errors.username ? "border-red-300" : "border-gray-300"
                      } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                      placeholder="username123"
                    />
                    {errors.username && (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <FaTimesCircle className="h-5 w-5 text-red-500" />
                      </div>
                    )}
                  </div>
                  {errors.username && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.username}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Password
                  </label>
                  <div className="mt-1 relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      className={`appearance-none block w-full px-3 py-2 border ${
                        errors.password ? "border-red-300" : "border-gray-300"
                      } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm pr-10`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <FaEyeSlash className="h-5 w-5 text-gray-400" />
                      ) : (
                        <FaEye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.password}
                    </p>
                  )}
                  <div className="mt-2">
                    <div className="text-sm text-gray-600 mb-1">
                      Password strength:
                    </div>
                    <div className="h-2 w-full bg-gray-200 rounded-full">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${getStrengthColor()}`}
                        style={{ width: `${(passwordStrength / 5) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    checked={formData.terms}
                    onChange={handleChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="terms"
                    className="ml-2 block text-sm text-gray-900"
                  >
                    I agree to the{" "}
                    <a
                      href="#"
                      className="text-indigo-600 hover:text-indigo-500"
                    >
                      Terms and Conditions
                    </a>
                  </label>
                </div>
                {errors.terms && (
                  <p className="mt-2 text-sm text-red-600">{errors.terms}</p>
                )}
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading || Object.keys(errors).length > 0}
                  className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                    isLoading || Object.keys(errors).length > 0
                      ? "bg-indigo-400 cursor-not-allowed"
                      : "bg-indigo-600 hover:bg-indigo-700"
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                >
                  {isLoading ? (
                    <svg
                      className="animate-spin h-5 w-5 text-white"
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
                  ) : (
                    "Register"
                  )}
                </button>
              </div>

              <div className="flex items-center justify-center">
                <div className="border-t border-gray-300 flex-grow"></div>
                <span className="px-4 text-sm text-gray-500">OR</span>
                <div className="border-t border-gray-300 flex-grow"></div>
              </div>

              <div
                onClick={handleLoginGoogle}
                className="w-full flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaGoogle className="text-red-500 mr-2" />
              </div>
              <div className="mt-6 text-center">
                <button className="text-sm text-indigo-600 hover:text-indigo-500 hover:underline focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  Already have an account?
                  <Link to={"/login"} className="text-primary hover:underline">
                    Login
                  </Link>
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default RegisterPage;
