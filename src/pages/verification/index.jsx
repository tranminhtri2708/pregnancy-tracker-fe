import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { FiMail } from "react-icons/fi";
import { IoReloadOutline } from "react-icons/io5";


const savedData = JSON.parse(localStorage.getItem("responseData"));
console.log("Saved data: ", savedData);


const EmailVerification = ({ userId }) => {
  const [verificationCode, setVerificationCode] = useState([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);
  const [timeLeft, setTimeLeft] = useState(300);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [resendLoading, setResendLoading] = useState(false);
  const inputRefs = useRef([]);
  

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft]);

  const handleInputChange = (index, value) => {
    if (!/^[0-9]*$/.test(value)) return;

    const newCode = [...verificationCode];
    newCode[index] = value.slice(-1);
    setVerificationCode(newCode);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !verificationCode[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const code = verificationCode.join("");
    if (code.length !== 6) {
      setError("Vui lòng nhập đủ mã xác minh");
      return;
    }
    console.log("api: ");
    
    try {
      const response = await axios.post("http://localhost:5141/api/Auth/Verification", {
        userId : savedData,
        verificationCode:  code,
      });
      console.log("error: ", error);
      if (response.status === 200) {
        setIsSuccess(true);
      }
      setLoading(true);
    } catch (error) {
      setError("Mã xác minh không hợp lệ!");
    } finally {
      setLoading(false);
    }
  };

  const requestNewCode = async () => {
    if (attempts >= 3) {
      setError("Bạn đã hết lượt gửi mã mới!");
      return;
    }

    setResendLoading(true);
    setError("");

    try {
      await axios.post("/api/Auth/ResendCode", { userId });
      setTimeLeft(300);
      setVerificationCode(["", "", "", "", "", ""]);
      setAttempts(attempts + 1);
    } catch (error) {
      setError("Không thể gửi lại mã, vui lòng thử lại sau!");
    } finally {
      setResendLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-bold text-green-600">
              Email Verified!
            </h2>
            <p className="mt-2 text-gray-600">
              Your email has been successfully verified.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <FiMail className="mx-auto h-12 w-12 text-pink-500" />
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Verify Your Email
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Please enter the 6-digit code sent to your email
          </p>
        </div>

        <div className="mt-8 space-y-6">
          <div className="flex justify-center space-x-2">
            {verificationCode.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => (inputRefs.current[idx] = el)}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleInputChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                className={`w-12 h-12 text-center text-xl font-semibold border-2 rounded-lg ${
                  error ? "border-red-300" : "border-gray-300"
                } focus:border-pink-500 focus:ring-pink-500 focus:outline-none transition-all duration-200`}
                aria-label={`Digit ${idx + 1}`}
              />
            ))}
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center" role="alert">
              {error}
            </p>
          )}

          <div className="text-sm text-center">
            <p className="text-gray-600">
              Time remaining: {Math.floor(timeLeft / 60)}:
              {String(timeLeft % 60).padStart(2, "0")}
            </p>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading || verificationCode.join("").length !== 6}
            className={`w-full py-3 px-4 rounded-lg text-white font-medium ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-pink-600 hover:bg-pink-700 focus:ring-4 focus:ring-pink-300"
            } transition-colors duration-200`}
          >
            {loading ? "Verifying..." : "Verify Email"}
          </button>

          {attempts < 3 && (
            <button
              onClick={requestNewCode}
              disabled={resendLoading}
              className="text-pink-600 hover:text-pink-800 font-medium flex items-center justify-center mx-auto space-x-1"
            >
              {resendLoading ? (
                "Sending..."
              ) : (
                <>
                  <IoReloadOutline className="w-4 h-4" />{" "}
                  <span>Resend Code</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
