import React, { useState } from "react";
import { Controller } from "react-hook-form";
import { X } from "lucide-react";

const TagInputField = ({ label, name, control, presets = [], placeholder = "Type tag and press Enter...", icon: Icon }) => {
  const [inputValue, setInputValue] = useState("");

  return (
    <div className="space-y-1.5 w-full text-left">
      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
        {Icon && <Icon size={14} className="text-[#00CE51]" />}
        <span>{label}</span>
      </label>
      
      <Controller
        name={name}
        control={control}
        defaultValue={[]}
        render={({ field: { value = [], onChange } }) => {
          const addTag = (tag) => {
            const trimmed = tag.trim().toLowerCase();
            if (trimmed && !value.includes(trimmed)) {
              onChange([...value, trimmed]);
            }
          };

          const removeTag = (tagToRemove) => {
            onChange(value.filter((t) => t !== tagToRemove));
          };

          const handleKeyDown = (e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              addTag(inputValue);
              setInputValue("");
            }
          };

          return (
            <div className="space-y-2.5">
              <div className="bg-[#0B0B0B] border border-[#262626] rounded-lg p-2.5 min-h-[50px] flex flex-wrap gap-2 items-center focus-within:ring-1 focus-within:ring-[#00CE51] focus-within:border-[#00CE51] transition-all">
                {value.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#00CE51]/10 text-[#00CE51] text-xs font-semibold border border-[#00CE51]/20"
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="hover:bg-[#00CE51]/20 rounded-full p-0.5 transition-colors cursor-pointer text-[#00CE51]"
                    >
                      <X size={10} />
                    </button>
                  </span>
                ))}
                
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={value.length === 0 ? placeholder : ""}
                  className="bg-transparent border-none text-white text-sm outline-none flex-grow min-w-[120px]"
                />
              </div>

              {presets.length > 0 && (
                <div className="flex flex-wrap gap-1.5 items-center">
                  <span className="text-[10px] text-gray-500 font-extrabold uppercase tracking-wider select-none">Presets:</span>
                  {presets.map((preset) => {
                    const isSelected = value.includes(preset);
                    return (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => isSelected ? removeTag(preset) : addTag(preset)}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded transition-all cursor-pointer border ${
                          isSelected
                            ? "bg-[#00CE51]/20 text-[#00CE51] border-[#00CE51]/40"
                            : "bg-white/5 text-gray-400 border-white/10 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        {preset}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        }}
      />
    </div>
  );
};

export default TagInputField;
