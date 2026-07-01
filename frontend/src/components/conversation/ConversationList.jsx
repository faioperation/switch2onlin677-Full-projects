import { useState } from "react";
import { Search } from "lucide-react";
import ConversationItem from "./ConversationItem";

const ConversationList = ({
  conversations,
  selectedUser,
  setSelectedUser,
}) => {

  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

const filtered = conversations.filter((item) => {

  const name = item.name || ""; 
  const matchSearch = name
    .toLowerCase()
    .includes(search.toLowerCase());

  const matchFilter =
    filter === "All" || item.platform === filter;

  return matchSearch && matchFilter;
});

  return (
    <div className="flex flex-col h-full">

      <div className="p-4 border-b border-[#262626]">

        <h3 className="text-white font-medium text-2xl mb-3">
          Conversations
        </h3>

        {/* Search */}
        <div className="relative mb-3">

          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search"
            className="w-full bg-white/3 border border-[#2A2A2A] rounded-lg pl-9 pr-3 py-2 text-sm text-white"
          />

        </div>

        {/* Filters */}
        <div className="flex gap-2 text-xs overflow-x-auto pb-2">

          {["All", "facebook", "instagram", "whatsapp"].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-3 py-1 rounded-full ${
                filter === type
                  ? "bg-[#00CE51] text-white"
                  : "bg-[#262626] text-gray-400"
              }`}
            >
              {type}
            </button>
          ))}

        </div>

      </div>

      <div>
        {filtered.map((item) => (
          <ConversationItem
            key={item.id}
            item={item}
            selected={selectedUser?.id === item.id}
            onClick={() => setSelectedUser(item)}
          />
        ))}
      </div>

    </div>
  );
};

export default ConversationList;