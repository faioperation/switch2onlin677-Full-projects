import React, { useState, useEffect, useRef } from "react";
import { Controller, useWatch } from "react-hook-form";
import { ChevronDown, Plus, Check, Loader2 } from "lucide-react";
import CreateEntityModal from "../inventory/CreateEntityModal";

const ENTITY_DETAIL_URL = {
  brand: (id) => `/api/v1/brands/${id}/`,
  category: (id) => `/api/v1/categories/${id}/`,
  subcategory: (id) => `/api/v1/subcategories/${id}/`,
};

// The list-response wrapper key doesn't follow simple `${entityType}s`
// pluralization ("category" -> "categories", not "categorys"), so it must
// be mapped explicitly rather than string-concatenated.
const ENTITY_LIST_KEY = {
  brand: "brands",
  category: "categories",
  subcategory: "subcategories",
};

const ComboboxField = ({
  label,
  name,
  control,
  error,
  icon: Icon,
  entityType,
  categoryId = null,
  categoryName = "",
  axios,
  placeholder = "Select option...",
  required = false,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [showInactive, setShowInactive] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [selectedEntity, setSelectedEntity] = useState(null);

  const containerRef = useRef(null);
  const dropdownRef = useRef(null);

  // Current field value tracked independently of Controller's render-prop so
  // we can resolve its display label even when it isn't in the current
  // (server-paginated / search-filtered) options page.
  const watchedId = useWatch({ control, name });

  // Guards against out-of-order responses: every fetch gets a ticket number,
  // and only the response matching the *latest* ticket is allowed to update
  // state. Without this, a slow earlier request (e.g. a stale search) can
  // resolve after a newer one and silently clobber it with wrong/empty data.
  const requestIdRef = useRef(0);

  const fetchOptions = async (search = "") => {
    if (disabled) return;
    const requestId = ++requestIdRef.current;
    setLoading(true);
    try {
      let url = "";
      let params = {
        is_active: !showInactive ? "true" : undefined,
        limit: 100, // backend hard-caps limit at 100
        search: search.trim() || undefined, // server-side search — backend has thousands of rows
      };

      if (entityType === "brand") {
        url = "/api/v1/brands/";
      } else if (entityType === "category") {
        url = "/api/v1/categories/";
      } else if (entityType === "subcategory") {
        url = "/api/v1/subcategories/";
        if (categoryId) {
          params.category_id = categoryId;
        }
      }

      const res = await axios.get(url, { params });
      if (requestId !== requestIdRef.current) return; // a newer request superseded this one — ignore
      if (res.data?.success) {
        setOptions(res.data.data?.[ENTITY_LIST_KEY[entityType]] || []);
      }
    } catch (err) {
      if (requestId !== requestIdRef.current) return;
      console.error(`Failed to fetch ${entityType} options`, err);
    } finally {
      if (requestId === requestIdRef.current) setLoading(false);
    }
  };

  // Single source of truth for (re)loading the options list — fires on
  // mount, when the entity type / parent category / inactive toggle
  // changes, when the dropdown is (re)opened, and (debounced) as the user
  // types a search term. Consolidated into one effect so there is only ever
  // one "latest" fetch in flight per state change, instead of two effects
  // independently racing each other.
  useEffect(() => {
    const delay = isOpen && searchTerm ? 300 : 0;
    const timer = setTimeout(() => {
      fetchOptions(searchTerm);
    }, delay);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entityType, categoryId, showInactive, disabled, isOpen, searchTerm]);

  // Resolve the label for the currently selected id even if it isn't part
  // of the loaded/search-filtered options page (e.g. a brand outside the
  // first 100 alphabetically, or not matching the active search term).
  useEffect(() => {
    if (!watchedId) {
      setSelectedEntity(null);
      return;
    }
    const found = options.find((opt) => String(opt.id) === String(watchedId));
    if (found) {
      setSelectedEntity(found);
      return;
    }

    let cancelled = false;
    const fetchSelected = async () => {
      try {
        const detailUrl = ENTITY_DETAIL_URL[entityType]?.(watchedId);
        if (!detailUrl) return;
        const res = await axios.get(detailUrl);
        if (!cancelled && res.data?.success) {
          setSelectedEntity(res.data.data);
        }
      } catch (err) {
        console.error(`Failed to fetch selected ${entityType}`, err);
      }
    };
    fetchSelected();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedId, entityType]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const exactMatchExists = options.some(
    (opt) => opt.name?.toLowerCase() === searchTerm.trim().toLowerCase()
  );

  const handleKeyDown = (e, value, onChange) => {
    if (!isOpen) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter") {
        setIsOpen(true);
        e.preventDefault();
      }
      return;
    }

    if (e.key === "Escape") {
      setIsOpen(false);
      e.preventDefault();
    } else if (e.key === "ArrowDown") {
      setHighlightedIndex((prev) =>
        prev < options.length - 1 ? prev + 1 : prev
      );
      e.preventDefault();
    } else if (e.key === "ArrowUp") {
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : prev));
      e.preventDefault();
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlightedIndex >= 0 && highlightedIndex < options.length) {
        const selected = options[highlightedIndex];
        onChange(selected.id);
        setSearchTerm("");
        setIsOpen(false);
      } else if (searchTerm.trim() && !exactMatchExists) {
        setIsModalOpen(true);
      }
    }
  };

  return (
    <div className="space-y-1.5 w-full text-left relative" ref={containerRef}>
      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
        {Icon && <Icon size={14} className="text-[#00CE51]" />}
        <span>
          {label} {required && <span className="text-red-500">*</span>}
        </span>
      </label>

      <Controller
        name={name}
        control={control}
        render={({ field: { value, onChange } }) => {
          const displayValue = selectedEntity
            ? `${selectedEntity.name} ${selectedEntity.name_ar ? `(${selectedEntity.name_ar})` : ""}`
            : "";

          return (
            <>
              <div className="relative">
                <input
                  type="text"
                  readOnly={!isOpen}
                  disabled={disabled}
                  placeholder={
                    disabled && entityType === "subcategory" && !categoryId
                      ? "Select category first..."
                      : placeholder
                  }
                  value={isOpen ? searchTerm : displayValue}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setHighlightedIndex(-1);
                  }}
                  onFocus={() => {
                    if (!disabled) {
                      setIsOpen(true);
                      setSearchTerm("");
                    }
                  }}
                  onKeyDown={(e) => handleKeyDown(e, value, onChange)}
                  className={`bg-[#0B0B0B] border border-[#262626] text-white text-sm rounded-lg focus:ring-1 focus:ring-[#00CE51] focus:border-[#00CE51] block w-full p-3 pr-10 outline-none transition-all cursor-pointer ${
                    disabled ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                />
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => setIsOpen(!isOpen)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors cursor-pointer"
                >
                  <ChevronDown size={16} className={`transform transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </button>
              </div>

              {isOpen && !disabled && (
                <div
                  ref={dropdownRef}
                  className="absolute z-40 left-0 right-0 mt-1 bg-[#1A1A1A] border border-[#262626] rounded-lg shadow-xl max-h-60 overflow-y-auto flex flex-col"
                >
                  <div className="flex items-center justify-between p-2 border-b border-[#262626] bg-[#111] shrink-0">
                    <span className="text-[9px] font-extrabold text-gray-500 uppercase tracking-widest pl-1.5">
                      {options.length} OPTIONS{options.length >= 100 ? " (refine search)" : ""}
                    </span>
                    <label className="flex items-center gap-1.5 cursor-pointer text-[10px] text-gray-400 font-bold select-none pr-1">
                      <input
                        type="checkbox"
                        checked={showInactive}
                        onChange={(e) => setShowInactive(e.target.checked)}
                        className="checkbox checkbox-xs checkbox-success rounded"
                      />
                      <span>Show Inactive</span>
                    </label>
                  </div>

                  <div className="overflow-y-auto flex-grow">
                    {loading ? (
                      <div className="flex items-center justify-center p-8 gap-2 text-gray-400 text-xs font-semibold">
                        <Loader2 size={16} className="animate-spin text-[#00CE51]" />
                        <span>Loading...</span>
                      </div>
                    ) : options.length === 0 ? (
                      <div className="p-4 text-center text-gray-500 text-xs">
                        No matches found
                      </div>
                    ) : (
                      options.map((opt, index) => {
                        const isSelected = String(opt.id) === String(value);
                        const isHighlighted = index === highlightedIndex;
                        return (
                          <div
                            key={opt.id}
                            onClick={() => {
                              onChange(opt.id);
                              setSelectedEntity(opt);
                              setSearchTerm("");
                              setIsOpen(false);
                            }}
                            className={`flex items-center justify-between px-3 py-2.5 text-sm cursor-pointer border-b border-[#262626]/40 transition-colors ${
                              isSelected
                                ? "bg-[#00CE51]/10 text-[#00CE51]"
                                : isHighlighted
                                ? "bg-white/5 text-white"
                                : "text-gray-300 hover:bg-white/5 hover:text-white"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span>{opt.name}</span>
                              {opt.name_ar && (
                                <span className="text-xs text-gray-500 font-sans" dir="rtl">
                                  {opt.name_ar}
                                </span>
                              )}
                              {opt.is_active === 0 && (
                                <span className="text-[9px] font-bold text-red-500 border border-red-500/20 bg-red-500/5 px-1 rounded uppercase">
                                  Inactive
                                </span>
                              )}
                            </div>
                            {isSelected && <Check size={14} className="text-[#00CE51]" />}
                          </div>
                        );
                      })
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsModalOpen(true)}
                    className="sticky bottom-0 bg-[#00CE51] hover:bg-[#00b045] text-[#0B0B0B] text-xs font-extrabold py-3 px-4 flex items-center justify-center gap-1.5 cursor-pointer border-t border-[#00CE51]/20 select-none shadow-[0_-4px_12px_rgba(0,0,0,0.5)] animate-in slide-in-from-bottom duration-100 w-full"
                  >
                    <Plus size={14} />
                    <span>
                      {searchTerm.trim()
                        ? `Create "${searchTerm.trim()}"`
                        : `Create New ${entityType.charAt(0).toUpperCase() + entityType.slice(1)}`}
                    </span>
                  </button>
                </div>
              )}

              <CreateEntityModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                entityType={entityType}
                initialName={searchTerm.trim()}
                categoryId={categoryId}
                categoryName={categoryName}
                onCreateSuccess={(newEntity) => {
                  fetchOptions(searchTerm).then(() => {
                    onChange(newEntity.id);
                    setSelectedEntity(newEntity);
                    setSearchTerm("");
                    setIsOpen(false);
                  });
                }}
                axios={axios}
              />
            </>
          );
        }}
      />
      {error && (
        <span className="text-xs text-red-500 block pt-0.5">{error.message}</span>
      )}
    </div>
  );
};

export default ComboboxField;
