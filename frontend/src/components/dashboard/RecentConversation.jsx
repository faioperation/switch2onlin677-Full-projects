import React from "react";
import { MessageCircle, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import useAxiosSecure from "../../hooks/useAxios";

const platformStyle = {
  instagram: "bg-pink-500/10 text-pink-400",
  facebook: "bg-blue-500/10 text-blue-400",
  whatsapp: "bg-green-500/10 text-green-400",
};

const RecentConversation = () => {
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["recent-conversations"],
    queryFn: async () => {
      const res = await axiosSecure.get("/api/v1/dashboard/recent-conversations/");
      return res.data;
    },
  });
  // console.log("recent conversations data : ", data);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleChatNavigation = (senderId) => {
    if (!senderId) return;
    navigate(`/conversation?sender_id=${senderId}`);
  };

  if (isLoading) {
    return (
      <div className="bg-[#1A1A1A] rounded-xl p-6 border border-[#262626] h-[400px] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#00CE51]" size={32} />
      </div>
    );
  }

  const conversations = Array.isArray(data) ? data : [];

  return (
    <div className="bg-[#1A1A1A] rounded-xl p-6 border border-[#262626] h-full">

      <h3 className="text-white mb-6 font-medium">
        Recent Conversation
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">

          {/* Table Header */}
          <thead className="bg-[#253029] text-gray-300">
            <tr>
              <th className="text-left py-3 px-3">SL</th>
              <th className="text-left px-3">Name</th>
              <th className="text-left px-3">Last Active</th>
              <th className="text-left px-3">Platform</th>
              <th className="text-left px-3">Action</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="text-[#BFBFBF]">

            {conversations.length > 0 ? (
              conversations.slice(0, 6).map((item, index) => (
                <tr
                  key={item.id}
                  className="border-b border-[#262626] hover:bg-[#202020] transition"
                >

                  {/* Number */}
                  <td className="py-4 px-3 text-[#BFBFBF]">
                    {String(index + 1).padStart(2, "0")}
                  </td>

                  {/* Name */}
                  <td className="px-3 text-[#BFBFBF]">
                    <span className="font-medium text-white">{item.full_name || "Unknown"}</span>
                  </td>

                  {/* Date */}
                  <td className="px-3">
                    {formatDate(item.last_interaction)}
                  </td>

                  {/* Platform Badge */}
                  <td className="px-3">
                    <span
                      className={`px-2 py-1 rounded-md text-[10px] uppercase font-bold ${platformStyle[item.platform?.toLowerCase()] || "bg-gray-500/10 text-gray-400"}`}
                    >
                      {item.platform}
                    </span>
                  </td>

                  {/* Action Icon */}
                  <td className="px-3 text-center">
                    <button
                      onClick={() => handleChatNavigation(item.sender_id)}
                      className="w-8 h-8 mx-auto flex items-center text-center justify-center rounded-md border border-[#2A2A2A] hover:bg-[#2A2A2A] hover:text-[#00CE51] transition cursor-pointer"
                    >
                      <MessageCircle size={16} />
                    </button>
                  </td>

                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="py-10 text-center text-gray-500 italic">
                  {isError ? "Failed to load conversations" : "No recent conversations found"}
                </td>
              </tr>
            )}

          </tbody>

        </table>
      </div>

    </div>
  );
};

export default RecentConversation;

