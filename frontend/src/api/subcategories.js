// src/api/subcategories.js
export const listSubcategories = async (axios, params = {}) => {
  const res = await axios.get('/api/v1/subcategories/', { params });
  return res.data;
};

export const createSubcategory = async (axios, payload) => {
  const res = await axios.post('/api/v1/subcategories/', payload);
  return res.data;
};
