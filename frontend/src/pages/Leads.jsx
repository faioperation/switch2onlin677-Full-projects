import React, { useState, useEffect } from "react";
import { useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import LeadsHeader from "../components/leads/LeadsHeader";
import LeadsTable from "../components/leads/LeadsTable";
import LeadsPagination from "../components/leads/LeadsPagination";
import useAxiosSecure from "../hooks/useAxios";
import Swal from "sweetalert2";

const Leads = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [platform, setPlatform] = useState("all");
  const [page, setPage] = useState(1);
  const limit = 10;

  // Debounced search — waits 500ms after user stops typing before hitting API
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // reset to page 1 on new search
    }, 1000);
    return () => clearTimeout(timer);
  }, [search]);

  // Reset page to 1 when platform filter changes
  const handlePlatformChange = (value) => {
    setPlatform(value);
    setPage(1);
  };

  /* ===========================
     📡 Fetch Leads from Backend
  =========================== */

  const { data, isLoading, isError } = useQuery({
    queryKey: ["leads", page, debouncedSearch, platform],
    queryFn: async () => {
      // Build query params — only include what's needed
      const params = { page };

      if (debouncedSearch) {
        params.search = debouncedSearch;
      }

      if (platform !== "all") {
        params.sender__platform = platform;
      }

      const res = await axiosSecure.get("/api/v1/leads", { params });
      return res.data;
    },
    placeholderData: keepPreviousData,
  });

  const leads = data?.results || [];
  const total = data?.count || 0;
  const totalPages = Math.ceil(total / limit);

  /* ===========================
     🗑️ Delete Lead
  =========================== */

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This lead will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#00CE51",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosSecure.delete(`/api/v1/leads/${id}/`);
          queryClient.invalidateQueries(["leads"]);
          Swal.fire({ title: "Deleted!", text: "Lead has been deleted.", icon: "success" });
        } catch {
          Swal.fire({ title: "Error!", text: "Failed to delete lead.", icon: "error" });
        }
      }
    });
  };

  /* ===========================
     📥 CSV Export
  =========================== */

  // Fetches ALL pages from the API and downloads as one CSV file
  const exportCSV = async () => {
    try {
      let allLeads = [];
      let nextPage = 1;
      let hasMore = true;

      // Keep fetching pages until the API says there's no more
      while (hasMore) {
        const res = await axiosSecure.get("/api/v1/leads", {
          params: { page: nextPage },
        });

        allLeads = [...allLeads, ...res.data.results];

        if (res.data.next) {
          nextPage++;
        } else {
          hasMore = false;
        }
      }

      if (!allLeads.length) return;

      const headers = ["Name", "Product", "Date", "Platform"];
      const rows = allLeads.map((lead) => [
        lead.name,
        lead.interested_product || "",
        new Date(lead.date).toLocaleString(),
        lead.platform,
      ]);

      const csvContent =
        "data:text/csv;charset=utf-8," +
        [headers, ...rows].map((row) => row.join(",")).join("\n");

      const link = document.createElement("a");
      link.setAttribute("href", encodeURI(csvContent));
      link.setAttribute("download", `leads-all-${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } catch {
      Swal.fire({ title: "Export Failed", text: "Could not download leads. Try again.", icon: "error" });
    }
  };

  /* ===========================
     🖼️ Loading / Error States
  =========================== */

  // Only show the full-page loader on the VERY first load (when no data exists)
  if (isLoading && !data) {
    return (
      <div className="bg-[#1A1A1A] border border-[#262626] rounded-xl p-10 text-center text-gray-400">
        Loading leads...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-[#1A1A1A] border border-[#262626] rounded-xl p-10 text-center text-red-400">
        Failed to load leads. Please check the API or your connection.
      </div>
    );
  }

  const triggerSearch = () => {
    setDebouncedSearch(search);
    setPage(1);
  };

  return (
    <div className={`space-y-6 transition-opacity duration-200 ${data && isLoading ? "opacity-50 pointer-events-none" : "opacity-100"}`}>
      <div className="bg-[#1A1A1A] border border-[#262626] rounded-xl p-6">

        {/* Header — search & filter passed to backend */}
        <LeadsHeader
          search={search}
          setSearch={setSearch}
          platform={platform}
          setPlatform={handlePlatformChange}
          onExport={exportCSV}
          onSearchTrigger={triggerSearch}
        />

        {/* Table */}
        <LeadsTable data={leads} onDelete={handleDelete} page={page} limit={limit} />

        {/* Pagination — driven by backend count */}
        <LeadsPagination
          page={page}
          setPage={setPage}
          totalPages={totalPages}
          total={total}
          limit={limit}
        />

      </div>
    </div>
  );
};

export default Leads;