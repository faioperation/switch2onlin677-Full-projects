// src/api/categories.js
export const listCategories = async (axios, params = {}) => {
  const res = await axios.get('/api/v1/categories/', { params });
  return res.data;
};

export const createCategory = async (axios, payload) => {
  const res = await axios.post('/api/v1/categories/', payload);
  return res.data;
};
