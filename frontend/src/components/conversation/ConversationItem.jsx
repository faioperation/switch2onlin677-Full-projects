import { Facebook, Instagram, MessageCircle } from "lucide-react";

const icons = {
  facebook: <Facebook size={14} className="text-blue-400" />,
  instagram: <Instagram size={14} className="text-pink-400" />,
  whatsapp: <MessageCircle size={14} className="text-green-400" />,
};

const ConversationItem = ({ item, selected, onClick }) => {

  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 p-4 cursor-pointer
      ${selected ? "bg-[#2A2A2A]" : "hover:bg-[#202020]"}`}
    >

      <div className="w-10 h-10 rounded-full bg-[#2A2A2A] flex items-center justify-center text-white">
        {item.initial}
      </div>

      <div className="flex-1 min-w-0">

        <div className="flex items-center gap-2 mb-1">
          <p className="text-sm text-white truncate">{item.name}</p>
          <div className="flex-shrink-0">
            {icons[item.platform]}
          </div>
        </div>

        <p className="text-xs text-gray-500 truncate">
          {item.lastMessage}
        </p>

      </div>

      <span className="text-xs text-gray-500">
        {item.time}
      </span>

    </div>
  );
};

export default ConversationItem;