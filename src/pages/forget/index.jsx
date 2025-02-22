import React, { useState } from "react";
import { FiMail } from "react-icons/fi";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email address");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }
    setIsSubmitted(true);
    setError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-rose-200 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-2xl">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Forgot Password?
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Don't worry! It happens. Please enter the email address associated
            with your account.
          </p>
        </div>

        {!isSubmitted ? (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div className="relative">
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none rounded-lg relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-pink-500 focus:border-pink-500 focus:z-10 sm:text-sm"
                  placeholder="Enter your email address"
                />
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-colors duration-200"
              >
                Send Reset Link
              </button>
            </div>
          </form>
        ) : (
          <div className="mt-8 text-center space-y-4">
            <div className="text-green-500 font-medium">
              Reset link has been sent to your email!
            </div>
            <p className="text-sm text-gray-600">
              Please check your email and follow the instructions to reset your
              password.
            </p>
            <button
              onClick={() => {
                setIsSubmitted(false);
                setEmail("");
              }}
              className="text-pink-600 hover:text-pink-700 font-medium transition-colors duration-200"
            >
              Try another email
            </button>
          </div>
        )}

        <div className="mt-4 text-center">
          <a
            href="\login"
            className="font-medium text-pink-600 hover:text-pink-700 transition-colors duration-200"
          >
            Back to Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
