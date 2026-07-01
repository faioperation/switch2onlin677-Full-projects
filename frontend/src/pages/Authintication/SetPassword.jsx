import React, { useState } from "react";
import { useForm } from "react-hook-form";
import logo from "../../assets/Vector.png";
import { useNavigate, useLocation } from "react-router";
import useAxiosSecure from "../../hooks/useAxios";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";

const SetPassword = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const axiosSecure = useAxiosSecure();

  const email = location.state?.email;

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors }
  } = useForm();


  const onSubmit = async (data) => {

    if (!email) {
      toast.error("Email not found. Please try again.");
      navigate("/auth/forget-password");
      return;
    }

    try {

      await axiosSecure.post("/auth/reset-password/", {
        email: email,
        new_password: data.newPassword,
        confirm_password: data.confirmPassword
      });

      // console.log("Password Reset Successful");

      toast.success("Password Reset Successful");

      navigate("/auth/password-successfull");

    } catch {

      // console.log(err.response?.data);
      toast.error("Failed to reset password");

    }

  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-[#1D1D1D] text-white">

      <div className="w-[650px] border border-[#636363] rounded-2xl p-10 bg-white/3">

        {/* Logo */}
        <div className="flex flex-col items-center mb-8">

          <div className="flex items-center gap-2 mb-3">
            <img src={logo} alt="logo" className="w-12 h-12" />
            <h1 className="text-3xl font-semibold">LoGo</h1>
          </div>

          <h2 className="text-lg font-semibold">
            Set Password
          </h2>

          <p className="text-sm text-[#A4A4A4] mt-1">
            Start with new journey
          </p>

        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

          {/* New Password */}
          <div>

            <label className="text-sm text-gray-300">
              New Password
            </label>

            <div className="relative mt-2">

              <input
                type={showNewPassword ? "text" : "password"}
                placeholder="******"
                {...register("newPassword", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters"
                  }
                })}
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-[#636363] outline-none focus:border-[#00CE51] pr-10"
              />

              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>

            </div>

            {errors.newPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.newPassword.message}
              </p>
            )}

          </div>

          {/* Confirm Password */}
          <div>

            <label className="text-sm text-gray-300">
              Confirm Password
            </label>

            <div className="relative mt-2">

              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="******"
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === getValues("newPassword") || "Passwords do not match"
                })}
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-[#636363] outline-none focus:border-[#00CE51] pr-10"
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>

            </div>

            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword.message}
              </p>
            )}

          </div>

          {/* Button */}
          <button
            type="submit"
            className="btn-primary"
          >
            Continue
          </button>

        </form>

      </div>

    </div>
  );
};

export default SetPassword;