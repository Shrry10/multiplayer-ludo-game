import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

const Home = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState(""); // Username for signup
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [isSignup, setIsSignup] = useState(false); // Track if the user is signing up
  const [error, setError] = useState("");
  const router = useRouter();

  // Toggle between Signup and Login modes
  const toggleSignup = () => {
    setIsSignup(!isSignup);
    setOtpSent(false); // Reset OTP state when toggling
    setEmail("");
    setUsername(""); // Reset username when switching modes
    setOtp("");
    setError("");
  };

  // Send OTP for signup or login
  const handleSendOtp = async () => {
    try {
      const url = isSignup
        ? "http://localhost:5000/authentication/signup" // Signup API
        : "http://localhost:5000/authentication/login"; // Login OTP API

      const data = isSignup ? { email, username } : { email }; // Send username only for signup

      const response = await axios.post(url, data);

      if (response.data.success) {
        setOtpSent(true);
        setError("");
        alert(`Your One Time Password is ${response.data.otp}`);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError("Error sending OTP. Please check your email.");
    }
  };

  // Verify OTP for signup or login
  const handleVerifyOtp = async () => {
    try {
      const url = isSignup
        ? "http://localhost:5000/authentication/verify-signup-otp"
        : "http://localhost:5000/authentication/verify-login-otp";

        const data = isSignup ? { email, username, otp } : { email, otp }; // Send username only for signup

        const response = await axios.post(url, data);

      if (response.data.success) {
        const token = response.data.token;
        localStorage.setItem("jwtToken", token); // Save token in localStorage
        setError("");
        router.push("/lobby"); // Redirect to lobby page after successful signup/login
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError("Invalid OTP. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">
          {isSignup ? "Sign Up to Play Ludo" : "Login to Play Ludo"}
        </h1>

        {!otpSent ? (
          <div className="mb-4">
            {isSignup && (
              <input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            )}
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSendOtp}
              className="w-full mt-4 py-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition duration-200"
            >
              {isSignup ? "Send OTP for Signup" : "Send OTP for Login"}
            </button>
          </div>
        ) : (
          <div className="mb-4">
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleVerifyOtp}
              className="w-full mt-4 py-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition duration-200"
            >
              {isSignup ? "Verify Signup OTP" : "Verify Login OTP"}
            </button>
          </div>
        )}

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        {/* Toggle between Signup and Login */}
        <p className="text-center mt-4 text-sm">
          {isSignup ? (
            <>
              Already have an account?{" "}
              <button
                onClick={toggleSignup}
                className="text-blue-500 underline"
              >
                Login
              </button>
            </>
          ) : (
            <>
              New here?{" "}
              <button
                onClick={toggleSignup}
                className="text-blue-500 underline"
              >
                Sign up
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default Home;
