import React, { useState, useEffect, useMemo } from "react";
import { useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import useAxiosSecure from "../hooks/useAxios";
import Swal from "sweetalert2";
import ProductsHeader from "../components/products/ProductsHeader";
import ProductsTable from "../components/products/ProductsTable";
import ProductsPagination from "../components/products/ProductsPagination";
import { RefreshCw, AlertCircle } from "lucide-react";

const Products = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  // Basic Filter States
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [subcategoryId, setSubcategoryId] = useState("");
  const [brandId, setBrandId] = useState("");
  
  // Advanced Filter States
  const [inStock, setInStock] = useState(""); // "" (All), "true" (In Stock), "false" (Out of Stock)
  const [isBestSelling, setIsBestSelling] = useState(""); // "" (All), "1" (Best Selling)
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  
  // Sorting & Pagination States
  const [sortBy, setSortBy] = useState("created_desc");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Debounced states for search keyword and price inputs to minimize API load
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [debouncedMinPrice, setDebouncedMinPrice] = useState("");
  const [debouncedMaxPrice, setDebouncedMaxPrice] = useState("");

  // Search keyword debouncing
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset to page 1 on search change
    }, 600);
    return () => clearTimeout(timer);
  }, [search]);

  // Min Price debouncing
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedMinPrice(minPrice);
      setPage(1); // Reset to page 1 on min price change
    }, 600);
    return () => clearTimeout(timer);
  }, [minPrice]);

  // Max Price debouncing
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedMaxPrice(maxPrice);
      setPage(1); // Reset to page 1 on max price change
    }, 600);
    return () => clearTimeout(timer);
  }, [maxPrice]);

  // Fetch dynamic categories, subcategories, and brands for the filter dropdowns
  const { data: filtersRes, isLoading: filtersLoading } = useQuery({
    queryKey: ["products-filters"],
    queryFn: async () => {
      try {
        const res = await axiosSecure.get("/api/v1/products/filters/");
        return res.data;
      } catch (err) {
        console.error("Failed to load product filters:", err);
        return { success: false, data: { categories: [], subcategories: [], brands: [] } };
      }
    },
    staleTime: 1000 * 60 * 15, // Cache filters list for 15 minutes
  });

  const categories = filtersRes?.data?.categories || [];
  const subcategories = filtersRes?.data?.subcategories || filtersRes?.data?.sub_categories || [];
  const brands = filtersRes?.data?.brands || [];

  // Reset subcategory if category changes
  const handleCategoryChange = (val) => {
    setCategoryId(val);
    setSubcategoryId(""); // Reset subcategory
    setPage(1);
  };

  // Main Products Query with all filtering/sorting/pagination parameters
  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: [
      "products",
      page,
      limit,
      debouncedSearch,
      brandId,
      categoryId,
      subcategoryId,
      isBestSelling,
      inStock,
      debouncedMinPrice,
      debouncedMaxPrice,
      sortBy,
    ],
    queryFn: async () => {
      const params = { page, limit };
      
      if (debouncedSearch) params.q = debouncedSearch;
      if (brandId) params.brand_id = Number(brandId);
      if (categoryId) params.category_id = Number(categoryId);
      if (subcategoryId) params.subcategory_id = Number(subcategoryId);
      
      if (isBestSelling) params.is_best_selling = Number(isBestSelling);
      if (inStock !== "") params.in_stock = inStock === "true";
      
      if (debouncedMinPrice) params.min_price = Number(debouncedMinPrice);
      if (debouncedMaxPrice) params.max_price = Number(debouncedMaxPrice);
      
      if (sortBy) params.sort_by = sortBy;

      const res = await axiosSecure.get("/api/v1/products/", { params });
      return res.data;
    },
    placeholderData: keepPreviousData, // Smooth UX: keeps displaying previous page during load
  });

  // Safe fallback parsing for both DRF and custom API structures
  const products = data?.data?.products || data?.results || [];
  const total = data?.data?.pagination?.total || data?.count || 0;
  const totalPages = data?.data?.pagination?.total_pages || Math.ceil(total / limit) || 0;

  // Mirrors the active query params so the export matches what the user currently sees
  const exportFilters = useMemo(() => {
    const f = {};
    if (debouncedSearch) f.q = debouncedSearch;
    if (brandId) f.brand_id = Number(brandId);
    if (categoryId) f.category_id = Number(categoryId);
    if (subcategoryId) f.subcategory_id = Number(subcategoryId);
    if (isBestSelling) f.is_best_selling = Number(isBestSelling);
    if (inStock !== "") f.in_stock = inStock === "true";
    if (debouncedMinPrice) f.min_price = Number(debouncedMinPrice);
    if (debouncedMaxPrice) f.max_price = Number(debouncedMaxPrice);
    if (sortBy) f.sort_by = sortBy;
    return f;
  }, [debouncedSearch, brandId, categoryId, subcategoryId, isBestSelling, inStock, debouncedMinPrice, debouncedMaxPrice, sortBy]);

  // Clear all filters back to default values
  const handleResetFilters = () => {
    setSearch("");
    setCategoryId("");
    setSubcategoryId("");
    setBrandId("");
    setInStock("");
    setIsBestSelling("");
    setMinPrice("");
    setMaxPrice("");
    setSortBy("created_desc");
    setPage(1);
  };

  // Immediate manual query trigger (e.g. on Enter key)
  const triggerSearch = () => {
    setDebouncedSearch(search);
    setDebouncedMinPrice(minPrice);
    setDebouncedMaxPrice(maxPrice);
    setPage(1);
  };

  // Delete product handler
  const handleDelete = (barcodeOrId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This product will be removed from inventory!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#00CE51",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // Supports barcode or ID based deletes depending on backend setup
          await axiosSecure.delete(`/api/v1/products/${barcodeOrId}/`);
          queryClient.invalidateQueries(["products"]);
          Swal.fire({ title: "Deleted!", text: "Product has been deleted.", icon: "success" });
        } catch {
          Swal.fire({ title: "Error!", text: "Failed to delete product.", icon: "error" });
        }
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#1A1A1A] border border-[#262626] rounded-xl p-6">
        
        {/* Advanced Filters Header */}
        <ProductsHeader
          search={search}
          setSearch={setSearch}
          
          categoryId={categoryId}
          setCategoryId={handleCategoryChange}
          subcategoryId={subcategoryId}
          setSubcategoryId={(val) => { setSubcategoryId(val); setPage(1); }}
          brandId={brandId}
          setBrandId={(val) => { setBrandId(val); setPage(1); }}
          
          inStock={inStock}
          setInStock={(val) => { setInStock(val); setPage(1); }}
          isBestSelling={isBestSelling}
          setIsBestSelling={(val) => { setIsBestSelling(val); setPage(1); }}
          
          minPrice={minPrice}
          setMinPrice={setMinPrice}
          maxPrice={maxPrice}
          setMaxPrice={setMaxPrice}
          
          sortBy={sortBy}
          setSortBy={(val) => { setSortBy(val); setPage(1); }}
          
          onSearchTrigger={triggerSearch}
          onResetFilters={handleResetFilters}
          
          categories={categories}
          subcategories={subcategories}
          brands={brands}
          filtersLoading={filtersLoading}
          
          isFetching={isFetching}
          exportFilters={exportFilters}
          onSyncComplete={refetch}
        />

        {/* Error Handling State */}
        {isError ? (
          <div className="flex flex-col items-center justify-center p-12 text-center bg-[#0B0B0B] rounded-xl border border-red-500/20 my-6">
            <AlertCircle className="text-red-500 mb-4" size={40} />
            <h3 className="text-white font-semibold text-lg">Failed to Load Products</h3>
            <p className="text-gray-400 text-sm mt-1 max-w-md">
              There was an issue connecting to the product inventory database. Please try again.
            </p>
            <button
              onClick={() => refetch()}
              className="mt-6 flex items-center gap-2 bg-[#00CE51]/10 text-[#00CE51] border border-[#00CE51]/20 hover:bg-[#00CE51] hover:text-[#0B0B0B] px-6 py-2.5 rounded-lg text-sm font-semibold transition-all"
            >
              <RefreshCw size={16} />
              Retry Connection
            </button>
          </div>
        ) : (
          /* Products Table Grid */
          <ProductsTable 
            data={products} 
            isLoading={isLoading && !data} 
            isFetching={isFetching}
            onDelete={handleDelete} 
          />
        )}

        {/* Server-Side Pagination Controls */}
        {!isError && (
          <ProductsPagination
            page={page}
            setPage={setPage}
            totalPages={totalPages}
            total={total}
            limit={limit}
            setLimit={(val) => {
              setLimit(val);
              setPage(1);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Products;
