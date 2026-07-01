import React from "react";

const FormSection = ({ title, icon: Icon, children }) => {
  return (
    <div className="bg-[#1A1A1A] border border-[#262626] rounded-xl p-6 space-y-4">
      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-[#262626] pb-3">
        {Icon && <Icon size={14} className="text-[#00CE51]" />}
        <span>{title}</span>
      </h3>
      <div className="space-y-4 pt-1">
        {children}
      </div>
    </div>
  );
};

export default FormSection;
