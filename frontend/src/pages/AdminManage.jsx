import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import AdminModal from "../components/admin/AdminModal";
import { Trash } from "lucide-react";
import useAxiosSecure from "../hooks/useAxios";
import Swal from "sweetalert2";
import Loader from "../components/Loader";

const AdminManage = () => {

  const axiosSecure = useAxiosSecure();
  const [open, setOpen] = useState(false);

  /* ======================
        GET ADMINS
  ====================== */

  const {
    data: admins = [],
    refetch,
    isLoading
  } = useQuery({
    queryKey: ["admins"],
    queryFn: async () => {

      const res = await axiosSecure.get("/auth/users/");
      return res.data;

    }
  });

  /* ======================
        DELETE ADMIN
  ====================== */

  const handleDelete = (id) => {

    Swal.fire({
      title: "Are you sure?",
      text: "This admin will be removed!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#00CE51",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {

      if (result.isConfirmed) {

        try {

          await axiosSecure.delete(`/auth/users/${id}/`);

          // console.log("Deleted admin");

          refetch();

          Swal.fire({
            title: "Deleted!",
            text: "Admin has been deleted.",
            icon: "success"
          });

        } catch {

          // console.log(err);

          Swal.fire({
            title: "Error!",
            text: "Failed to delete admin.",
            icon: "error"
          });

        }

      }

    });

  };

  if (isLoading) {
    return <Loader />;
  }

  return (

    <div className="w-full min-h-[calc(100vh-70px)] pb-6">

      {/* Header */}

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">

        <h2 className="text-white text-lg font-semibold">
          All Admin
        </h2>

        <button
          onClick={() => setOpen(true)}
          className="bg-[#00CE51] px-4 py-2 rounded-lg text-sm text-white w-full sm:w-auto"
        >
          + Add Admin
        </button>

      </div>

      {/* Table */}

      <div className="bg-[#1A1A1A] border border-[#262626] rounded-xl overflow-hidden">

        {/* Mobile swipe hint */}

        <div className="sm:hidden text-xs text-gray-400 px-3 py-2 border-b border-[#262626]">
          ← Swipe to see more →
        </div>

        <div className="overflow-x-auto scrollbar-hide scroll-smooth">

          <table className="min-w-[720px] w-full text-sm text-left">

            <thead className="bg-[#253029] text-gray-300">

              <tr>
                <th className="p-3">#</th>
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Last Active</th>
                <th className="p-3">Status</th>
                <th className="p-3">Action</th>
              </tr>

            </thead>

            <tbody>

              {admins.map((admin, index) => (

                <tr
                  key={admin.id}
                  className="border-t border-[#262626] hover:bg-[#202020]"
                >

                  <td className="p-3 text-gray-300">
                    {String(index + 1).padStart(2, "0")}
                  </td>

                  <td className="p-3 text-white">
                    {admin.name}
                  </td>

                  <td className="p-3 text-gray-400">
                    {admin.email}
                  </td>

                  <td className="p-3 text-gray-400">
                    {admin.last_active || "N/A"}
                  </td>

                  <td className="p-3">
                    <span className="bg-[#1f2937] px-3 py-1 rounded-full text-xs text-gray-300">
                      {admin.role}
                    </span>
                  </td>

                  <td className="p-3">

                    <Trash
                      size={16}
                      onClick={() => handleDelete(admin.id)}
                      className="text-red-500 cursor-pointer hover:text-red-400"
                    />

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

      {/* Modal */}

      {open && (
        <AdminModal
          close={() => setOpen(false)}
          refetch={refetch}
        />
      )}

    </div>

  );

};

export default AdminManage;