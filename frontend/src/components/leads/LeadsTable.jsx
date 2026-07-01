import { Trash2, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router";

const platformStyles = {
  instagram: "bg-pink-500/10 text-pink-400 border border-pink-500/20",
  facebook:  "bg-blue-500/10 text-blue-400 border border-blue-500/20",
  whatsapp:  "bg-green-500/10 text-green-400 border border-green-500/20",
};

const formatDate = (iso) => {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const LeadsTable = ({ data, onDelete, page = 1, limit = 10 }) => {
  const navigate = useNavigate();
  if (!data.length) {
    return (
      <div className="text-center py-16 text-gray-500 text-sm">
        No leads found.
      </div>
    );
  }

  return (
    /* Horizontal scroll on mobile */
    <div className="overflow-x-auto scrollbar-hide -mx-2 sm:mx-0">

      {/* Swipe hint — mobile only */}
      <p className="sm:hidden text-xs text-gray-600 px-2 mb-2">← Swipe to see more →</p>

      <table className="min-w-[640px] w-full text-sm">

        <thead>
          <tr className="bg-[#253029] text-gray-400 text-xs uppercase tracking-wider">
            <th className="py-3 px-4 text-left rounded-tl-lg">#</th>
            <th className="py-3 px-4 text-left">Name</th>
            <th className="py-3 px-4 text-left">Interested Product</th>
            <th className="py-3 px-4 text-left">Date</th>
            <th className="py-3 px-4 text-left">Platform</th>
            <th className="py-3 px-4 text-center rounded-tr-lg">Action</th>
          </tr>
        </thead>

        <tbody>
          {data.map((lead, index) => {
            // Calculate continuous serial number: (page-1)*limit + index + 1
            const serialNumber = (Number(page) - 1) * Number(limit) + index + 1;
            
            return (
              <tr
                key={lead.id}
                className="border-b border-[#1f1f1f] hover:bg-[#1f1f1f] transition-colors"
              >

                <td className="py-4 px-4 text-gray-500 font-mono text-xs">
                  {String(serialNumber).padStart(2, "0")}
                </td>

              <td className="py-4 px-4 text-white font-medium whitespace-nowrap">
                {lead.name}
              </td>

              <td className="py-4 px-4 text-gray-400 max-w-[200px] truncate" title={lead.interested_product}>
                {lead.interested_product || "—"}
              </td>

              <td className="py-4 px-4 text-gray-400 whitespace-nowrap">
                {formatDate(lead.date)}
              </td>

              <td className="py-4 px-4">
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize whitespace-nowrap ${
                  platformStyles[lead.platform?.toLowerCase()] || "bg-gray-500/10 text-gray-400 border border-gray-500/20"
                }`}>
                  {lead.platform}
                </span>
              </td>

              <td className="py-4 px-4">
                <div className="flex items-center justify-center gap-2">
                  <button
                    title="View conversation"
                    onClick={() => navigate(`/conversation?sender_id=${lead.sender_id}`)}
                    className="p-1.5 rounded-md text-gray-500 hover:text-white hover:bg-[#2a2a2a] transition-colors"
                  >
                    <MessageSquare size={16} />
                  </button>
                  <button
                    title="Delete lead"
                    onClick={() => onDelete(lead.id)}
                    className="p-1.5 rounded-md text-red-500/70 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>

              </tr>
            );
          })}
        </tbody>

      </table>
    </div>
  );
};

export default LeadsTable;