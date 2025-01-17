import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import toast from "react-hot-toast";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { apis, setTokens } from "../../../utils/connection";
import logo from "../../../assets/images/softfixLogo.png";
import bannerImage from "../../../assets/images/bannerSignin.jpg";

const Login = () => {
  const AccessToken = sessionStorage.getItem("Softfix_Web_Token");
  useEffect(() => {
    if (AccessToken) {
      navigate("/dashboard");
    }
  }, [AccessToken]);

  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError("Please fill in all fields");
      return;
    }
    const cred = {
      username: username.trim(),
      password: password.trim(),
    };
    setLoading(true);
    setError("");
    try {
      const response = await axios.post(`${apis.empUrl}/auth`, cred);
      if (response.status === 200) {
        setTokens(response?.data?.data);
        toast.success(response?.data?.msg || "Login successfull");
        window.location.href = "/dashboard";
      } else {
        toast.error(response?.data?.msg || "Error while Login");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "An unknown error occurred.";
      setError(errorMessage);
      toast.error(errorMessage || "Error while processing");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = sessionStorage.getItem("SoftfixSkypeToken");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  return (
    <section className="min-h-screen bg-white flex items-center justify-center  p-6">
      <div className="bg-white  rounded-3xl overflow-hidden flex flex-col md:flex-row w-full max-w-4xl">
        {/* Left Image Section */}
        <div className="w-full md:w-1/2 hidden md:flex items-center justify-center p-6">
          <img
            src={bannerImage}
            alt="Sign in banner"
            className="object-cover rounded-xl "
          />
        </div>
        {/* Right Form Section */}
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
          <div className="text-center mb-8">
            <img src={logo} alt="Connect Team logo" className="mx-auto h-12" />
            <h1 className="text-3xl font-bold text-gray-800 mt-4">
              Welcome Back
            </h1>
            <p className="text-sm text-gray-500 mt-2">
              Sign in to access your dashboard
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="username"
                className="block text-gray-700 font-medium"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={username}
                placeholder="Enter your username"
                onChange={(e) => setUsername(e.target.value)}
                className="w-full mt-2 px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-gray-700 font-medium"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={password}
                  placeholder="Enter your password"
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full mt-2 px-4 py-3 rounded-lg relative bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                  type="button"
                  className="absolute right-3 top-6 text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEye /> : <FaEyeSlash />}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-gray-300 text-purple-500 focus:ring-purple-500"
                />
                <span className="text-sm text-gray-600">Remember Me</span>
              </label>
              <a href="/forgot-password" className="text-sm text-purple-500">
                Forgot Password?
              </a>
            </div>
            {error && (
              <p className="text-red-600 bg-red-50 border border-red-200 p-3 rounded-lg text-sm">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={loading}
              className={` ${
                loading ? "bg-gray-300" : "bg-purple-600 hover:bg-purple-700"
              } w-full py-3 rounded-lg text-white  transition duration-300 disabled:opacity-50`}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
          <p className="mt-6 text-sm text-center text-gray-500">
            Don’t have an account?{" "}
            <a href="/register" className="text-purple-500">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Login;
