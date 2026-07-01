// src/api/brands.js
export const listBrands = async (axios, params = {}) => {
  const res = await axios.get('/api/v1/brands/', { params });
  return res.data;
};

export const createBrand = async (axios, payload) => {
  const res = await axios.post('/api/v1/brands/', payload);
  return res.data;
};
