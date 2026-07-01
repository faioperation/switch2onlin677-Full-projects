import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "./useAxios";

export const TERMINAL_STATUSES = new Set(["completed", "failed", "cancelled"]);

export function isTerminalStatus(status) {
  return TERMINAL_STATUSES.has(status);
}

export function useUploadJob(jobId) {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["upload-job", jobId],
    enabled: !!jobId,
    queryFn: async () => {
      const res = await axiosSecure.get(`/api/v1/products/uploads/${jobId}/`);
      // Response shape: { success: true, data: { job_id, filename, status, ... } }
      return res.data?.data ?? res.data;
    },
    // Stop polling automatically when job reaches a terminal state
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      if (TERMINAL_STATUSES.has(status)) return false;
      return 3000;
    },
    staleTime: 0,
    retry: 2,
    retryDelay: 2000,
  });

  // Invalidate history cache when job finishes so the table updates automatically
  useEffect(() => {
    if (isTerminalStatus(query.data?.status)) {
      queryClient.invalidateQueries({ queryKey: ["upload-history"] });
    }
  }, [query.data?.status, queryClient]);

  return query;
}
