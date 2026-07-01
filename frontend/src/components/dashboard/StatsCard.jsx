import React from "react";

const StatsCard = ({ title, value, change, positive, icon }) => {
  return (
    <div className="bg-[#1A1A1A] rounded-xl p-5 flex flex-col gap-3 border border-[#262626]">

      <div className="flex items-center justify-between">
        <p className="text-sm text-[#BFBFBF]">{title}</p>

        <div className="p-2 rounded-lg bg-[#262626]">
          {icon}
        </div>
      </div>

      <h2 className="text-2xl font-semibold text-white">
        {value}
      </h2>

      <div className="flex items-center gap-2 text-xs">

        <span
          className={`px-2 py-1 rounded ${
            positive
              ? "text-[#00CE51] bg-[#00CE51]/10"
              : "text-red-400 bg-red-400/10"
          }`}
        >
          {change}
        </span>

        <span className="text-gray-500">
          From last Days
        </span>

      </div>
    </div>
  );
};

export default StatsCard;