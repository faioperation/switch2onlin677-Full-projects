import React from "react";

const TextAreaField = ({ label, name, register, error, icon: Icon, required, ...props }) => {
  return (
    <div className="space-y-1.5 w-full text-left">
      <label htmlFor={name} className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
        {Icon && <Icon size={14} className="text-[#00CE51]" />}
        <span>{label} {required && <span className="text-red-500">*</span>}</span>
      </label>
      <textarea
        id={name}
        {...register(name)}
        {...props}
        className="bg-[#0B0B0B] border border-[#262626] text-white text-sm rounded-lg focus:ring-1 focus:ring-[#00CE51] focus:border-[#00CE51] block w-full p-3 outline-none transition-all resize-none leading-relaxed"
        aria-describedby={error ? `${name}-error` : undefined}
      />
      {error && (
        <span id={`${name}-error`} className="text-xs text-red-500 block pt-0.5">
          {error.message}
        </span>
      )}
    </div>
  );
};

export default TextAreaField;
