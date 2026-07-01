import { Clock, Hash, Loader2 } from "lucide-react";
import UploadStatusBadge from "./UploadStatusBadge";

const TAB_LABELS = {
  category: "Best Category",
  subcategory: "Best Subcategory",
  brand: "Best Brand",
  "new-arrival": "New Arrival Products",
};

const StatBox = ({ label, value, borderColor }) => (
  <div className={`bg-[#141414] border rounded-lg p-3.5 ${borderColor}`}>
    <div className="text-xl font-bold text-white tabular-nums">
      {(value ?? 0).toLocaleString()}
    </div>
    <div className="text-[11px] text-gray-500 mt-0.5 font-medium">{label}</div>
  </div>
);

const UploadProgressCard = ({ job, jobMeta }) => {
  const progress = Math.min(100, Math.max(0, job?.progress_pct ?? 0));
  const totalRows = job?.total_rows ?? 0;
  const processedRows = job?.processed_rows ?? 0;
  const typeLabel = TAB_LABELS[job?.upload_type ?? jobMeta?.upload_type] ?? "Upload";
  const jobId = job?.job_id ?? jobMeta?.job_id ?? "";
  const status = job?.status ?? "queued";

  return (
    <div className="bg-[#0B0B0B] border border-[#262626] rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-[#262626]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
            <Loader2 size={17} className="text-blue-400 animate-spin" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-white">{typeLabel} — Processing</p>
            {jobMeta?.file_name && (
              <p className="text-[11px] text-gray-500 mt-0.5 font-mono truncate">
                {jobMeta.file_name}
              </p>
            )}
          </div>
        </div>
        <UploadStatusBadge status={status} />
      </div>

      <div className="p-5 space-y-5">
        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">
              {totalRows > 0
                ? `${processedRows.toLocaleString()} / ${totalRows.toLocaleString()} rows`
                : "Initializing…"}
            </span>
            <span className="text-xs font-bold text-white tabular-nums">{progress}%</span>
          </div>
          <div className="h-2 bg-[#1A1A1A] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-600 to-blue-400 transition-all duration-700 ease-out"
              style={{ width: `${progress || (status === "queued" ? 0 : 2)}%` }}
            />
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatBox label="Created"  value={job?.created_count}  borderColor="border-[#00CE51]/20" />
          <StatBox label="Updated"  value={job?.updated_count}  borderColor="border-blue-500/20" />
          <StatBox label="Skipped"  value={job?.skipped_count}  borderColor="border-yellow-500/20" />
          <StatBox label="Errors"   value={job?.error_count}    borderColor="border-red-500/20" />
        </div>

        {/* Job meta row */}
        <div className="flex flex-wrap gap-4 text-[11px] text-gray-600 border-t border-[#262626] pt-4">
          {jobId && (
            <span className="flex items-center gap-1.5">
              <Hash size={11} />
              <span className="font-mono">{jobId.length > 8 ? `${jobId.slice(0, 8)}…` : jobId}</span>
            </span>
          )}
          {jobMeta?.started_at && (
            <span className="flex items-center gap-1.5">
              <Clock size={11} />
              Started{" "}
              {new Date(jobMeta.started_at).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          )}
        </div>

        <p className="text-[11px] text-gray-600">
          Large uploads may take several minutes. You can safely navigate away — progress
          will be restored automatically when you return.
        </p>
      </div>
    </div>
  );
};

export default UploadProgressCard;
