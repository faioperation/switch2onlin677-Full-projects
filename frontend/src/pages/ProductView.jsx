import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../hooks/useAxios";
import Swal from "sweetalert2";
import {
  ChevronLeft,
  Edit2,
  Trash2,
  Barcode,
  Layers,
  Tag,
  AlertTriangle,
  CheckCircle,
  Package,
  DollarSign,
  ShieldAlert,
  Loader2,
  Sparkles,
  Database,
  FileText,
  Award,
  Globe,
  TrendingUp,
  Users,
  Activity,
  Percent
} from "lucide-react";

// Local ProductImage with premium letter-based fail-safe
const ProductImageLarge = ({ src, name }) => {
  const [isError, setIsError] = useState(!src);

  const firstLetter = name && typeof name === "string" 
    ? name.trim().charAt(0).toUpperCase() 
    : "?";

  // Harmonic dark-mode color palettes based on first letter ASCII code
  const getBackgroundColor = (char) => {
    const charCode = char.charCodeAt(0);
    const colors = [
      "bg-[#00CE51]/10 text-[#00CE51] border-[#00CE51]/20", // Accent Green
      "bg-blue-500/10 text-blue-400 border-blue-500/20",
      "bg-purple-500/10 text-purple-400 border-purple-500/20",
      "bg-pink-500/10 text-pink-400 border-pink-500/20",
      "bg-amber-500/10 text-amber-400 border-amber-500/20",
      "bg-red-500/10 text-red-400 border-red-500/20",
      "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
      "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
    ];
    return colors[charCode % colors.length];
  };

  const colorClass = getBackgroundColor(firstLetter);

  if (isError) {
    return (
      <div className={`w-full h-72 sm:h-96 rounded-xl flex items-center justify-center font-black text-7xl sm:text-8xl border select-none ${colorClass}`}>
        {firstLetter}
      </div>
    );
  }

  return (
    <img 
      src={src} 
      alt={name} 
      onError={() => setIsError(true)}
      className="w-full h-72 sm:h-96 object-cover rounded-xl border border-[#262626]"
    />
  );
};

// Reusable truthy parser (mirrors the isBestSelling logic)
const parseBoolField = (val) => {
  if (val === null || val === undefined) return false;
  return (
    val === true || val === 1 || val === "1" ||
    String(val).toLowerCase() === "true" ||
    String(val).toLowerCase() === "yes"
  );
};

const PRICE_TIER_CONFIG = {
  budget:  { label: "Budget",    cls: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  mid:     { label: "Mid-Range", cls: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20" },
  premium: { label: "Premium",   cls: "bg-purple-500/10 text-purple-400 border-purple-500/20" },
  luxury:  { label: "Luxury",    cls: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
};

const PRODUCT_STATUS_CONFIG = {
  active:   { label: "Active",   cls: "bg-[#00CE51]/10 text-[#00CE51] border-[#00CE51]/20" },
  inactive: { label: "Inactive", cls: "bg-red-500/10 text-red-400 border-red-500/20" },
  draft:    { label: "Draft",    cls: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
};

const ProductView = () => {
  const { barcode } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  // Fetch product detail using barcode
  const { data: productRes, isLoading, isError, refetch } = useQuery({
    queryKey: ["product", barcode],
    queryFn: async () => {
      const res = await axiosSecure.get(`/api/v1/products/${barcode}/`);
      return res.data;
    }
  });

  // Fetch conversion rate using cache time for performance
  const { data: rateRes } = useQuery({
    queryKey: ["iqdRate"],
    queryFn: async () => {
      const res = await axiosSecure.get("/api/v1/leads/rate/");
      return res.data;
    },
    staleTime: 5 * 60 * 1000 // Cache for 5 mins
  });

  const iqdRate = rateRes?.iqd_rate || 1530;

  const product = productRes?.data || productRes;

  const getBrandName = (brandVal) => {
    if (!brandVal) return "Generic Brand";
    if (typeof brandVal === "object") {
      return brandVal.name || brandVal.name_ar || "Generic Brand";
    }
    return brandVal;
  };

  const getCategoryName = (catVal) => {
    if (!catVal) return "N/A";
    if (typeof catVal === "object") {
      return catVal.name || catVal.name_ar || "N/A";
    }
    return catVal;
  };

  const getSubcategoryName = (subVal) => {
    if (!subVal) return "Uncategorized";
    if (typeof subVal === "object") {
      return subVal.name || subVal.name_ar || subVal.subcategory_name || "Uncategorized";
    }
    return subVal;
  };

  // Safe tags/skin_type parser matching string list or raw array
  const parseTagsArray = (val) => {
    if (!val) return [];
    if (Array.isArray(val)) return val;
    if (typeof val === "string") {
      return val.split(",").map(s => s.trim()).filter(Boolean);
    }
    return [];
  };

  // Permissive helper to parse is_best_selling truthy variants
  const isBestSelling = (() => {
    if (!product) return false;
    const val = product.is_best_selling !== undefined ? product.is_best_selling 
              : product.is_best_seller !== undefined ? product.is_best_seller
              : product.best_selling !== undefined ? product.best_selling
              : product.best_seller;
    if (val === undefined || val === null) return false;
    return val === true || 
           val === 1 || 
           val === "1" || 
           String(val).toLowerCase() === "true" || 
           String(val).toLowerCase() === "yes" || 
           String(val).toLowerCase() === "y";
  })();

  const isNewArrival      = parseBoolField(product?.is_new_arrival);
  const isRecommended     = parseBoolField(product?.is_recommended);
  const isCodRecommended  = parseBoolField(product?.is_cod_recommended);
  const priceTierConfig   = PRICE_TIER_CONFIG[product?.price_tier?.toLowerCase()] ?? null;
  const productStatusConfig = PRODUCT_STATUS_CONFIG[product?.product_status?.toLowerCase()] ?? null;

  const handleDelete = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "This product will be permanently removed from inventory!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#262626",
      confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosSecure.delete(`/api/v1/products/${barcode}/`);
          queryClient.invalidateQueries(["products"]);
          Swal.fire({ title: "Deleted!", text: "Product has been deleted.", icon: "success", confirmButtonColor: "#00CE51" });
          navigate("/products");
        } catch {
          Swal.fire({ title: "Error!", text: "Failed to delete product.", icon: "error" });
        }
      }
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-24 text-center">
        <Loader2 className="animate-spin text-[#00CE51] mb-4" size={40} />
        <p className="text-gray-400 text-sm">Fetching product details from SAP catalog...</p>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-center bg-[#1A1A1A] border border-[#262626] rounded-xl">
        <ShieldAlert className="text-red-500 mb-4" size={40} />
        <h3 className="text-white font-bold text-lg">Product Not Found</h3>
        <p className="text-gray-400 text-sm mt-1 max-w-sm">
          No product was found matching the barcode <span className="font-mono text-white bg-[#0B0B0B] px-1.5 py-0.5 rounded">{barcode}</span>.
        </p>
        <div className="flex gap-4 mt-6">
          <Link
            to="/products"
            className="bg-[#262626] hover:bg-[#333] text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all"
          >
            Back to Inventory
          </Link>
          <button
            onClick={() => refetch()}
            className="bg-[#00CE51]/10 text-[#00CE51] border border-[#00CE51]/20 hover:bg-[#00CE51] hover:text-[#0B0B0B] px-5 py-2.5 rounded-lg text-sm font-semibold transition-all"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const qty = Number(product.available_qty || product.stock) || 0;

  return (
    <div className="space-y-6">
      
      {/* Header breadcrumbs */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate("/products")}
            className="p-2 bg-[#1A1A1A] hover:bg-[#222] border border-[#262626] rounded-lg text-gray-400 hover:text-white transition-all cursor-pointer"
          >
            <ChevronLeft size={18} />
          </button>
          <div>
            <div className="flex items-center gap-2 text-xs text-gray-500 font-bold uppercase tracking-wider">
              <Link to="/products" className="hover:text-[#00CE51] transition-colors">Inventory</Link>
              <span>/</span>
              <span className="text-gray-400">View Product</span>
            </div>
            <h1 className="text-2xl font-bold text-white mt-0.5">{product.item_name || product.name}</h1>
          </div>
        </div>

        {/* Action Header Button Controls */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Link
            to={`/products/edit/${barcode}`}
            className="flex-grow sm:flex-grow-0 flex items-center justify-center gap-2 bg-[#1A1A1A] border border-[#262626] hover:border-[#00CE51]/30 hover:text-[#00CE51] text-gray-300 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer"
          >
            <Edit2 size={16} />
            <span>Edit Product</span>
          </Link>
          <button
            onClick={handleDelete}
            className="flex-grow sm:flex-grow-0 flex items-center justify-center gap-2 bg-red-500/10 border border-red-500/20 hover:bg-red-500 hover:text-white text-red-400 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer"
          >
            <Trash2 size={16} />
            <span>Delete Item</span>
          </button>
        </div>
      </div>

      {/* Product Content Details Body */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column - Image & Technical Specifications (lg:col-span-5) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Big Representation Image Card */}
          <div className="bg-[#1A1A1A] border border-[#262626] p-5 rounded-xl flex items-center justify-center">
            <div className="w-full relative">
              <ProductImageLarge src={product.image_url} name={product.item_name || product.name} />
            </div>
          </div>

          {/* Technical Specifications & SAP Metadata (Rendered as single-column for max resolution) */}
          <div className="bg-[#1A1A1A] border border-[#262626] rounded-xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Package size={16} className="text-[#00CE51]" />
              <span>Technical Data Specification</span>
            </h3>

            <div className="grid grid-cols-1 gap-4 pt-2">
              
              {/* Barcode Reference */}
              <div className="bg-[#0B0B0B] border border-[#222] p-4 rounded-lg flex items-center gap-3">
                <div className="p-2.5 bg-white/5 text-gray-400 rounded-lg flex-shrink-0">
                  <Barcode size={18} />
                </div>
                <div className="truncate text-left">
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Barcode Reference</p>
                  <p className="text-sm font-mono text-white font-semibold mt-0.5 truncate">{product.barcode || "N/A"}</p>
                </div>
              </div>

              {/* SAP Item Code */}
              <div className="bg-[#0B0B0B] border border-[#222] p-4 rounded-lg flex items-center gap-3">
                <div className="p-2.5 bg-white/5 text-gray-400 rounded-lg flex-shrink-0">
                  <Package size={18} />
                </div>
                <div className="truncate text-left">
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">SAP Item Code</p>
                  <p className="text-sm font-mono text-white font-semibold mt-0.5 truncate">{product.item_code || "N/A"}</p>
                </div>
              </div>

              {/* SAP Product ID Item */}
              {product.sap_product_id ? (
                <div className="bg-[#0B0B0B] border border-[#222] p-4 rounded-lg flex items-center gap-3">
                  <div className="p-2.5 bg-white/5 text-gray-400 rounded-lg flex-shrink-0">
                    <Database size={18} />
                  </div>
                  <div className="truncate text-left">
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">SAP Database ID</p>
                    <p className="text-sm font-mono text-white font-semibold mt-0.5 truncate">{product.sap_product_id}</p>
                  </div>
                </div>
              ) : null}

              {/* Main Category */}
              <div className="bg-[#0B0B0B] border border-[#222] p-4 rounded-lg flex items-center gap-3">
                <div className="p-2.5 bg-white/5 text-gray-400 rounded-lg flex-shrink-0">
                  <Layers size={18} />
                </div>
                <div className="truncate text-left">
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Main Category</p>
                  <p className="text-sm text-white font-semibold mt-0.5 truncate">{getCategoryName(product.category_name || product.category)}</p>
                </div>
              </div>

              {/* Subcategory */}
              <div className="bg-[#0B0B0B] border border-[#222] p-4 rounded-lg flex items-center gap-3">
                <div className="p-2.5 bg-white/5 text-gray-400 rounded-lg flex-shrink-0">
                  <Tag size={18} />
                </div>
                <div className="truncate text-left">
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Subcategory</p>
                  <p className="text-sm text-white font-semibold mt-0.5 truncate">{getSubcategoryName(product.subcategory_name || product.subcategory)}</p>
                </div>
              </div>

              {/* Product Status */}
              <div className="bg-[#0B0B0B] border border-[#222] p-4 rounded-lg flex items-center gap-3">
                <div className="p-2.5 bg-white/5 text-gray-400 rounded-lg flex-shrink-0">
                  <Activity size={18} className={productStatusConfig ? "" : "text-gray-600"} />
                </div>
                <div className="truncate text-left">
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Product Status</p>
                  {productStatusConfig ? (
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold mt-0.5 border ${productStatusConfig.cls}`}>
                      {productStatusConfig.label}
                    </span>
                  ) : (
                    <p className="text-sm text-gray-600 font-semibold mt-0.5">Not Set</p>
                  )}
                </div>
              </div>

              {/* Price Tier */}
              <div className="bg-[#0B0B0B] border border-[#222] p-4 rounded-lg flex items-center gap-3">
                <div className="p-2.5 bg-white/5 text-gray-400 rounded-lg flex-shrink-0">
                  <DollarSign size={18} className={priceTierConfig ? "" : "text-gray-600"} />
                </div>
                <div className="truncate text-left">
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Price Tier</p>
                  {priceTierConfig ? (
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold mt-0.5 border ${priceTierConfig.cls}`}>
                      {priceTierConfig.label}
                    </span>
                  ) : (
                    <p className="text-sm text-gray-600 font-semibold mt-0.5">Not Set</p>
                  )}
                </div>
              </div>

              {/* Brand Family */}
              {product.brand_family ? (
                <div className="bg-[#0B0B0B] border border-[#222] p-4 rounded-lg flex items-center gap-3">
                  <div className="p-2.5 bg-white/5 text-gray-400 rounded-lg flex-shrink-0">
                    <Users size={18} />
                  </div>
                  <div className="truncate text-left">
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Brand Family</p>
                    <p className="text-sm text-white font-semibold mt-0.5 truncate">{product.brand_family}</p>
                  </div>
                </div>
              ) : null}

            </div>
          </div>

        </div>

        {/* Right Column - Attributes & Formulation (lg:col-span-7) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Main Info Box */}
          <div className="bg-[#1A1A1A] border border-[#262626] rounded-xl p-6 space-y-6">
            <div>
              {/* Product Promotion Pills Row */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-1 rounded bg-white/5 text-gray-400 text-xs font-bold uppercase tracking-widest border border-white/10">
                  {getBrandName(product.brand_name || product.brand)}
                </span>
                
                {/* Best Selling Scope Star Pill */}
                {isBestSelling ? (
                  <span className="px-2.5 py-1 rounded bg-yellow-400/10 text-yellow-400 text-xs font-bold uppercase tracking-widest border border-yellow-400/20 flex items-center gap-1">
                    ⭐ Best Seller {product.best_selling_scope || product.best_seller_scope ? `(${product.best_selling_scope || product.best_seller_scope})` : ""}
                  </span>
                ) : null}

                {/* Sales Rank Badge */}
                {product.sales_rank ? (
                  <span className="px-2.5 py-1 rounded bg-orange-500/10 text-orange-400 text-xs font-bold uppercase tracking-widest border border-orange-500/20">
                    🔥 Rank #{product.sales_rank}
                  </span>
                ) : null}

                {/* Recommendation Flags */}
                {isNewArrival && (
                  <span className="px-2.5 py-1 rounded bg-cyan-500/10 text-cyan-400 text-xs font-bold uppercase tracking-widest border border-cyan-500/20">
                    ✦ New Arrival
                  </span>
                )}
                {isRecommended && (
                  <span className="px-2.5 py-1 rounded bg-[#00CE51]/10 text-[#00CE51] text-xs font-bold uppercase tracking-widest border border-[#00CE51]/20">
                    ✓ Recommended
                  </span>
                )}
                {isCodRecommended && (
                  <span className="px-2.5 py-1 rounded bg-indigo-500/10 text-indigo-400 text-xs font-bold uppercase tracking-widest border border-indigo-500/20">
                    💳 COD Recommended
                  </span>
                )}
              </div>

              <h2 className="text-3xl font-black text-white mt-4 tracking-tight leading-tight">
                {product.item_name || product.name}
              </h2>
            </div>

            {/* Dedicated Description & Product Details Block */}
            <div className="border-t border-[#262626] pt-6 space-y-3">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <FileText size={14} className="text-[#00CE51]" />
                <span>Product Details & Description</span>
              </h4>
              <div className="bg-[#0B0B0B] border border-[#222] p-4 rounded-lg">
                <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">
                  {product.description || "No detailed description provided for this product in the inventory database catalog."}
                </p>
              </div>
            </div>

            {/* Pricing Section */}
            <div className="border-t border-[#262626] pt-6 flex flex-wrap justify-between items-center gap-4">
              <div>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Unit Cost Price</p>
                <div className="flex flex-col sm:flex-row sm:items-baseline gap-1.5 sm:gap-3.5 mt-1.5">
                  <div className="flex items-baseline text-white">
                    <span className="text-3xl font-mono font-black text-white">
                      ${Number(product.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    <span className="text-gray-500 text-[10px] font-bold ml-1 uppercase">USD</span>
                  </div>
                  <div className="flex items-baseline text-[#00CE51]">
                    <span className="text-2xl font-mono font-black">
                      {(Number(product.price) * iqdRate).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </span>
                    <span className="text-[#00CE51]/75 text-[10px] font-bold ml-1 uppercase">IQD</span>
                  </div>
                </div>
                <div className="text-[9px] text-gray-500 font-bold mt-1.5 uppercase tracking-wider">
                  Conversion Rate: 1 USD = {iqdRate.toLocaleString()} IQD
                </div>
              </div>

              {/* Stock Status Badge */}
              <div className="text-right">
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2">Availability Status</p>
                {qty === 0 ? (
                  <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-red-500/10 text-red-400 text-xs font-bold border border-red-500/20">
                    <AlertTriangle size={13} /> OUT OF STOCK
                  </span>
                ) : qty <= 10 ? (
                  <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-500 text-xs font-bold border border-amber-500/20 animate-pulse">
                    <AlertTriangle size={13} /> LOW STOCK ({qty})
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#00CE51]/10 text-[#00CE51] text-xs font-bold border border-[#00CE51]/20">
                    <CheckCircle size={13} /> {qty} UNITS AVAILABLE
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Marketing & E-Commerce Metrics Card (RELOCATED TO RIGHT SIDE!) */}
          <div className="bg-[#1A1A1A] border border-[#262626] rounded-xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Award size={16} className="text-[#00CE51]" />
              <span>Marketing & E-Commerce Metrics</span>
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              {/* Best Seller Status */}
              <div className="bg-[#0B0B0B] border border-[#222] p-4 rounded-lg flex items-center gap-3">
                <div className="p-2.5 bg-white/5 text-gray-400 rounded-lg flex-shrink-0">
                  <Award size={18} className={isBestSelling ? "text-yellow-400 animate-pulse" : ""} />
                </div>
                <div className="truncate text-left">
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Best Seller</p>
                  <p className="text-sm text-white font-semibold mt-0.5">
                    {isBestSelling ? "Yes" : "No"}
                  </p>
                </div>
              </div>

              {/* Best Selling Scope */}
              <div className="bg-[#0B0B0B] border border-[#222] p-4 rounded-lg flex items-center gap-3">
                <div className="p-2.5 bg-white/5 text-gray-400 rounded-lg flex-shrink-0">
                  <Globe size={18} />
                </div>
                <div className="truncate text-left">
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Selling Scope</p>
                  <p className="text-sm text-white font-semibold mt-0.5 truncate">
                    {product.best_selling_scope || product.best_seller_scope || "N/A"}
                  </p>
                </div>
              </div>

              {/* Sales Rank */}
              <div className="bg-[#0B0B0B] border border-[#222] p-4 rounded-lg flex items-center gap-3">
                <div className="p-2.5 bg-white/5 text-gray-400 rounded-lg flex-shrink-0">
                  <TrendingUp size={18} className={product.sales_rank ? "text-orange-400" : ""} />
                </div>
                <div className="truncate text-left">
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Sales Rank</p>
                  <p className="text-sm text-white font-semibold mt-0.5 truncate">
                    {product.sales_rank ? `#${product.sales_rank}` : "N/A"}
                  </p>
                </div>
              </div>

              {/* Recommendation Priority */}
              {product.recommendation_priority != null && (
                <div className="bg-[#0B0B0B] border border-[#222] p-4 rounded-lg flex items-center gap-3">
                  <div className="p-2.5 bg-white/5 text-gray-400 rounded-lg flex-shrink-0">
                    <TrendingUp size={18} className="text-[#00CE51]" />
                  </div>
                  <div className="truncate text-left">
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Rec. Priority</p>
                    <p className="text-sm text-white font-semibold mt-0.5">
                      {product.recommendation_priority}
                    </p>
                  </div>
                </div>
              )}

              {/* Recommendation Score Override */}
              {product.recommendation_score_override != null && (
                <div className="bg-[#0B0B0B] border border-[#222] p-4 rounded-lg flex items-center gap-3">
                  <div className="p-2.5 bg-white/5 text-gray-400 rounded-lg flex-shrink-0">
                    <Sparkles size={18} className="text-purple-400" />
                  </div>
                  <div className="truncate text-left">
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Score Override</p>
                    <p className="text-sm text-white font-semibold mt-0.5">
                      {product.recommendation_score_override}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bundle Configuration Card (only when configured) */}
          {(product.bundle_group || product.bundle_discount_percent != null) && (
            <div className="bg-[#1A1A1A] border border-[#262626] rounded-xl p-6 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Package size={16} className="text-[#00CE51]" />
                <span>Bundle Configuration</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="bg-[#0B0B0B] border border-[#222] p-4 rounded-lg flex items-center gap-3">
                  <div className="p-2.5 bg-white/5 text-gray-400 rounded-lg flex-shrink-0">
                    <Package size={18} />
                  </div>
                  <div className="truncate text-left">
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Bundle Group</p>
                    <p className="text-sm text-white font-semibold mt-0.5 truncate">
                      {product.bundle_group || "No Bundle"}
                    </p>
                  </div>
                </div>
                <div className="bg-[#0B0B0B] border border-[#222] p-4 rounded-lg flex items-center gap-3">
                  <div className="p-2.5 bg-white/5 text-gray-400 rounded-lg flex-shrink-0">
                    <Percent size={18} />
                  </div>
                  <div className="truncate text-left">
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Bundle Discount</p>
                    <p className="text-sm text-white font-semibold mt-0.5">
                      {product.bundle_discount_percent != null ? `${product.bundle_discount_percent}%` : "—"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Skincare & Formulation Attributes Card */}
          {(product.skin_type || product.concerns || product.tags) ? (
            <div className="bg-[#1A1A1A] border border-[#262626] rounded-xl p-6 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Sparkles size={16} className="text-[#00CE51]" />
                <span>Formulation & Skin Target Specs</span>
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                {/* Skin Type */}
                {product.skin_type ? (
                  <div className="space-y-2">
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Target Skin Type</p>
                    <div className="flex flex-wrap gap-1.5">
                      {parseTagsArray(product.skin_type).map((type, idx) => (
                        <span key={idx} className="px-2.5 py-0.5 rounded-full bg-pink-500/10 text-pink-400 text-[11px] font-semibold border border-pink-500/20">
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}

                {/* Concerns */}
                {product.concerns ? (
                  <div className="space-y-2">
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Primary Concerns</p>
                    <div className="flex flex-wrap gap-1.5">
                      {parseTagsArray(product.concerns).map((concern, idx) => (
                        <span key={idx} className="px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 text-[11px] font-semibold border border-purple-500/20">
                          {concern}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}

                {/* Tags */}
                {product.tags ? (
                  <div className="sm:col-span-2 space-y-2">
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">E-Commerce Search Tags</p>
                    <div className="flex flex-wrap gap-1.5">
                      {parseTagsArray(product.tags).map((tag, idx) => (
                        <span key={idx} className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 text-[11px] font-semibold border border-cyan-500/20">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          ) : null}
        </div>
      </div>

    </div>
  );
};

export default ProductView;
