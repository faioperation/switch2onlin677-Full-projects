import { useForm } from "react-hook-form";
import useAxiosSecure from "../../hooks/useAxios";

const AdminModal = ({ close, refetch }) => {

  const axiosSecure = useAxiosSecure();

  const {
    register,
    handleSubmit
  } = useForm();

  const onSubmit = async (data) => {

    try {

      await axiosSecure.post("/auth/users/", data);

      // console.log(res.data);

      refetch();

      close();

    } catch {

      // console.log(err);

    }

  };

  return (
    <div
      onClick={close}
      className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#1A1A1A] w-full max-w-lg p-6 rounded-xl border border-[#262626]"
      >

        <h3 className="text-white text-lg mb-6">
          Add Admin
        </h3>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

          <input
            placeholder="Name"
            {...register("name", { required: true })}
            className="w-full bg-white/5 border border-[#2A2A2A] rounded-lg px-3 py-2 text-white"
          />

          <input
            placeholder="Email"
            {...register("email", { required: true })}
            className="w-full bg-white/5 border border-[#2A2A2A] rounded-lg px-3 py-2 text-white"
          />

          <input
            type="password"
            placeholder="Password"
            {...register("password", { required: true })}
            className="w-full bg-white/5 border border-[#2A2A2A] rounded-lg px-3 py-2 text-white"
          />

          <div className="flex justify-end gap-3 pt-4">

            <button
              type="button"
              onClick={close}
              className="border border-red-500 text-red-500 px-4 py-2 rounded-lg"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="bg-[#00CE51] text-white px-4 py-2 rounded-lg"
            >
              Save Admin
            </button>

          </div>

        </form>

      </div>
    </div>
  );

};

export default AdminModal;