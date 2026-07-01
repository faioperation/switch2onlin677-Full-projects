import { ChevronLeft, ChevronRight } from "lucide-react";

const LeadsPagination = ({ page, setPage, totalPages, total, limit }) => {
  const start = total === 0 ? 0 : (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">

      {/* Entry count */}
      <p className="text-xs text-gray-500 order-2 sm:order-1">
        Showing <span className="text-gray-300 font-medium">{start}–{end}</span> of{" "}
        <span className="text-gray-300 font-medium">{total}</span> leads
      </p>

      {/* Page buttons */}
      <div className="flex items-center gap-1.5 order-1 sm:order-2 flex-wrap justify-center">

        {/* Previous */}
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm text-white font-medium bg-[#00CE51] hover:bg-[#00b847] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={14} />
          <span className="hidden sm:inline">Previous</span>
        </button>

        {/* Page numbers with ellipsis */}
        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
          .reduce((acc, p, idx, arr) => {
            if (idx > 0 && p - arr[idx - 1] > 1) acc.push("...");
            acc.push(p);
            return acc;
          }, [])
          .map((item, idx) =>
            item === "..." ? (
              <span key={`dot-${idx}`} className="px-1 text-gray-600 text-sm">…</span>
            ) : (
              <button
                key={item}
                onClick={() => setPage(item)}
                className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                  page === item
                    ? "bg-[#00CE51] text-white"
                    : "text-gray-400 hover:bg-[#222] border border-[#2A2A2A]"
                }`}
              >
                {item}
              </button>
            )
          )}

        {/* Next */}
        <button
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages || totalPages === 0}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm text-white font-medium bg-[#00CE51] hover:bg-[#00b847] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight size={14} />
        </button>

      </div>
    </div>
  );
};

export default LeadsPagination;