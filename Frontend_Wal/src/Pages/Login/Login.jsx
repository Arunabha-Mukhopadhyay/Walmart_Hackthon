import React, { useState } from "react";
import { Link,useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("staff");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");


  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:3000/api/v1/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
        credentials: "include", 
      });

      const data = await response.json();

      if (response.ok) {
        if (role === "staff") {
          navigate("/dashboard");
        } else {
          navigate("/customer-dashboard");
        }
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f5faff] to-[#e9f0ff]">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col items-center mb-8">
            <div className="bg-blue-600 rounded-full w-20 h-20 flex items-center justify-center mb-4">
              <svg width="40" height="40" fill="none" viewBox="0 0 24 24">
                <rect x="3" y="7" width="18" height="13" rx="2" fill="#fff" />
                <rect
                  x="1"
                  y="4"
                  width="22"
                  height="4"
                  rx="2"
                  fill="#fff"
                  stroke="#2563eb"
                  strokeWidth="2"
                />
                <rect x="7" y="14" width="4" height="6" rx="1" fill="#2563eb" />
              </svg>
            </div>

            <h1 className="text-3xl font-bold text-center mb-1">
              Welcome Back
            </h1>
            <p className="text-gray-500 text-center">
              Sign in to access your dashboard
            </p>
          </div>

          <div className="flex mb-6">
            <button
              type="button"
              className={`flex-1 py-2 rounded-l-lg font-semibold text-lg transition ${
                role === "staff"
                  ? "bg-white text-black shadow"
                  : "bg-gray-100 text-gray-500"
              }`}
              onClick={() => setRole("staff")}
            >
              Staff
            </button>

            <button
              type="button"
              className={`flex-1 py-2 rounded-r-lg font-semibold text-lg transition ${
                role === "customer"
                  ? "bg-white text-black shadow"
                  : "bg-gray-100 text-gray-500"
              }`}
              onClick={() => setRole("customer")}
            >
              Customer
            </button>
          </div>

          <div className="mb-4">
            <label className="block font-medium mb-1" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 bg-gray-50"
            />
          </div>

          {error && <div className="text-red-500 mb-2">{error}</div>}

          <div className="mb-6">
            <label className="block font-medium mb-1" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 bg-gray-50 pr-10"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                tabIndex={-1}
                onClick={() => setShowPassword((v) => !v)}
              >
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
                  <path
                    d="M1.5 12s3.5-7 10.5-7 10.5 7 10.5 7-3.5 7-10.5 7S1.5 12 1.5 12z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <circle
                    cx="12"
                    cy="12"
                    r="3"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                </svg>
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow transition mb-4 text-lg"
          >
            Sign In
          </button>

          <div className="text-center">
            <Link
              to="/create"
              className="text-blue-600 font-medium hover:underline cursor-pointer mb-4"
            >
              Don't have an account? <span className="underline">Sign up</span>
            </Link>

            <Link
              to="/"
              className="text-gray-600 hover:underline cursor-pointer flex items-center justify-center gap-1"
            >
              <span className="text-lg">←</span> Back to Home
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
