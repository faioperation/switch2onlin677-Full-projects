import { useState } from "react";
import { RefreshCw, Eye, ChevronLeft, ChevronRight, Clock, X, History } from "lucide-react";
import { useUploadHistory } from "../../hooks/useUploadHistory";
import UploadStatusBadge from "./UploadStatusBadge";

const TAB_LABELS = {
  category: "Best Category",
  subcategory: "Best Subcategory",
  brand: "Best Brand",
  "new-arrival": "New Arrival",
};

const formatDate = (iso) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatDuration = (s) => {
  if (s == null) return "—";
  return s < 60 ? `${s}s` : `${Math.floor(s / 60)}m ${s % 60}s`;
};

// ─── Job Details Modal ───────────────────────────────────────────────────────

const JobDetailsModal = ({ job, onClose }) => {
  const createdCount  = job?.created_count ?? 0;
  const updatedCount  = job?.updated_count ?? 0;
  const skippedCount  = job?.skipped_count ?? 0;
  const errorCount    = job?.error_count   ?? 0;
  const totalRows     = job?.total_rows    ?? 0;
  const processedRows = job?.processed_rows ?? 0;
  const errors = Array.isArray(job?.error_details) ? job.error_details : [];
  const progress = job?.progress_pct ?? (totalRows > 0 ? Math.round((processedRows / totalRows) * 100) : 0);

  const STATS = [
    { label: "Total Rows", value: totalRows,     border: "border-[#262626]" },
    { label: "Processed",  value: processedRows, border: "border-blue-500/20" },
    { label: "Created",    value: createdCount,  border: "border-[#00CE51]/20" },
    { label: "Updated",    value: updatedCount,  border: "border-blue-500/20" },
    { label: "Skipped",    value: skippedCount,  border: "border-yellow-500/20" },
    { label: "Errors",     value: errorCount,    border: "border-red-500/20" },
  ];

  const TIMELINE = [
    { dot: "bg-[#00CE51]", label: "Started",   value: job?.started_at },
    { dot: "bg-blue-400",  label: "Completed", value: job?.completed_at },
  ].filter((t) => t.value);

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 p-4"
      onClick={onClose}
    >
      <div
        className="bg-[#1A1A1A] border border-[#262626] rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal header */}
        <div className="sticky top-0 bg-[#1A1A1A] flex items-center justify-between p-5 border-b border-[#262626]">
          <div>
            <p className="text-sm font-bold text-white">Upload Job Details</p>
            <p className="text-[11px] font-mono text-gray-500 mt-0.5 truncate max-w-[300px]">
              {job?.job_id ?? job?.id ?? "—"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-white p-1.5 rounded-lg hover:bg-white/5 transition-colors cursor-pointer flex-shrink-0"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5 space-y-6">
          {/* Status + Type */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] text-gray-500 font-medium mb-1">Upload Type</p>
              <p className="text-sm text-white font-semibold">
                {TAB_LABELS[job?.upload_type] ?? job?.upload_type ?? "—"}
              </p>
              {job?.filename && (
                <p className="text-[11px] text-gray-500 font-mono mt-1">{job.filename}</p>
              )}
            </div>
            <UploadStatusBadge status={job?.status} />
          </div>

          {/* Progress bar */}
          {progress > 0 && (
            <div>
              <div className="flex justify-between text-[11px] text-gray-500 mb-1.5">
                <span>Progress</span>
                <span className="font-bold text-white">{progress}%</span>
              </div>
              <div className="h-1.5 bg-[#262626] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#00CE51]"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Stats grid */}
          <div>
            <p className="text-[11px] text-gray-500 font-medium mb-3">Processing Results</p>
            <div className="grid grid-cols-2 gap-2.5">
              {STATS.map(({ label, value, border }) => (
                <div key={label} className={`bg-[#0B0B0B] border ${border} rounded-lg p-3`}>
                  <div className="text-base font-bold text-white tabular-nums">
                    {(value ?? 0).toLocaleString()}
                  </div>
                  <div className="text-[11px] text-gray-500 mt-0.5">{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline */}
          {(TIMELINE.length > 0 || job?.execution_seconds != null) && (
            <div>
              <p className="text-[11px] text-gray-500 font-medium mb-3">Timeline</p>
              <div className="space-y-2.5">
                {TIMELINE.map(({ dot, label, value }) => (
                  <div key={label} className="flex items-center gap-3 text-xs">
                    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dot}`} />
                    <span className="text-gray-500">{label}</span>
                    <span className="text-gray-300 ml-auto">{formatDate(value)}</span>
                  </div>
                ))}
                {job?.execution_seconds != null && (
                  <div className="flex items-center gap-3 text-xs">
                    <Clock size={10} className="text-gray-600 flex-shrink-0" />
                    <span className="text-gray-500">Duration</span>
                    <span className="text-gray-300 ml-auto">
                      {formatDuration(job.execution_seconds)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Errors */}
          {errors.length > 0 && (
            <div className="bg-red-500/5 border border-red-500/15 rounded-lg p-4">
              <p className="text-xs font-bold text-red-400 mb-3">
                Errors ({errors.length})
              </p>
              <div className="space-y-2">
                {errors.slice(0, 12).map((err, i) => (
                  <div key={i} className="flex gap-3 text-xs">
                    <span className="font-mono text-red-400 flex-shrink-0 min-w-[52px]">
                      Row {err.row ?? i + 1}
                    </span>
                    <span className="text-gray-400">
                      {err.error ?? err.message ?? JSON.stringify(err)}
                    </span>
                  </div>
                ))}
                {errors.length > 12 && (
                  <p className="text-[11px] text-gray-600 pt-1">
                    + {errors.length - 12} more
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Skeleton row ────────────────────────────────────────────────────────────

const SkeletonRow = () => (
  <tr>
    {Array.from({ length: 8 }).map((_, i) => (
      <td key={i} className="p-4">
        <div className="h-3.5 bg-[#262626]/60 rounded animate-pulse" style={{ width: `${60 + (i % 3) * 20}%` }} />
      </td>
    ))}
    <td className="p-4"><div className="h-3.5 w-10 bg-[#262626]/60 rounded animate-pulse" /></td>
  </tr>
);

// ─── Main table ──────────────────────────────────────────────────────────────

const ITEMS_PER_PAGE = 10;

const UploadHistoryTable = () => {
  const { data: history = [], isLoading, isFetching, refetch } = useUploadHistory();
  const [selectedJob, setSelectedJob] = useState(null);
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(history.length / ITEMS_PER_PAGE);
  const paginated = history.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <div className="bg-[#1A1A1A] border border-[#262626] rounded-xl overflow-hidden">
      {/* Section header */}
      <div className="flex items-center justify-between p-5 border-b border-[#262626]">
        <div className="flex items-center gap-2.5">
          <History size={16} className="text-gray-500" />
          <div>
            <h2 className="text-sm font-bold text-white">Upload History</h2>
            {!isLoading && (
              <p className="text-[11px] text-gray-500 mt-0.5">
                {history.length} record{history.length !== 1 ? "s" : ""}
              </p>
            )}
          </div>
        </div>
        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-white px-3 py-1.5 rounded-lg border border-[#262626] hover:border-[#00CE51]/30 transition-all cursor-pointer disabled:opacity-40"
        >
          <RefreshCw size={13} className={isFetching ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {!isLoading && history.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-16 text-center px-6">
            <div className="w-12 h-12 rounded-full bg-[#262626] flex items-center justify-center mb-4">
              <Clock size={20} className="text-gray-600" />
            </div>
            <p className="text-sm font-medium text-gray-500">No uploads yet</p>
            <p className="text-xs text-gray-600 mt-1">
              Your upload history will appear here after your first import
            </p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#262626] text-gray-500 text-[10px] uppercase tracking-wider font-bold">
                <th className="text-left p-4">Type</th>
                <th className="text-left p-4">File</th>
                <th className="text-left p-4">Status</th>
                <th className="text-right p-4">Rows</th>
                <th className="text-right p-4 text-[#00CE51]/70">Created</th>
                <th className="text-right p-4 text-blue-400/70">Updated</th>
                <th className="text-right p-4 text-red-400/70">Errors</th>
                <th className="text-left p-4">Started</th>
                <th className="p-4 w-[70px]" />
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E1E1E]">
              {isLoading
                ? Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)
                : paginated.map((job) => {
                    const id = job?.job_id ?? job?.id ?? Math.random();
                    return (
                      <tr
                        key={id}
                        className="hover:bg-white/[0.02] transition-colors group"
                      >
                        <td className="p-4 text-xs font-medium text-gray-300 whitespace-nowrap">
                          {TAB_LABELS[job.upload_type] ?? job.upload_type ?? "—"}
                        </td>
                        <td className="p-4 max-w-[140px]">
                          <span
                            className="text-[11px] font-mono text-gray-500 truncate block"
                            title={job.filename}
                          >
                            {job.filename ?? "—"}
                          </span>
                        </td>
                        <td className="p-4">
                          <UploadStatusBadge status={job.status} />
                        </td>
                        <td className="p-4 text-right text-xs tabular-nums text-gray-400">
                          {(job.total_rows ?? 0).toLocaleString()}
                        </td>
                        <td className="p-4 text-right text-xs tabular-nums text-[#00CE51]">
                          {(job.created_count ?? 0).toLocaleString()}
                        </td>
                        <td className="p-4 text-right text-xs tabular-nums text-blue-400">
                          {(job.updated_count ?? 0).toLocaleString()}
                        </td>
                        <td className="p-4 text-right text-xs tabular-nums text-red-400">
                          {(job.error_count ?? 0).toLocaleString()}
                        </td>
                        <td className="p-4 text-[11px] text-gray-500 whitespace-nowrap">
                          {formatDate(job.started_at)}
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() => setSelectedJob(job)}
                            className="opacity-0 group-hover:opacity-100 flex items-center gap-1 text-[11px] text-gray-500 hover:text-white px-2 py-1 rounded border border-[#262626] hover:border-[#00CE51]/30 transition-all cursor-pointer whitespace-nowrap"
                          >
                            <Eye size={11} />
                            View
                          </button>
                        </td>
                      </tr>
                    );
                  })}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between p-4 border-t border-[#262626]">
          <p className="text-xs text-gray-500">
            Page {page} of {totalPages} &middot; {history.length} total
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1.5 rounded border border-[#262626] text-gray-500 hover:text-white hover:border-[#00CE51]/30 disabled:opacity-25 disabled:cursor-not-allowed cursor-pointer transition-all"
            >
              <ChevronLeft size={14} />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-1.5 rounded border border-[#262626] text-gray-500 hover:text-white hover:border-[#00CE51]/30 disabled:opacity-25 disabled:cursor-not-allowed cursor-pointer transition-all"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Details modal */}
      {selectedJob && (
        <JobDetailsModal job={selectedJob} onClose={() => setSelectedJob(null)} />
      )}
    </div>
  );
};

export default UploadHistoryTable;
