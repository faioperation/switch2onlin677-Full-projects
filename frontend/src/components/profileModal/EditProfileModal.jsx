import { useForm } from "react-hook-form";
import { useState } from "react";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxios";

const EditProfileModal = ({ close, profile, avatar }) => {

  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const { register, handleSubmit } = useForm({
    defaultValues: {
      name: profile?.name,
      email: profile?.email
    }
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const handleImageChange = (e) => {

    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));

  };

  const onSubmit = async (data) => {

    try {

      const formData = new FormData();
      formData.append("name", data.name);

      if (imageFile) {
        formData.append("profile_image", imageFile);
      }

      const res = await axiosSecure.patch("/auth/me/", formData);

      toast.success("Profile updated successfully 🎉");

      // React Query cache update
      queryClient.setQueryData(["profile"], res.data);
      queryClient.invalidateQueries(["profile"]);

      close();

    } catch {

      // console.log(err.response?.data);
      toast.error("Failed to update profile ❌");

    }

  };

  return (

    <div
      onClick={close}
      className="fixed inset-0 bg-[#80808080] backdrop-blur-md flex items-center justify-center p-4 z-50"
    >

      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#1A1A1A] w-full max-w-3xl p-6 rounded-xl border border-[#262626]"
      >

        <h3 className="text-white text-2xl mb-6">
          Edit Profile
        </h3>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

          <div className="flex items-center gap-4">

            <img
              src={imagePreview || avatar || "/default-avatar.png"}
              alt="avatar"
              className="w-14 h-14 rounded-full object-cover"
            />

            <label className="text-md bg-[#2A2A2A] px-3 py-1.5 rounded-md text-gray-300 cursor-pointer hover:bg-[#333]">

              Upload File

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />

            </label>

          </div>

          <div>

            <label className="text-xs text-gray-400 mb-1 block">
              Name
            </label>

            <input
              {...register("name")}
              className="w-full bg-[#111] border border-[#3A3A3A] rounded-md px-3 py-2 text-white text-sm"
            />

          </div>

          <div>

            <label className="text-xs text-gray-400 mb-1 block">
              Email
            </label>

            <input
              {...register("email")}
              readOnly
              className="w-full bg-[#111] border border-[#3A3A3A] rounded-md px-3 py-2 text-gray-400 text-sm cursor-not-allowed"
            />

          </div>

          <div className="flex justify-end gap-3 pt-3">

            <button
              type="button"
              onClick={close}
              className="border border-red-500 text-red-500 px-4 py-2 rounded-md text-sm"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="bg-[#00CE51] hover:bg-[#035022] text-white px-4 py-2 rounded-md text-sm"
            >
              Save Change
            </button>

          </div>

        </form>

      </div>

    </div>

  );

};

export default EditProfileModal;