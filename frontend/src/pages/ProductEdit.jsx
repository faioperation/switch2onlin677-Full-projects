import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, useWatch } from "react-hook-form";
import useAxiosSecure from "../hooks/useAxios";
import Swal from "sweetalert2";
import {
  ChevronLeft,
  Save,
  X,
  Package,
  DollarSign,
  Layers,
  Image,
  FileText,
  ShieldAlert,
  Loader2,
  Barcode,
  Sparkles,
  TrendingUp,
  Globe,
  Star,
  Activity,
  Tag,
  Heart,
  Percent
} from "lucide-react";

// Form Components
import FormSection from "../components/forms/FormSection";
import TextField from "../components/forms/TextField";
import NumberField from "../components/forms/NumberField";
import TextAreaField from "../components/forms/TextAreaField";
import SelectField from "../components/forms/SelectField";
import ToggleField from "../components/forms/ToggleField";
import TagInputField from "../components/forms/TagInputField";
import ComboboxField from "../components/forms/ComboboxField";

// Preview Card
import ProductPreviewCard from "../components/inventory/ProductPreviewCard";

const skinTypeOptions = [
  { value: "", label: "Unassigned Skin Type" },
  { value: "oily", label: "Oily" },
  { value: "dry", label: "Dry" },
  { value: "normal", label: "Normal" },
  { value: "combination", label: "Combination" },
  { value: "sensitive", label: "Sensitive" },
  { value: "all", label: "All Skin Types" },
];

const scopeOptions = [
  { value: "", label: "Unassigned Scope" },
  { value: "global", label: "Global" },
  { value: "category", label: "Category-wide" },
  { value: "brand", label: "Brand-wide" },
  { value: "subcategory", label: "Subcategory-wide" },
];

// Converts null / comma-string / pipe-string / array → clean string array
const parseTagsArray = (val) => {
  if (!val) return [];
  if (Array.isArray(val)) return val.map(String).filter(Boolean);
  if (typeof val === "string") {
    const sep = val.includes("|") ? "|" : ",";
    return val.split(sep).map((s) => s.trim()).filter(Boolean);
  }
  return [];
};

const priceTierOptions = [
  { value: "", label: "Not Assigned" },
  { value: "budget",  label: "Budget" },
  { value: "mid",     label: "Mid-Range" },
  { value: "premium", label: "Premium" },
  { value: "luxury",  label: "Luxury" },
];

const productStatusOptions = [
  { value: "",         label: "No Status Set" },
  { value: "active",   label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "draft",    label: "Draft" },
];

const concernPresets = [
  "acne",
  "dryness",
  "aging",
  "pigmentation",
  "redness",
  "dullness",
  "sensitivity",
  "oiliness"
];

const tagPresets = [
  "bestseller",
  "new",
  "sale",
  "premium",
  "vegan",
  "cruelty-free"
];

const ProductEdit = () => {
  const { barcode } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const [originalBarcode, setOriginalBarcode] = useState("");
  const [originalItemCode, setOriginalItemCode] = useState("");
  const isInitialized = useRef(false);

  // React Hook Form Configuration
  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    setError,
    formState: { errors, isDirty, dirtyFields }
  } = useForm({
    defaultValues: {
      item_code: "",
      barcode: "",
      sap_product_id: "",
      item_name: "",
      description: "",
      image_url: "",
      brand_id: null,
      category_id: null,
      subcategory_id: null,
      skin_type: "",
      concerns: [],
      tags: [],
      price: 0,
      available_qty: 0,
      is_best_selling: 0,
      best_selling_scope: "",
      sales_rank: null,
      // Classification extras
      price_tier: "",
      brand_family: "",
      product_status: "",
      // Recommendation
      is_new_arrival: 0,
      is_recommended: 0,
      is_cod_recommended: 0,
      recommendation_priority: null,
      recommendation_score_override: null,
      // Bundle
      bundle_group: "",
      bundle_discount_percent: null,
    }
  });

  // Watch values for live preview card & dynamic UI triggers
  const watchedValues = useWatch({ control });
  const selectedCategoryId = watchedValues.category_id;
  const isBestSelling = watchedValues.is_best_selling;

  // Query product data
  const { data: productRes, isLoading: isProductLoading, isError } = useQuery({
    queryKey: ["product", barcode],
    queryFn: async () => {
      const res = await axiosSecure.get(`/api/v1/products/${barcode}/`);
      return res.data;
    }
  });

  // Query brands & categories for lookup lists (used in Preview lookup)
  const { data: brandsRes } = useQuery({
    queryKey: ["brands-list"],
    queryFn: async () => {
      const res = await axiosSecure.get("/api/v1/brands/", { params: { limit: 100 } });
      return res.data;
    }
  });
  const brands = brandsRes?.data?.brands || [];

  const { data: categoriesRes } = useQuery({
    queryKey: ["categories-list"],
    queryFn: async () => {
      const res = await axiosSecure.get("/api/v1/categories/", { params: { limit: 100 } });
      return res.data;
    }
  });
  const categories = categoriesRes?.data?.categories || [];

  // Populate form fields on query loaded
  useEffect(() => {
    const prod = productRes?.data || productRes;
    if (prod) {
      reset({
        item_code: prod.item_code || "",
        barcode: prod.barcode || "",
        sap_product_id: prod.sap_product_id || "",
        item_name: prod.item_name || "",
        description: prod.description || "",
        image_url: prod.image_url || "",
        // IDs: prefer the flat field, fall back to the nested object's id
        brand_id: prod.brand_id ?? (typeof prod.brand === "object" ? prod.brand?.id : null) ?? null,
        category_id: prod.category_id ?? (typeof prod.category === "object" ? prod.category?.id : null) ?? null,
        subcategory_id: prod.subcategory_id ?? (typeof prod.subcategory === "object" ? prod.subcategory?.id : null) ?? null,
        skin_type: (prod.skin_type || "").toLowerCase(),
        concerns: parseTagsArray(prod.concerns),
        tags: parseTagsArray(prod.tags),
        price: Number(prod.price) || 0,
        available_qty: Number(prod.available_qty) || 0,
        is_best_selling: Number(prod.is_best_selling) === 1 ? 1 : 0,
        best_selling_scope: prod.best_selling_scope || "",
        sales_rank: prod.sales_rank || null,
        // Classification extras — normalize to lowercase so selects match option values
        price_tier: (prod.price_tier || "").toLowerCase(),
        brand_family: prod.brand_family || "",
        product_status: prod.product_status || "",
        // Recommendation
        is_new_arrival: Number(prod.is_new_arrival) === 1 ? 1 : 0,
        is_recommended: Number(prod.is_recommended) === 1 ? 1 : 0,
        is_cod_recommended: Number(prod.is_cod_recommended) === 1 ? 1 : 0,
        recommendation_priority: prod.recommendation_priority ?? null,
        recommendation_score_override: prod.recommendation_score_override ?? null,
        // Bundle
        bundle_group: prod.bundle_group || "",
        bundle_discount_percent: prod.bundle_discount_percent ?? null,
      });
      setOriginalBarcode(prod.barcode || "");
      setOriginalItemCode(prod.item_code || "");
      
      // Delay user-trigger state slightly to prevent cascade clears on populate
      setTimeout(() => {
        isInitialized.current = true;
      }, 200);
    }
  }, [productRes, reset]);

  // Brand name-based lookup: runs after the brands list is available.
  // Uses setValue (not reset) so it doesn't touch other fields or trigger cascades.
  // Only fires when direct ID resolution in the reset() above returned null.
  useEffect(() => {
    const prod = productRes?.data || productRes;
    if (!prod || !brands.length) return;

    // If a direct ID was already resolved, nothing to do
    const directId =
      prod.brand_id ??
      (typeof prod.brand === "object" ? prod.brand?.id : null);
    if (directId) return;

    // Fall back to name match
    const brandName =
      typeof prod.brand === "string"
        ? prod.brand
        : prod.brand_name ?? null;
    if (!brandName) return;

    const matched = brands.find(
      (b) =>
        b.name?.toLowerCase() === brandName.toLowerCase() ||
        b.name_ar === brandName
    );
    if (matched) {
      setValue("brand_id", matched.id, { shouldDirty: false });
    }
  }, [productRes, brands, setValue]);

  // Cascade Rule: Clear subcategory when category changes
  useEffect(() => {
    if (isInitialized.current) {
      setValue("subcategory_id", null);
    }
  }, [selectedCategoryId, setValue]);

  // Cascade Rule: Clear scope and sales rank when is_best_selling is toggled off
  useEffect(() => {
    if (isBestSelling === 0 && isInitialized.current) {
      setValue("best_selling_scope", "");
      setValue("sales_rank", null);
    }
  }, [isBestSelling, setValue]);

  // Unsaved changes browser native listener
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "Discard unsaved changes?";
        return "Discard unsaved changes?";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  // Edit Mutation
  const editMutation = useMutation({
    mutationFn: async (payload) => {
      const res = await axiosSecure.put(`/api/v1/products/${originalBarcode}/`, payload);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["products"]);
      queryClient.invalidateQueries(["product", barcode]);
      queryClient.invalidateQueries(["product", watchedValues.barcode]);
      
      Swal.fire({
        title: "Success!",
        text: "Product updated successfully.",
        icon: "success",
        confirmButtonColor: "#00CE51"
      });
      navigate(`/products/view/${watchedValues.barcode || originalBarcode}`);
    },
    onError: (err) => {
      console.error("Failed to edit product:", err);
      const status = err.response?.status;
      const data = err.response?.data;
      
      if (status === 409) {
        if (data?.detail?.includes("barcode") || data?.message?.includes("barcode")) {
          setError("barcode", { type: "server", message: "This barcode already exists in the system." });
        } else if (data?.detail?.includes("item_code") || data?.message?.includes("item_code")) {
          setError("item_code", { type: "server", message: "This item code already exists." });
        } else {
          Swal.fire({
            title: "Conflict Error",
            text: data?.message || "Barcode or Item Code already exists.",
            icon: "error",
            confirmButtonColor: "#d33"
          });
        }
      } else if (status === 422) {
        if (Array.isArray(data?.detail)) {
          data.detail.forEach((errItem) => {
            const field = errItem.loc?.[errItem.loc.length - 1];
            if (field) {
              setError(field, { type: "server", message: errItem.msg });
            }
          });
        } else {
          Swal.fire({
            title: "Validation Error",
            text: data?.message || "Invalid payload format.",
            icon: "error",
            confirmButtonColor: "#d33"
          });
        }
      } else {
        Swal.fire({
          title: "Update Failed!",
          text: data?.message || "Something went wrong while saving changes.",
          icon: "error",
          confirmButtonColor: "#d33"
        });
      }
    }
  });

  const onSubmit = (data) => {
    // Generate only changed (dirty) fields
    const partialPayload = {};

    Object.keys(dirtyFields).forEach((key) => {
      let val = data[key];

      // Rule 5: Never send empty strings for optional fields — send null or omit
      if (typeof val === "string" && val.trim() === "") {
        val = null;
      }

      // Rule 7: Clear scope & rank if is_best_selling toggled off
      if (key === "is_best_selling" && val === 0) {
        partialPayload.best_selling_scope = null;
        partialPayload.sales_rank = null;
      }

      partialPayload[key] = val;
    });

    // Fallback: If no fields are changed, bypass API call
    if (Object.keys(partialPayload).length === 0) {
      Swal.fire({
        title: "No Changes!",
        text: "No specifications were modified.",
        icon: "info",
        confirmButtonColor: "#00CE51"
      });
      navigate(`/products/view/${barcode}`);
      return;
    }

    editMutation.mutate(partialPayload);
  };

  const handleCancel = () => {
    if (isDirty) {
      Swal.fire({
        title: "Discard changes?",
        text: "You have unsaved edits. Are you sure you want to discard them?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, discard",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate(`/products/view/${barcode}`);
        }
      });
    } else {
      navigate(`/products/view/${barcode}`);
    }
  };

  if (isProductLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-24 text-center select-none">
        <Loader2 className="animate-spin text-[#00CE51] mb-4" size={40} />
        <p className="text-gray-400 text-sm font-semibold">Loading product specifications...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-center bg-[#1A1A1A] border border-[#262626] rounded-xl select-none">
        <ShieldAlert className="text-red-500 mb-4" size={40} />
        <h3 className="text-white font-bold text-lg">Product Not Found</h3>
        <p className="text-gray-400 text-sm mt-1">Failed to fetch the target product for editing.</p>
        <Link to="/products" className="mt-6 bg-[#262626] hover:bg-[#333] text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all">
          Back to Inventory
        </Link>
      </div>
    );
  }

  const isSaving = editMutation.isPending;
  const selectedCategoryObj = categories.find((c) => c.id === selectedCategoryId);
  const selectedCategoryName = selectedCategoryObj ? selectedCategoryObj.name : "";

  return (
    <div className="space-y-6">
      
      {/* Header breadcrumbs */}
      <div className="flex items-center gap-3 select-none">
        <button
          onClick={handleCancel}
          className="p-2 bg-[#1A1A1A] hover:bg-[#222] border border-[#262626] rounded-lg text-gray-400 hover:text-white transition-all cursor-pointer"
        >
          <ChevronLeft size={18} />
        </button>
        <div className="text-left">
          <div className="flex items-center gap-2 text-xs text-gray-500 font-bold uppercase tracking-wider">
            <Link to="/products" className="hover:text-[#00CE51] transition-colors">Inventory</Link>
            <span>/</span>
            <Link to={`/products/view/${barcode}`} className="hover:text-[#00CE51] transition-colors">View Product</Link>
            <span>/</span>
            <span className="text-gray-400">Edit Details</span>
          </div>
          <h1 className="text-2xl font-bold text-white mt-0.5">Edit Product Specifications</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Form Editor */}
        <div className="lg:col-span-8 space-y-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            {/* SECTION 1: IDENTIFIERS */}
            <FormSection title="Section 1: Identifiers" icon={Barcode}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <TextField
                  label="Item Code"
                  name="item_code"
                  required
                  register={register}
                  error={errors.item_code}
                  icon={Package}
                  placeholder="e.g. AG-1002"
                />
                
                <div className="relative w-full">
                  <TextField
                    label="Barcode"
                    name="barcode"
                    required
                    register={register}
                    error={errors.barcode}
                    icon={Barcode}
                    placeholder="e.g. 7640162580854"
                  />
                  {watchedValues.barcode !== originalBarcode && (
                    <span className="text-[10px] text-amber-500 font-bold block pt-1 select-none text-left">
                      ⚠ Changing primary key will trigger cascade update
                    </span>
                  )}
                </div>

                <TextField
                  label="SAP Product ID"
                  name="sap_product_id"
                  register={register}
                  error={errors.sap_product_id}
                  icon={Activity}
                  placeholder="e.g. SAP9044"
                />
              </div>
            </FormSection>

            {/* SECTION 2: BASIC INFO */}
            <FormSection title="Section 2: Basic Info" icon={Package}>
              <div className="space-y-4">
                <TextField
                  label="Product Title"
                  name="item_name"
                  required
                  register={register}
                  error={errors.item_name}
                  icon={Package}
                  placeholder="e.g. Agilise Unika Blue Gel 1000 Ml"
                />
                
                <TextAreaField
                  label="Product Detailed Description"
                  name="description"
                  register={register}
                  error={errors.description}
                  icon={FileText}
                  rows={4}
                  placeholder="Provide detailed information regarding the composition, application instructions, and benefits..."
                />

                <TextField
                  label="Image Representation URL"
                  name="image_url"
                  register={register}
                  error={errors.image_url}
                  icon={Image}
                  placeholder="https://example.com/product.png"
                />
              </div>
            </FormSection>

            {/* SECTION 3: CLASSIFICATION */}
            <FormSection title="Section 3: Classification" icon={Layers}>
              <div className="space-y-5">
                {/* Row 1: Brand / Category / Subcategory (unchanged) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <ComboboxField
                    label="Brand"
                    name="brand_id"
                    control={control}
                    error={errors.brand_id}
                    icon={Star}
                    entityType="brand"
                    axios={axiosSecure}
                    placeholder="Select or Create Brand..."
                  />

                  <ComboboxField
                    label="Main Category"
                    name="category_id"
                    control={control}
                    error={errors.category_id}
                    icon={Layers}
                    entityType="category"
                    axios={axiosSecure}
                    placeholder="Select or Create Category..."
                  />

                  <ComboboxField
                    label="Subcategory"
                    name="subcategory_id"
                    control={control}
                    error={errors.subcategory_id}
                    icon={Layers}
                    entityType="subcategory"
                    categoryId={selectedCategoryId}
                    categoryName={selectedCategoryName}
                    axios={axiosSecure}
                    placeholder="Select Subcategory..."
                  />
                </div>

                {/* Row 2: Price Tier / Brand Family / Product Status */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <SelectField
                    label="Price Tier"
                    name="price_tier"
                    register={register}
                    error={errors.price_tier}
                    icon={DollarSign}
                    options={priceTierOptions}
                  />

                  <TextField
                    label="Brand Family"
                    name="brand_family"
                    register={register}
                    error={errors.brand_family}
                    icon={Star}
                    placeholder="e.g. L'Oréal Group"
                  />

                  <SelectField
                    label="Product Status"
                    name="product_status"
                    register={register}
                    error={errors.product_status}
                    icon={Activity}
                    options={productStatusOptions}
                  />
                </div>
              </div>
            </FormSection>

            {/* SECTION 4: BEAUTY ATTRIBUTES */}
            <FormSection title="Section 4: Beauty Target Specs" icon={Sparkles}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <SelectField
                  label="Target Skin Type"
                  name="skin_type"
                  register={register}
                  error={errors.skin_type}
                  icon={Heart}
                  options={skinTypeOptions}
                />

                <TagInputField
                  label="Skin Concerns"
                  name="concerns"
                  control={control}
                  presets={concernPresets}
                  placeholder="Type concern and press Enter..."
                  icon={ShieldAlert}
                />

                <TagInputField
                  label="Merchandising Tags"
                  name="tags"
                  control={control}
                  presets={tagPresets}
                  placeholder="Type tag and press Enter..."
                  icon={Tag}
                />
              </div>
            </FormSection>

            {/* SECTION 5: PRICING & STOCK */}
            <FormSection title="Section 5: Pricing & Inventory" icon={DollarSign}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <NumberField
                  label="Price (USD)"
                  name="price"
                  required
                  prefix="$"
                  register={register}
                  error={errors.price}
                  icon={DollarSign}
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                />

                <NumberField
                  label="Available Quantity"
                  name="available_qty"
                  required
                  register={register}
                  error={errors.available_qty}
                  icon={Package}
                  min="0"
                  placeholder="0"
                />
              </div>
            </FormSection>

            {/* SECTION 6: MERCHANDISING */}
            <FormSection title="Section 6: Merchandising & Rank" icon={TrendingUp}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-end">
                <ToggleField
                  label="Is Best Seller"
                  name="is_best_selling"
                  control={control}
                  icon={Sparkles}
                />

                <SelectField
                  label="Best Selling Scope"
                  name="best_selling_scope"
                  register={register}
                  error={errors.best_selling_scope}
                  disabled={isBestSelling === 0}
                  icon={Globe}
                  options={scopeOptions}
                />

                <NumberField
                  label="Sales Rank"
                  name="sales_rank"
                  register={register}
                  error={errors.sales_rank}
                  disabled={isBestSelling === 0}
                  icon={TrendingUp}
                  min="1"
                  placeholder="e.g. 1"
                />
              </div>
            </FormSection>

            {/* SECTION 7: RECOMMENDATION SETTINGS */}
            <FormSection title="Section 7: Recommendation Settings" icon={Sparkles}>
              <div className="space-y-5">
                {/* Toggles row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-end">
                  <ToggleField
                    label="New Arrival"
                    name="is_new_arrival"
                    control={control}
                    icon={Sparkles}
                  />
                  <ToggleField
                    label="Recommended"
                    name="is_recommended"
                    control={control}
                    icon={TrendingUp}
                  />
                  <ToggleField
                    label="COD Recommended"
                    name="is_cod_recommended"
                    control={control}
                    icon={Globe}
                  />
                </div>
                {/* Score fields row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <NumberField
                    label="Recommendation Priority"
                    name="recommendation_priority"
                    register={register}
                    error={errors.recommendation_priority}
                    icon={TrendingUp}
                    min="0"
                    placeholder="e.g. 10"
                  />
                  <NumberField
                    label="Score Override"
                    name="recommendation_score_override"
                    register={register}
                    error={errors.recommendation_score_override}
                    icon={Activity}
                    step="0.01"
                    min="0"
                    placeholder="e.g. 0.95"
                  />
                </div>
              </div>
            </FormSection>

            {/* SECTION 8: BUNDLE CONFIGURATION */}
            <FormSection title="Section 8: Bundle Configuration" icon={Package}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <TextField
                  label="Bundle Group"
                  name="bundle_group"
                  register={register}
                  error={errors.bundle_group}
                  icon={Tag}
                  placeholder="e.g. skincare-starter-kit"
                />
                <NumberField
                  label="Bundle Discount (%)"
                  name="bundle_discount_percent"
                  register={register}
                  error={errors.bundle_discount_percent}
                  icon={Percent}
                  step="0.01"
                  min="0"
                  max="100"
                  placeholder="e.g. 15"
                />
              </div>
            </FormSection>

            {/* STICKY BOTTOM FORM ACTIONS */}
            <div className="bg-[#1A1A1A]/85 backdrop-blur border border-[#262626] p-4 rounded-xl flex items-center justify-end gap-3 sticky bottom-4 z-30 shadow-2xl select-none">
              <button
                type="button"
                onClick={handleCancel}
                className="bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300 hover:text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer"
              >
                <X size={16} />
                <span>Cancel</span>
              </button>
              
              <button
                type="submit"
                disabled={isSaving}
                className="bg-[#00CE51] hover:opacity-90 text-[#0B0B0B] px-6 py-2.5 rounded-lg text-sm font-bold shadow-[0_4px_15px_rgba(0,206,81,0.2)] transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    <span>Save Specifications</span>
                  </>
                )}
              </button>
            </div>

          </form>
        </div>

        {/* Right Column: Live Sticky Preview Card */}
        <div className="lg:col-span-4 select-none">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 text-left">Live Specifications Preview</h3>
          <ProductPreviewCard
            itemName={watchedValues.item_name}
            imageUrl={watchedValues.image_url}
            price={watchedValues.price}
            availableQty={watchedValues.available_qty}
            barcode={watchedValues.barcode}
            isBestSelling={watchedValues.is_best_selling}
            tags={watchedValues.tags}
            brandId={watchedValues.brand_id}
            categoryId={watchedValues.category_id}
            brands={brands}
            categories={categories}
          />
        </div>

      </div>

    </div>
  );
};

export default ProductEdit;
