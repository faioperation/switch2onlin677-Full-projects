import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "./useAxios";

export function useUploadHistory() {
  const axiosSecure = useAxiosSecure();

  return useQuery({
    queryKey: ["upload-history"],
    queryFn: async () => {
      const res = await axiosSecure.get("/api/v1/products/uploads/", {
        params: { limit: 100 },
      });
      // Response shape: { success: true, data: { jobs: [...], pagination: {...} } }
      const raw = res.data;
      if (raw?.data?.jobs) return raw.data.jobs;
      if (Array.isArray(raw)) return raw;
      return raw?.results ?? [];
    },
    staleTime: 30_000,
    retry: 2,
  });
}
