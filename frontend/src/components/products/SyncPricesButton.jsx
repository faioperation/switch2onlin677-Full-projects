import React, { useState } from "react";
import { RefreshCw, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import useAxiosSecure from "../../hooks/useAxios";

const SyncPricesButton = ({ onSyncComplete }) => {
  const axiosSecure = useAxiosSecure();
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const res = await axiosSecure.post("/api/v1/sap/sync/");
      if (res.data?.success) {
        toast.success("Prices synced from SAP successfully!");
        onSyncComplete?.();
      } else {
        toast.error(res.data?.message || "Sync failed. Please try again.");
      }
    } catch (err) {
      const message = err.response?.data?.error || err.response?.data?.message || "Sync failed. Please try again.";
      toast.error(message);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <button
      onClick={handleSync}
      disabled={isSyncing}
      title="Pull latest prices and stock from SAP"
      className="flex items-center gap-2 bg-[#141414] border border-[#262626] hover:border-[#00CE51]/40 hover:text-[#00CE51] text-gray-400 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
    >
      {isSyncing ? (
        <>
          <Loader2 size={16} className="animate-spin text-[#00CE51]" />
          <span>Syncing Prices...</span>
        </>
      ) : (
        <>
          <RefreshCw size={16} />
          <span>Sync Prices</span>
        </>
      )}
    </button>
  );
};

export default SyncPricesButton;
