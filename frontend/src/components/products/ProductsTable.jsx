import React, { useState } from "react";
import { Link } from "react-router";
import { Eye, Edit2, Trash2, Tag, AlertTriangle, CheckCircle, Package } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxios";

// Subcomponent to gracefully handle images and fall back to gorgeous letter placeholders on error
const ProductImage = ({ src, name }) => {
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
      <div 
        className={`w-full h-full flex items-center justify-center font-bold text-sm border rounded-lg select-none ${colorClass}`}
        title={name}
      >
        {firstLetter}
      </div>
    );
  }

  return (
    <img 
      src={src} 
      alt={name} 
      onError={() => setIsError(true)}
      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
    />
  );
};

// Premium Skeleton Rows to display during API fetch requests
const TableSkeleton = () => {
  return (
    <>
      {Array.from({ length: 10 }).map((_, idx) => (
        <tr key={`skeleton-${idx}`} className="border-b border-[#1F1F1F] animate-pulse">
          
          {/* Product Detail Skeleton */}
          <td className="px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#222] border border-[#262626]"></div>
              <div className="space-y-1.5">
                <div className="h-4 bg-[#222] rounded w-32 sm:w-48"></div>
                <div className="h-3 bg-[#222] rounded w-20"></div>
              </div>
            </div>
          </td>
          
          {/* Barcode Skeleton */}
          <td className="px-6 py-4">
            <div className="h-3.5 bg-[#222] rounded w-24"></div>
          </td>
          
          {/* Brand Skeleton */}
          <td className="px-6 py-4">
            <div className="h-3.5 bg-[#222] rounded w-16"></div>
          </td>
          
          {/* Category Skeleton */}
          <td className="px-6 py-4">
            <div className="h-5 bg-[#222] rounded w-16"></div>
          </td>
          
          {/* Price Skeleton */}
          <td className="px-6 py-4 text-right">
            <div className="h-4 bg-[#222] rounded w-16 ml-auto"></div>
          </td>
          
          {/* Stock Level Skeleton */}
          <td className="px-6 py-4 text-center">
            <div className="h-5 bg-[#222] rounded w-14 mx-auto"></div>
          </td>
          
          {/* Action Buttons Skeleton */}
          <td className="px-6 py-4 text-right">
            <div className="flex justify-end gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#222]"></div>
              <div className="w-8 h-8 rounded-lg bg-[#222]"></div>
              <div className="w-8 h-8 rounded-lg bg-[#222]"></div>
            </div>
          </td>
          
        </tr>
      ))}
    </>
  );
};

const ProductsTable = ({ data = [], isLoading, isFetching, onDelete }) => {
  const axiosSecure = useAxiosSecure();

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

  return (
    <div className="overflow-x-auto rounded-xl border border-[#262626] bg-[#0E0E0E]">
      <table className="w-full text-sm text-left text-gray-400">
        
        {/* Table Header (Status Column Removed) */}
        <thead className="text-xs text-gray-500 uppercase bg-[#070707] border-b border-[#262626]">
          <tr>
            <th className="px-6 py-4.5 font-bold tracking-wider">Product Info</th>
            <th className="px-6 py-4.5 font-bold tracking-wider">Barcode</th>
            <th className="px-6 py-4.5 font-bold tracking-wider">Brand</th>
            <th className="px-6 py-4.5 font-bold tracking-wider">Category</th>
            <th className="px-6 py-4.5 font-bold tracking-wider text-right">Price (USD/IQD)</th>
            <th className="px-6 py-4.5 font-bold tracking-wider text-center">Stock</th>
            <th className="px-6 py-4.5 font-bold tracking-wider text-right">Actions</th>
          </tr>
        </thead>
        
        {/* Table Body */}
        <tbody className="divide-y divide-[#181818] relative">
          
          {isLoading ? (
            /* Show Skeleton Loader during initial page load */
            <TableSkeleton />
          ) : data.length > 0 ? (
            /* Map and Render Product Records */
            data.map((item) => {
              const qty = Number(item.available_qty) || 0;
              const barcode = item.barcode || "N/A";
              
              return (
                <tr 
                  key={item.id || barcode} 
                  className={`hover:bg-[#121212] transition-colors group ${
                    isFetching ? "opacity-60" : "opacity-100"
                  }`}
                >
                  
                  {/* Product Details (Image with Fallback, Title, Subcategory) */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 relative">
                        <ProductImage src={item.image_url} name={item.item_name} />
                      </div>
                      
                      <div className="max-w-[200px] sm:max-w-[300px]">
                        <div className="text-white font-semibold line-clamp-1 group-hover:text-[#00CE51] transition-colors">
                          {item.item_name}
                        </div>
                        {item.subcategory?.name && (
                          <div className="text-xs text-gray-500 mt-0.5 font-medium truncate">
                            {item.subcategory.name}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  
                  {/* Barcode (in Monospace for scan accuracy) */}
                  <td className="px-6 py-4 font-mono text-xs text-gray-300 font-medium">
                    {barcode}
                  </td>
                  
                  {/* Brand name */}
                  <td className="px-6 py-4 text-gray-300 font-medium">
                    {item.brand?.name || "Generic"}
                  </td>

                  {/* Category Badge */}
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-md bg-[#161616] text-[11px] text-gray-400 font-bold border border-[#222]">
                      {item.category?.name || "N/A"}
                    </span>
                  </td>
                  
                  {/* Price */}
                  <td className="px-6 py-4 text-right">
                    <div className="text-white font-mono font-bold">
                      ${Number(item.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <div className="text-[11px] text-[#00CE51] font-mono font-bold mt-0.5">
                      {(Number(item.price) * iqdRate).toLocaleString(undefined, { maximumFractionDigits: 0 })} IQD
                    </div>
                  </td>
                  
                  {/* Advanced Stock Status Visual Tags */}
                  <td className="px-6 py-4 text-center">
                    {qty === 0 ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-500/10 text-red-400 text-[10px] font-bold border border-red-500/20">
                        <AlertTriangle size={10} /> OUT OF STOCK
                      </span>
                    ) : qty <= 10 ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-500 text-[10px] font-bold border border-amber-500/20 animate-pulse">
                        <AlertTriangle size={10} /> LOW STOCK ({qty})
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#00CE51]/10 text-[#00CE51] text-[10px] font-bold border border-[#00CE51]/20">
                        <CheckCircle size={10} /> {qty} IN STOCK
                      </span>
                    )}
                  </td>
                  
                  {/* Action Buttons with tooltips & smooth transitions */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                      <Link 
                        to={`/products/view/${barcode}`}
                        className="p-1.5 hover:bg-[#1D1D1D] rounded-lg text-gray-400 hover:text-[#00CE51] transition-all" 
                        title="View Details"
                      >
                        <Eye size={15} />
                      </Link>
                      <Link 
                        to={`/products/edit/${barcode}`}
                        className="p-1.5 hover:bg-[#1D1D1D] rounded-lg text-gray-400 hover:text-blue-400 transition-all" 
                        title="Edit Details"
                      >
                        <Edit2 size={15} />
                      </Link>
                      <button 
                        onClick={() => onDelete(barcode)}
                        className="p-1.5 hover:bg-[#1D1D1D] rounded-lg text-gray-400 hover:text-red-400 transition-all animate-ease cursor-pointer" 
                        title="Delete Product"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                  
                </tr>
              );
            })
          ) : (
            /* Empty Data State with adjusted colSpan = 7 */
            <tr>
              <td colSpan="7" className="px-6 py-20 text-center bg-[#0B0B0B]">
                <div className="max-w-sm mx-auto flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-[#161616] flex items-center justify-center text-gray-600 border border-[#222] mb-4">
                    <Package size={22} />
                  </div>
                  <h4 className="text-white font-semibold text-base">No Products Found</h4>
                  <p className="text-gray-500 text-xs mt-1 leading-relaxed">
                    No products were found matching your current filter configurations. Try adjusting your query or price ranges.
                  </p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
        
      </table>
    </div>
  );
};

export default ProductsTable;
