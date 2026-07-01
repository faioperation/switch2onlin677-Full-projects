const DateSeparator = ({ label }) => (
  <div className="flex items-center gap-3 my-1 px-2 select-none">
    <div className="flex-1 h-px bg-[#262626]" />
    <span className="text-xs text-gray-500 font-medium px-3 py-1 rounded-full bg-[#262626] whitespace-nowrap">
      {label}
    </span>
    <div className="flex-1 h-px bg-[#262626]" />
  </div>
);

export default DateSeparator;
