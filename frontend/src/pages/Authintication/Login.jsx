import React, { useState } from "react";
import { useForm } from "react-hook-form";
import logo from "../../assets/Vector.png";
import { useNavigate } from "react-router";
import { useAuth } from "../Provider/AuthProvider";
import Cookies from "js-cookie";
import axios from "axios";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {

  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false)

  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/login/`,
        data
      );

      Cookies.set("accessToken", res.data.tokens.access);

      login(res.data);

      navigate("/");
      toast.success("Login Successful!");

    } catch {

      // console.log(err.response?.data);
      toast.error("Something went wrong!");

    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1D1D1D] text-white">

      <div className="w-[650px] border border-[#636363] rounded-2xl p-10">

        {/* Logo */}
        <div className="flex flex-col items-center mb-8">

          <div className="flex items-center gap-2 mb-3">
            <img src={logo} alt="logo" className="w-12 h-12" />
            <h1 className="text-3xl font-semibold">LoGo</h1>
          </div>

          <h2 className="text-lg font-semibold">
            Login your Profile
          </h2>

          <p className="text-sm text-[#A4A4A4] mt-1">
            Start with new journey
          </p>

        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

          {/* Email */}
          <div>

            <label className="text-sm text-gray-300">
              Email
            </label>

            <input
              type="email"
              {...register("email", { required: true })}
              className="w-full mt-2 px-4 py-3 rounded-lg bg-white/5 border border-[#636363]"
            />

          </div>

          {/* Password */}
          <div>

            <label className="text-sm text-gray-300">
              Password
            </label>

            <div className="relative mt-2">

              <input
                type={showPassword ? "text" : "password"}
                {...register("password", { required: true })}
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-[#636363] pr-12"
              />

              {/* Toggle Button */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>

            </div>

            {/* Forgot Password */}
            <div className="flex justify-end mt-2">
              <button
                type="button"
                onClick={() => navigate("/auth/forget-password")}
                className="text-sm text-[#A4A4A4] hover:text-white transition"
              >
                Forgot password?
              </button>
            </div>

          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full"
          >
            {/* Continue */}
            {loading ? "Processing..." : "Log In"}
          </button>

        </form>

      </div>

    </div>
  );
};

export default Login;