import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  RefreshCcw,
  Plus,
  Edit3,
  SkipForward,
} from "lucide-react";
import UploadStatusBadge from "./UploadStatusBadge";

const TAB_LABELS = {
  category: "Best Category",
  subcategory: "Best Subcategory",
  brand: "Best Brand",
  "new-arrival": "New Arrival Products",
};

const formatDuration = (seconds) => {
  if (seconds == null) return null;
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s > 0 ? ` ${s}s` : ""}`;
};

const BigStatCard = ({ icon, label, value, textColor, bgColor, borderColor }) => (
  <div className={`flex flex-col items-center justify-center p-5 rounded-xl border ${bgColor} ${borderColor}`}>
    <div className={`mb-2 ${textColor}`}>{icon}</div>
    <div className="text-2xl font-bold text-white tabular-nums">
      {(value ?? 0).toLocaleString()}
    </div>
    <div className="text-xs text-gray-500 mt-1 font-medium">{label}</div>
  </div>
);

const UploadResultCard = ({ job, jobMeta, onUploadAnother }) => {
  const status = job?.status;
  const isSuccess = status === "completed";
  const isPartial = status === "partial_success";
  const isFailed = status === "failed";

  const typeLabel = TAB_LABELS[job?.upload_type ?? jobMeta?.upload_type] ?? "Upload";
  const totalRows = job?.total_rows ?? 0;
  const duration = formatDuration(job?.execution_seconds);
  const completedAt = job?.completed_at;
  const createdCount = job?.created_count ?? 0;
  const updatedCount = job?.updated_count ?? 0;
  const skippedCount = job?.skipped_count ?? 0;
  const failedCount  = job?.error_count   ?? 0;
  const errors = Array.isArray(job?.error_details) ? job.error_details : [];

  const headerIcon = isSuccess
    ? <CheckCircle2 size={22} />
    : isPartial
    ? <AlertTriangle size={22} />
    : <XCircle size={22} />;

  const headerColor = isSuccess
    ? "bg-[#00CE51]/10 text-[#00CE51]"
    : isPartial
    ? "bg-orange-500/10 text-orange-400"
    : "bg-red-500/10 text-red-400";

  const headline = isSuccess
    ? `${typeLabel} Sync Complete`
    : isPartial
    ? `${typeLabel} — Partial Success`
    : `${typeLabel} — Upload Failed`;

  return (
    <div className="bg-[#0B0B0B] border border-[#262626] rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 p-5 border-b border-[#262626]">
        <div className="flex items-center gap-3 min-w-0">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${headerColor}`}>
            {headerIcon}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-white">{headline}</p>
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
        {/* Big stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <BigStatCard
            icon={<Plus size={18} />}
            label="Created"
            value={createdCount}
            textColor="text-[#00CE51]"
            bgColor="bg-[#00CE51]/5"
            borderColor="border-[#00CE51]/20"
          />
          <BigStatCard
            icon={<Edit3 size={18} />}
            label="Updated"
            value={updatedCount}
            textColor="text-blue-400"
            bgColor="bg-blue-500/5"
            borderColor="border-blue-500/20"
          />
          <BigStatCard
            icon={<SkipForward size={18} />}
            label="Skipped"
            value={skippedCount}
            textColor="text-yellow-400"
            bgColor="bg-yellow-500/5"
            borderColor="border-yellow-500/20"
          />
          <BigStatCard
            icon={<XCircle size={18} />}
            label="Errors"
            value={failedCount}
            textColor="text-red-400"
            bgColor="bg-red-500/5"
            borderColor="border-red-500/20"
          />
        </div>

        {/* Meta row */}
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-gray-500 border-t border-[#262626] pt-4">
          {totalRows > 0 && (
            <span>
              Total Rows:{" "}
              <span className="text-gray-300 font-semibold">
                {totalRows.toLocaleString()}
              </span>
            </span>
          )}
          {duration && (
            <span className="flex items-center gap-1.5">
              <Clock size={11} />
              Duration:{" "}
              <span className="text-gray-300 font-semibold">{duration}</span>
            </span>
          )}
          {completedAt && (
            <span>
              Completed:{" "}
              <span className="text-gray-300 font-semibold">
                {new Date(completedAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </span>
          )}
        </div>

        {/* Error preview panel */}
        {(errors.length > 0 || failedCount > 0) && (
          <div className="bg-red-500/5 border border-red-500/15 rounded-lg p-4">
            <p className="text-xs font-bold text-red-400 mb-3">
              Failed Rows Preview ({failedCount.toLocaleString()})
            </p>
            <div className="space-y-2">
              {errors.slice(0, 5).map((err, i) => (
                <div
                  key={i}
                  className="flex gap-3 text-xs py-1.5 border-b border-white/5 last:border-0"
                >
                  <span className="font-mono text-red-400 flex-shrink-0 min-w-[52px]">
                    Row {err.row ?? i + 1}
                  </span>
                  <span className="text-gray-400">
                    {err.error ?? err.message ?? JSON.stringify(err)}
                  </span>
                </div>
              ))}
            </div>
            {failedCount > 5 && (
              <p className="text-[11px] text-gray-600 mt-2 pt-2 border-t border-white/5">
                + {(failedCount - 5).toLocaleString()} more failed rows — check Upload History for full details
              </p>
            )}
          </div>
        )}

        {/* CTA */}
        <button
          onClick={onUploadAnother}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-[#262626] hover:border-[#00CE51]/40 bg-[#1A1A1A] hover:bg-[#1E1E1E] text-gray-300 hover:text-white text-sm font-semibold transition-all cursor-pointer"
        >
          <RefreshCcw size={14} />
          Upload Another File
        </button>
      </div>
    </div>
  );
};

export default UploadResultCard;
