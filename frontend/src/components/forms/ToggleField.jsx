import React from "react";
import { Controller } from "react-hook-form";

const ToggleField = ({ label, name, control, icon: Icon }) => {
  return (
    <div className="flex items-center justify-between p-4 bg-[#0B0B0B] border border-[#222] rounded-lg w-full text-left">
      <div className="flex items-center gap-3">
        {Icon && (
          <div className="p-2 bg-white/5 text-gray-400 rounded-lg">
            <Icon size={16} />
          </div>
        )}
        <div>
          <label htmlFor={name} className="text-xs font-bold text-gray-400 uppercase tracking-wider block cursor-pointer select-none">
            {label}
          </label>
        </div>
      </div>
      
      <Controller
        name={name}
        control={control}
        render={({ field: { value, onChange } }) => (
          <button
            id={name}
            type="button"
            onClick={() => onChange(value === 1 ? 0 : 1)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer outline-none focus:ring-1 focus:ring-[#00CE51] ${
              value === 1 ? "bg-[#00CE51]" : "bg-[#262626]"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-[#0a0a0a] transition-transform ${
                value === 1 ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        )}
      />
    </div>
  );
};

export default ToggleField;
