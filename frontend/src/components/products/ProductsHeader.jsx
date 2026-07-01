import React, { useState, useMemo } from "react";
import { 
  Search, 
  Filter, 
  Upload, 
  X, 
  RotateCcw, 
  ChevronDown, 
  ChevronUp, 
  Loader2,
  DollarSign,
  Star,
  Layers,
  Tag,
  SlidersHorizontal
} from "lucide-react";
import { Link } from "react-router";
import ExportProductsButton from "./ExportProductsButton";
import SyncPricesButton from "./SyncPricesButton";

const ProductsHeader = ({
  search,
  setSearch,
  categoryId,
  setCategoryId,
  subcategoryId,
  setSubcategoryId,
  brandId,
  setBrandId,
  inStock,
  setInStock,
  isBestSelling,
  setIsBestSelling,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  sortBy,
  setSortBy,
  onSearchTrigger,
  onResetFilters,
  categories = [],
  subcategories = [],
  brands = [],
  filtersLoading,
  isFetching,
  exportFilters = {},
  onSyncComplete,
}) => {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  // Dynamic filter for subcategories based on the chosen category
  const filteredSubcategories = useMemo(() => {
    if (!categoryId) return subcategories;
    return subcategories.filter(sub => {
      const subCatId = sub.category_id || sub.category;
      return Number(subCatId) === Number(categoryId);
    });
  }, [categoryId, subcategories]);

  // Calculate count of active filters (excluding default sortBy and search)
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (categoryId) count++;
    if (subcategoryId) count++;
    if (brandId) count++;
    if (inStock !== "") count++;
    if (isBestSelling !== "") count++;
    if (minPrice) count++;
    if (maxPrice) count++;
    return count;
  }, [categoryId, subcategoryId, brandId, inStock, isBestSelling, minPrice, maxPrice]);

  // Active filter helper display names for individual dismiss pills
  const activePills = useMemo(() => {
    const pills = [];
    if (categoryId) {
      const cat = categories.find(c => Number(c.id) === Number(categoryId));
      pills.push({ id: "category", label: `Category: ${cat?.name || "Selected"}`, reset: () => setCategoryId("") });
    }
    if (subcategoryId) {
      const sub = subcategories.find(s => Number(s.id) === Number(subcategoryId));
      pills.push({ id: "subcategory", label: `Subcat: ${sub?.name || "Selected"}`, reset: () => setSubcategoryId("") });
    }
    if (brandId) {
      const brand = brands.find(b => Number(b.id) === Number(brandId));
      pills.push({ id: "brand", label: `Brand: ${brand?.name || "Selected"}`, reset: () => setBrandId("") });
    }
    if (inStock !== "") {
      pills.push({ 
        id: "inStock", 
        label: inStock === "true" ? "Status: In Stock" : "Status: Out of Stock", 
        reset: () => setInStock("") 
      });
    }
    if (isBestSelling !== "") {
      pills.push({ id: "isBestSelling", label: "Best Selling", reset: () => setIsBestSelling("") });
    }
    if (minPrice) {
      pills.push({ id: "minPrice", label: `Min: $${minPrice}`, reset: () => setMinPrice("") });
    }
    if (maxPrice) {
      pills.push({ id: "maxPrice", label: `Max: $${maxPrice}`, reset: () => setMaxPrice("") });
    }
    return pills;
  }, [categoryId, subcategoryId, brandId, inStock, isBestSelling, minPrice, maxPrice, categories, subcategories, brands]);

  return (
    <div className="space-y-4 mb-6">
      
      {/* Upper Header Row */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            Product Inventory
            {isFetching && (
              <span className="flex items-center text-xs font-normal text-[#00CE51] bg-[#00CE51]/10 px-2 py-0.5 rounded-full border border-[#00CE51]/20">
                <Loader2 className="animate-spin mr-1" size={12} />
                Syncing...
              </span>
            )}
          </h1>
          <p className="text-gray-400 text-sm mt-1">Manage and track your product catalog</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Main Search Input */}
          <div className="relative flex-grow md:flex-grow-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input
              type="text"
              placeholder="Search products by name/code..."
              className="bg-[#0B0B0B] border border-[#262626] text-white text-sm rounded-lg focus:ring-[#00CE51] focus:border-[#00CE51] block w-full md:w-72 pl-10 pr-8 p-2.5 outline-none transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onSearchTrigger()}
            />
            {search && (
              <button 
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Advanced Filters Trigger Button */}
          <button
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all border outline-none cursor-pointer ${
              isFiltersOpen || activeFiltersCount > 0
                ? "bg-[#00CE51]/10 border-[#00CE51]/30 text-[#00CE51]"
                : "bg-[#0B0B0B] border-[#262626] text-gray-400 hover:text-white hover:border-[#444]"
            }`}
          >
            <SlidersHorizontal size={16} />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <span className="flex items-center justify-center w-5 h-5 text-[11px] font-bold bg-[#00CE51] text-[#0B0B0B] rounded-full">
                {activeFiltersCount}
              </span>
            )}
            {isFiltersOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          {/* Sync Prices Button */}
          <SyncPricesButton onSyncComplete={onSyncComplete} />

          {/* Export Button */}
          <ExportProductsButton filters={exportFilters} />

          {/* Upload Button */}
          <Link
            to="/product-upload"
            className="flex items-center gap-2 bg-[#00CE51] hover:bg-[#00b045] text-[#0B0B0B] px-4 py-2.5 rounded-lg text-sm font-bold shadow-[0_4px_12px_rgba(0,206,81,0.2)] hover:shadow-[0_4px_20px_rgba(0,206,81,0.3)] transition-all cursor-pointer"
          >
            <Upload size={18} />
            <span>Upload Product</span>
          </Link>
        </div>
      </div>

      {/* Advanced Filters Expandable Grid */}
      <div 
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isFiltersOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0 pointer-events-none"
        }`}
      >
        <div className="bg-[#0B0B0B] border border-[#262626] rounded-xl p-5 mt-2 space-y-4 shadow-xl">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            
            {/* Category Select */}
            <div className="space-y-1.5">
              <label className="text-[11px] text-gray-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Layers size={12} className="text-[#00CE51]" /> Category
              </label>
              <div className="relative">
                <select
                  disabled={filtersLoading}
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="bg-[#141414] border border-[#262626] text-white text-xs rounded-lg focus:ring-[#00CE51] focus:border-[#00CE51] block w-full p-2.5 outline-none appearance-none cursor-pointer disabled:opacity-50"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                  {filtersLoading ? <Loader2 size={12} className="animate-spin" /> : <ChevronDown size={14} />}
                </div>
              </div>
            </div>

            {/* Subcategory Select (Filters dynamically) */}
            <div className="space-y-1.5">
              <label className="text-[11px] text-gray-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Tag size={12} className="text-[#00CE51]" /> Subcategory
              </label>
              <div className="relative">
                <select
                  disabled={filtersLoading || !filteredSubcategories.length}
                  value={subcategoryId}
                  onChange={(e) => setSubcategoryId(e.target.value)}
                  className="bg-[#141414] border border-[#262626] text-white text-xs rounded-lg focus:ring-[#00CE51] focus:border-[#00CE51] block w-full p-2.5 outline-none appearance-none cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <option value="">
                    {categoryId 
                      ? filteredSubcategories.length ? "All Subcategories" : "No Subcategories Found"
                      : "Choose Category First"
                    }
                  </option>
                  {filteredSubcategories.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.name}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                  <ChevronDown size={14} />
                </div>
              </div>
            </div>

            {/* Brand Select */}
            <div className="space-y-1.5">
              <label className="text-[11px] text-gray-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Star size={12} className="text-[#00CE51]" /> Brand
              </label>
              <div className="relative">
                <select
                  disabled={filtersLoading}
                  value={brandId}
                  onChange={(e) => setBrandId(e.target.value)}
                  className="bg-[#141414] border border-[#262626] text-white text-xs rounded-lg focus:ring-[#00CE51] focus:border-[#00CE51] block w-full p-2.5 outline-none appearance-none cursor-pointer disabled:opacity-50"
                >
                  <option value="">All Brands</option>
                  {brands.map((brand) => (
                    <option key={brand.id} value={brand.id}>
                      {brand.name}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                  <ChevronDown size={14} />
                </div>
              </div>
            </div>

            {/* Price Range Filter */}
            <div className="space-y-1.5">
              <label className="text-[11px] text-gray-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <DollarSign size={12} className="text-[#00CE51]" /> Price Range
              </label>
              <div className="flex items-center gap-2">
                <div className="relative flex-grow">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-600 text-xs">$</span>
                  <input
                    type="number"
                    placeholder="Min"
                    min="0"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="bg-[#141414] border border-[#262626] text-white text-xs rounded-lg focus:ring-[#00CE51] focus:border-[#00CE51] block w-full pl-6 pr-2 py-2 outline-none"
                  />
                </div>
                <span className="text-gray-600 text-xs">—</span>
                <div className="relative flex-grow">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-600 text-xs">$</span>
                  <input
                    type="number"
                    placeholder="Max"
                    min="0"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="bg-[#141414] border border-[#262626] text-white text-xs rounded-lg focus:ring-[#00CE51] focus:border-[#00CE51] block w-full pl-6 pr-2 py-2 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Stock Level Selector */}
            <div className="space-y-1.5">
              <label className="text-[11px] text-gray-500 font-bold uppercase tracking-wider">
                Availability
              </label>
              <div className="grid grid-cols-3 bg-[#141414] border border-[#262626] rounded-lg p-0.5">
                <button
                  onClick={() => setInStock("")}
                  className={`text-[10px] font-bold py-1.5 rounded transition-all cursor-pointer ${
                    inStock === "" 
                      ? "bg-[#222] text-[#00CE51]" 
                      : "text-gray-500 hover:text-gray-300"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setInStock("true")}
                  className={`text-[10px] font-bold py-1.5 rounded transition-all cursor-pointer ${
                    inStock === "true" 
                      ? "bg-[#00CE51]/10 text-[#00CE51]" 
                      : "text-gray-500 hover:text-gray-300"
                  }`}
                >
                  In Stock
                </button>
                <button
                  onClick={() => setInStock("false")}
                  className={`text-[10px] font-bold py-1.5 rounded transition-all cursor-pointer ${
                    inStock === "false" 
                      ? "bg-red-500/10 text-red-400" 
                      : "text-gray-500 hover:text-gray-300"
                  }`}
                >
                  Out
                </button>
              </div>
            </div>

            {/* Best Sellers Filter Toggle */}
            <div className="space-y-1.5">
              <label className="text-[11px] text-gray-500 font-bold uppercase tracking-wider">
                Special Status
              </label>
              <button
                onClick={() => setIsBestSelling(isBestSelling === "1" ? "" : "1")}
                className={`w-full flex items-center justify-center gap-1.5 text-xs font-semibold py-2 px-3 rounded-lg border transition-all cursor-pointer ${
                  isBestSelling === "1"
                    ? "bg-[#00CE51]/10 border-[#00CE51]/30 text-[#00CE51]"
                    : "bg-[#141414] border-[#262626] text-gray-400 hover:text-white"
                }`}
              >
                <Star size={12} className={isBestSelling === "1" ? "fill-[#00CE51]" : ""} />
                <span>Best Selling Only</span>
              </button>
            </div>

            {/* Sorting Config */}
            <div className="space-y-1.5">
              <label className="text-[11px] text-gray-500 font-bold uppercase tracking-wider">
                Sort Inventory By
              </label>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-[#141414] border border-[#262626] text-white text-xs rounded-lg focus:ring-[#00CE51] focus:border-[#00CE51] block w-full p-2.5 outline-none appearance-none cursor-pointer"
                >
                  <option value="created_desc">Newest Added</option>
                  <option value="created_asc">Oldest Added</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="item_name_asc">Name: A to Z</option>
                  <option value="item_name_desc">Name: Z to A</option>
                </select>
                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                  <ChevronDown size={14} />
                </div>
              </div>
            </div>

            {/* Reset Filters Option */}
            <div className="flex items-end">
              <button
                onClick={onResetFilters}
                className="w-full flex items-center justify-center gap-2 text-xs font-bold py-2.5 px-4 rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:text-white transition-all cursor-pointer"
              >
                <RotateCcw size={14} />
                <span>Reset All Filters</span>
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Active Filter Dismiss Pills Row */}
      {activePills.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-2">
          <span className="text-[11px] text-gray-500 font-bold uppercase tracking-wider mr-1">Active:</span>
          {activePills.map((pill) => (
            <div
              key={pill.id}
              className="flex items-center gap-1.5 bg-[#1F1F1F] text-gray-300 border border-[#2A2A2A] text-xs px-2.5 py-1 rounded-full hover:border-[#00CE51]/40 transition-all"
            >
              <span>{pill.label}</span>
              <button
                onClick={pill.reset}
                className="text-gray-500 hover:text-red-400 transition-colors p-0.5 rounded-full hover:bg-white/5 cursor-pointer"
              >
                <X size={12} />
              </button>
            </div>
          ))}
          <button
            onClick={onResetFilters}
            className="text-[10px] text-[#00CE51] hover:underline font-bold transition-all ml-1 cursor-pointer"
          >
            Clear all
          </button>
        </div>
      )}

    </div>
  );
};

export default ProductsHeader;
