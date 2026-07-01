// import axios from "axios";
// import { useEffect } from "react";
// import Cookies from "js-cookie";

// const axiosSecure = axios.create({
//   baseURL: "https://test11.fireai.agency",
// });

// const useAxiosSecure = () => {

//   useEffect(() => {

//     const interceptor = axiosSecure.interceptors.request.use((config) => {

//       const token = Cookies.get("accessToken");

//       if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//       }

//       return config;

//     });

//     return () => {
//       axiosSecure.interceptors.request.eject(interceptor);
//     };

//   }, []);

//   return axiosSecure;
// };

// export default useAxiosSecure;





import axios from "axios";
import Cookies from "js-cookie";

// Created once outside the hook so the interceptor is
// always attached — even before the first render fires.
const axiosSecure = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Attach the interceptor immediately (not inside useEffect)
axiosSecure.interceptors.request.use((config) => {
  // Check both Cookies and localStorage — works regardless of where AuthProvider saves it
  const token = Cookies.get("accessToken") || localStorage.getItem("accessToken");

  // Required to bypass the ngrok browser warning page
  config.headers["ngrok-skip-browser-warning"] = "true";

  // Attach Bearer token if available
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

const useAxiosSecure = () => {
  return axiosSecure;
};

export default useAxiosSecure;