import React, { useState, useEffect, useRef } from "react";
import { X, Loader2 } from "lucide-react";

const CreateEntityModal = ({ isOpen, onClose, entityType, initialName, categoryId, categoryName, onCreateSuccess, axios }) => {
  const [name, setName] = useState("");
  const [nameAr, setNameAr] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const modalRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setName(initialName || "");
      setNameAr("");
      setError("");
      
      if (entityType === "subcategory") {
        setSelectedCategoryId(categoryId || "");
        
        const fetchCategories = async () => {
          try {
            const res = await axios.get("/api/v1/categories/", { params: { is_active: "true", limit: 100 } });
            if (res.data?.success) {
              setCategories(res.data.data?.categories || []);
            }
          } catch (err) {
            console.error("Failed to load categories in modal", err);
          }
        };
        fetchCategories();
      }

      // Focus trap
      setTimeout(() => {
        const input = modalRef.current?.querySelector("input");
        input?.focus();
      }, 100);
    }
  }, [isOpen, initialName, entityType, categoryId, axios]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Name is required");
      return;
    }

    if (entityType === "subcategory" && !selectedCategoryId) {
      setError("Parent Category is required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      let endpoint = "";
      let payload = { name: name.trim(), name_ar: nameAr.trim() || null };

      if (entityType === "brand") {
        endpoint = "/api/v1/brands/";
      } else if (entityType === "category") {
        endpoint = "/api/v1/categories/";
      } else if (entityType === "subcategory") {
        endpoint = "/api/v1/subcategories/";
        payload.category_id = Number(selectedCategoryId);
      }

      const res = await axios.post(endpoint, payload);
      
      if (res.data?.success) {
        onCreateSuccess(res.data.data);
        onClose();
      }
    } catch (err) {
      const status = err.response?.status;
      const data = err.response?.data;
      if (status === 409) {
        const existingItem = data?.data || data?.existing_item;
        if (existingItem) {
          setError("Already exists — selecting existing instead");
          setTimeout(() => {
            onCreateSuccess(existingItem);
            onClose();
          }, 1500);
        } else {
          setError(data?.message || "This entity already exists");
        }
      } else if (status === 422) {
        setError(data?.detail?.[0]?.msg || "Validation error from server");
      } else {
        setError("Creation failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 select-none">
      <div
        ref={modalRef}
        className="bg-[#1A1A1A] border border-[#262626] rounded-xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#262626]">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Create New {entityType}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Container */}
        <div className="p-5 space-y-4">
          {error && (
            <div className={`p-3 rounded-lg text-xs font-semibold ${
              error.includes("selecting existing") ? "bg-[#00CE51]/10 text-[#00CE51] border border-[#00CE51]/20" : "bg-red-500/10 text-red-500 border border-red-500/20"
            }`}>
              {error}
            </div>
          )}

          {entityType === "subcategory" && (
            <div className="space-y-1 text-left">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                Parent Category <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedCategoryId}
                onChange={(e) => setSelectedCategoryId(e.target.value)}
                disabled={loading}
                className="bg-[#0B0B0B] border border-[#262626] text-white text-sm rounded-lg focus:ring-1 focus:ring-[#00CE51] focus:border-[#00CE51] block w-full p-3 outline-none cursor-pointer"
              >
                <option value="">Select a Category...</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name} {cat.name_ar ? `(${cat.name_ar})` : ""}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="space-y-1 text-left">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
              English Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              disabled={loading}
              placeholder={`e.g. Creed`}
              className="bg-[#0B0B0B] border border-[#262626] text-white text-sm rounded-lg focus:ring-1 focus:ring-[#00CE51] focus:border-[#00CE51] block w-full p-3 outline-none"
            />
          </div>

          <div className="space-y-1 text-left">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
              Arabic Name (Optional)
            </label>
            <input
              type="text"
              value={nameAr}
              onChange={(e) => setNameAr(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              disabled={loading}
              placeholder="e.g. كريد"
              dir="rtl"
              className="bg-[#0B0B0B] border border-[#262626] text-white text-sm rounded-lg focus:ring-1 focus:ring-[#00CE51] focus:border-[#00CE51] block w-full p-3 outline-none font-sans"
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#262626]">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 border border-[#262626] rounded-lg text-sm text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="px-4 py-2 bg-[#00CE51] hover:opacity-90 rounded-lg text-sm text-[#0B0B0B] font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {loading && <Loader2 size={14} className="animate-spin" />}
              <span>Create {entityType}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateEntityModal;
