import React from "react";

const NumberField = ({ label, name, register, error, icon: Icon, prefix, required, ...props }) => {
  return (
    <div className="space-y-1.5 w-full text-left">
      <label htmlFor={name} className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
        {Icon && <Icon size={14} className="text-[#00CE51]" />}
        <span>{label} {required && <span className="text-red-500">*</span>}</span>
      </label>
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-semibold select-none">
            {prefix}
          </span>
        )}
        <input
          id={name}
          type="number"
          {...register(name, { valueAsNumber: true })}
          {...props}
          className={`bg-[#0B0B0B] border border-[#262626] text-white text-sm rounded-lg focus:ring-1 focus:ring-[#00CE51] focus:border-[#00CE51] block w-full p-3 outline-none transition-all font-mono ${
            prefix ? "pl-7" : ""
          }`}
          aria-describedby={error ? `${name}-error` : undefined}
        />
      </div>
      {error && (
        <span id={`${name}-error`} className="text-xs text-red-500 block pt-0.5">
          {error.message}
        </span>
      )}
    </div>
  );
};

export default NumberField;
