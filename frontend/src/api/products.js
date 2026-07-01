// src/api/products.js
export const getProduct = async (axios, barcode) => {
  const res = await axios.get(`/api/v1/products/${barcode}/`);
  return res.data;
};

export const updateProduct = async (axios, barcode, payload) => {
  const res = await axios.put(`/api/v1/products/${barcode}/`, payload);
  return res.data;
};

export const exportProducts = async (axios, filters = {}) => {
  const params = {};
  if (filters.q) params.q = filters.q;
  if (filters.brand_id) params.brand_id = filters.brand_id;
  if (filters.category_id) params.category_id = filters.category_id;
  if (filters.subcategory_id) params.subcategory_id = filters.subcategory_id;
  if (filters.is_best_selling) params.is_best_selling = filters.is_best_selling;
  if (filters.in_stock !== undefined && filters.in_stock !== "") params.in_stock = filters.in_stock;
  if (filters.min_price) params.min_price = filters.min_price;
  if (filters.max_price) params.max_price = filters.max_price;
  if (filters.product_status) params.product_status = filters.product_status;
  if (filters.sort_by) params.sort_by = filters.sort_by;

  const res = await axios.get("/api/v1/products/export/", {
    params,
    responseType: "blob",
  });

  // Extract server-provided filename or fall back to a timestamped name
  const disposition = res.headers["content-disposition"] || "";
  const nameMatch = disposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
  const filename =
    nameMatch && nameMatch[1]
      ? nameMatch[1].replace(/['"]/g, "").trim()
      : `products-export-${Date.now()}.xlsx`;

  const blob = new Blob([res.data], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
