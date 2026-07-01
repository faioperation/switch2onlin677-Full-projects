import { useState } from "react";
import { useForm } from "react-hook-form";
import useAxiosSecure from "../../hooks/useAxios";
import Swal from "sweetalert2";
import { Eye, EyeOff } from "lucide-react";

const ChangePasswordModal = ({ close }) => {

  const axiosSecure = useAxiosSecure();

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const onSubmit = async (data) => {

    try {

      await axiosSecure.post("/auth/change-password/", {
        old_password: data.oldPassword,
        new_password: data.newPassword,
        confirm_password: data.confirmPassword
      });

      // console.log("Password changed");

      Swal.fire({
        icon: "success",
        title: "Password Changed",
        text: "Your password has been updated successfully"
      });

      close();

    } catch {

      // console.log(err.response?.data);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to change password"
      });

    }

  };

  return (

    <div
      onClick={close}
      className="fixed inset-0 bg-[#80808080] backdrop-blur-md flex items-center justify-center p-4 z-50"
    >

      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#1A1A1A] w-full max-w-2xl mx-auto p-6 rounded-xl border border-[#262626]"
      >

        <h3 className="text-white text-2xl mb-6">
          Change Password
        </h3>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          {/* Old Password */}
          <div className="relative">

            <input
              type={showOld ? "text" : "password"}
              placeholder="Old Password"
              {...register("oldPassword", {
                required: "Old password is required"
              })}
              className="w-full bg-white/5 border border-[#2A2A2A] rounded-lg px-3 py-2 pr-10 text-white"
            />

            <button
              type="button"
              onClick={() => setShowOld(!showOld)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showOld ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>

            {errors.oldPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.oldPassword.message}
              </p>
            )}

          </div>

          {/* New Password */}
          <div className="relative">

            <input
              type={showNew ? "text" : "password"}
              placeholder="New Password"
              {...register("newPassword", {
                required: "New password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters"
                }
              })}
              className="w-full bg-white/5 border border-[#2A2A2A] rounded-lg px-3 py-2 pr-10 text-white"
            />

            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>

            {errors.newPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.newPassword.message}
              </p>
            )}

          </div>

          {/* Confirm Password */}
          <div className="relative">

            <input
              type={showConfirm ? "text" : "password"}
              placeholder="Confirm Password"
              {...register("confirmPassword", {
                required: "Confirm password is required"
              })}
              className="w-full bg-white/5 border border-[#2A2A2A] rounded-lg px-3 py-2 pr-10 text-white"
            />

            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>

            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword.message}
              </p>
            )}

          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-3">

            <button
              type="button"
              onClick={close}
              className="border border-red-500 text-red-500 px-4 py-2 rounded-lg text-sm"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="bg-[#00CE51] text-white px-4 py-2 rounded-lg text-sm"
            >
              Save Change
            </button>

          </div>

        </form>

      </div>

    </div>

  );

};

export default ChangePasswordModal;