import { Search, Download } from "lucide-react";

const LeadsHeader = ({ search, setSearch, platform, setPlatform, onExport, onSearchTrigger }) => {
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      onSearchTrigger?.();
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">

      {/* Search — left side */}
      <div className="relative">
        <Search
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
        />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search by name..."
          className="w-full sm:w-80 bg-[#111] border border-[#2A2A2A] rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#00CE51] transition-colors"
        />
      </div>

      {/* Filter + Export — right side */}
      <div className="flex items-center gap-3">

        {/* Platform filter */}
        <select
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
          className="bg-[#111] border border-[#2A2A2A] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#00CE51] transition-colors cursor-pointer"
        >
          <option value="all">All Platforms</option>
          <option value="facebook">Facebook</option>
          <option value="instagram">Instagram</option>
          <option value="whatsapp">WhatsApp</option>
        </select>

        {/* Export CSV */}
        <button
          onClick={onExport}
          className="flex items-center gap-2 bg-[#00CE51] hover:bg-[#00b847] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
        >
          <Download size={15} />
          Export CSV
        </button>

      </div>
    </div>
  );
};

export default LeadsHeader;