import { ArrowLeft } from "lucide-react";

const ChatHeader = ({ user, onBack }) => {

  return (
    <div className="flex items-center gap-3 p-4 border-b border-[#262626]">

      <button
        onClick={onBack}
        className="md:hidden text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft size={18} />
      </button>

      <div className="w-10 h-10 rounded-full bg-[#2A2A2A] flex items-center justify-center text-white">
        {user.initial}
      </div>

      <div>
        <p className="text-white text-sm font-medium">
          {user.name}
        </p>

        <p className="text-xs text-green-400">
          {user.platform}
        </p>
      </div>

    </div>
  );
};

export default ChatHeader;