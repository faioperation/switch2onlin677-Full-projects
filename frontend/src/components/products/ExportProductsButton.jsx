import React, { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { exportProducts } from "../../api/products";
import useAxiosSecure from "../../hooks/useAxios";

const ExportProductsButton = ({ filters = {} }) => {
  const axiosSecure = useAxiosSecure();
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await exportProducts(axiosSecure, filters);
      toast.success("Products exported successfully!");
    } catch (err) {
      let message = "Export failed. Please try again.";

      // Blob error responses need to be read as text before parsing
      if (err.response?.data instanceof Blob) {
        try {
          const text = await err.response.data.text();
          const json = JSON.parse(text);
          message = json.message || json.detail || message;
        } catch {
          // ignore — use default message
        }
      } else if (err.response?.data?.message) {
        message = err.response.data.message;
      }

      toast.error(message);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={isExporting}
      className="flex items-center gap-2 bg-[#141414] border border-[#262626] hover:border-[#00CE51]/40 hover:text-[#00CE51] text-gray-400 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
    >
      {isExporting ? (
        <>
          <Loader2 size={16} className="animate-spin text-[#00CE51]" />
          <span>Exporting...</span>
        </>
      ) : (
        <>
          <Download size={16} />
          <span>Export</span>
        </>
      )}
    </button>
  );
};

export default ExportProductsButton;
