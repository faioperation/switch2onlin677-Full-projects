const BADGE_CONFIG = {
  queued: {
    label: "Queued",
    cls: "bg-yellow-500/10 text-yellow-400 border-yellow-500/25",
    pulse: true,
  },
  processing: {
    label: "Processing",
    cls: "bg-blue-500/10 text-blue-400 border-blue-500/25",
    pulse: true,
  },
  completed: {
    label: "Completed",
    cls: "bg-[#00CE51]/10 text-[#00CE51] border-[#00CE51]/25",
    pulse: false,
  },
  partial_success: {
    label: "Partial Success",
    cls: "bg-orange-500/10 text-orange-400 border-orange-500/25",
    pulse: false,
  },
  failed: {
    label: "Failed",
    cls: "bg-red-500/10 text-red-400 border-red-500/25",
    pulse: false,
  },
  cancelled: {
    label: "Cancelled",
    cls: "bg-gray-500/10 text-gray-400 border-gray-500/25",
    pulse: false,
  },
};

const UploadStatusBadge = ({ status }) => {
  const cfg = BADGE_CONFIG[status] ?? {
    label: status ?? "Unknown",
    cls: "bg-gray-500/10 text-gray-400 border-gray-500/25",
    pulse: false,
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[11px] font-semibold tracking-wide whitespace-nowrap ${cfg.cls}`}
    >
      {cfg.pulse && (
        <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse flex-shrink-0" />
      )}
      {cfg.label}
    </span>
  );
};

export default UploadStatusBadge;
