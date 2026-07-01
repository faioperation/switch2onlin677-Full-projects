import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import logo from "../../assets/Vector.png";
import { useMutation } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxios";
import { toast } from "react-toastify";

const ForgetPassword = () => {

  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();


  // use mutation if updating data 

  const forgotMutation = useMutation({
    mutationFn: (data) =>
      axiosSecure.post("/auth/forgot-password/", data),

    onSuccess: (res, variables) => {

      toast.success("OTP sent to your email");
      // console.log(res);


      navigate("/auth/otp", {
        state: { email: variables.email }
      });

    },

    onError: () => {
      toast.error("Failed to send OTP");
    }
  });

  const onSubmit = (data) => {
    forgotMutation.mutate(data);
  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-[#1D1D1D] text-white">

      <div className="w-[650px] border border-[#636363] rounded-2xl p-10 bg-white/3">

        <div className="flex flex-col items-center mb-8">

          <div className="flex items-center gap-2 mb-3">
            <img src={logo} alt="logo" className="w-12 h-12" />
            <h1 className="text-3xl font-semibold">LoGo</h1>
          </div>

          <h2 className="text-lg font-semibold">
            Forgot Password?
          </h2>

          <p className="text-sm text-[#A4A4A4] mt-1">
            Please enter your email to get verification code
          </p>

        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

          <div>

            <label className="text-sm text-gray-300">
              Email
            </label>

            <input
              type="email"
              {...register("email", { required: true })}
              className="w-full mt-2 px-4 py-3 rounded-lg bg-white/5 border border-[#636363]"
            />

            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                Email is required
              </p>
            )}

          </div>

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

export default ForgetPassword;