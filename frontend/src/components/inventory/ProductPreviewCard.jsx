import React from "react";
import { Sparkles, Barcode } from "lucide-react";

const ProductPreviewCard = ({
  itemName = "",
  imageUrl = "",
  price = 0,
  availableQty = 0,
  barcode = "",
  isBestSelling = 0,
  tags = [],
  brandId,
  categoryId,
  brands = [],
  categories = [],
}) => {
  const brandObj = brands.find((b) => b.id === brandId);
  const categoryObj = categories.find((c) => c.id === categoryId);

  const brandName = brandObj ? brandObj.name : "No Brand";
  const categoryName = categoryObj ? categoryObj.name : "No Category";

  let stockDotColor = "bg-red-500";
  let stockLabel = "OUT OF STOCK";
  let stockTextColor = "text-red-500";

  if (availableQty > 10) {
    stockDotColor = "bg-[#00CE51]";
    stockLabel = `OK (${availableQty})`;
    stockTextColor = "text-[#00CE51]";
  } else if (availableQty > 0) {
    stockDotColor = "bg-amber-500";
    stockLabel = `LOW STOCK (${availableQty})`;
    stockTextColor = "text-amber-500";
  }

  const formattedPrice = Number(price || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <div className="bg-[#1A1A1A] border border-[#262626] rounded-xl overflow-hidden shadow-xl sticky top-8 text-left relative max-w-sm mx-auto w-full select-none animate-in fade-in duration-200">
      {isBestSelling === 1 && (
        <div className="absolute top-0 right-0 z-10 overflow-hidden w-24 h-24 pointer-events-none select-none">
          <div className="absolute top-4 -right-8 w-28 bg-[#00CE51] text-black font-extrabold text-[9px] uppercase tracking-wider text-center py-1.5 rotate-45 shadow-md flex items-center justify-center gap-1">
            <Sparkles size={8} fill="currentColor" />
            <span>Best Seller</span>
          </div>
        </div>
      )}

      <div className="aspect-video bg-black flex items-center justify-center overflow-hidden border-b border-[#262626] relative group">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={itemName || "Product Preview"}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop&q=60";
            }}
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-gray-500 text-xs">
            <Sparkles size={24} className="text-[#00CE51] opacity-40 animate-pulse" />
            <span>Product Image Preview</span>
          </div>
        )}
      </div>

      <div className="px-5 pt-5 flex flex-wrap gap-2">
        <span className="text-[10px] font-extrabold px-2.5 py-1 rounded bg-[#00CE51]/10 text-[#00CE51] border border-[#00CE51]/20 uppercase tracking-wide">
          {brandName}
        </span>
        <span className="text-[10px] font-extrabold px-2.5 py-1 rounded bg-white/5 text-gray-400 border border-white/10 uppercase tracking-wide">
          {categoryName}
        </span>
      </div>

      <div className="p-5 space-y-4">
        <h4 className="text-white text-base font-bold leading-snug line-clamp-2">
          {itemName || "Product Name Placeholder"}
        </h4>

        <div className="grid grid-cols-2 gap-4 border-t border-b border-[#262626] py-3.5">
          <div className="space-y-0.5">
            <p className="text-[9px] text-gray-500 font-extrabold uppercase tracking-widest">Price</p>
            <p className="text-lg font-extrabold text-white font-mono">${formattedPrice}</p>
          </div>
          <div className="space-y-0.5">
            <p className="text-[9px] text-gray-500 font-extrabold uppercase tracking-widest">Stock Status</p>
            <div className="flex items-center gap-1.5 pt-0.5">
              <span className={`w-2 h-2 rounded-full ${stockDotColor} animate-pulse`} />
              <span className={`text-xs font-extrabold uppercase tracking-wider ${stockTextColor}`}>
                {stockLabel}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="bg-[#0B0B0B] border border-[#222] p-3 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-400">
              <Barcode size={16} />
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-500">Barcode</span>
            </div>
            <span className="text-xs font-mono text-white font-semibold">
              {barcode || "N/A"}
            </span>
          </div>

          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[9px] font-bold px-2 py-0.5 rounded bg-white/5 text-gray-400 border border-white/10 uppercase tracking-wide"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductPreviewCard;
