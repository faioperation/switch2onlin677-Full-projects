import { useState } from "react";
import { X, FileText, Download } from "lucide-react";

const ChatBubble = ({ message, onImageLoad }) => {

  const isSent = message.type === "sent";
  const [isModalOpen, setIsModalOpen] = useState(false);

  const renderContent = () => {

    // ✅ TEXT
    if (message.messageType === "text") {
      return message.text || "No message";
    }

    // ✅ IMAGE
    if (message.messageType === "image" && message.media) {
      return (
        <>
          <img
            src={message.media}
            alt="img"
            onLoad={onImageLoad}
            className="rounded-lg max-w-[250px] md:max-w-[350px] max-h-[250px] md:max-h-[350px] w-full cursor-pointer object-cover object-top hover:opacity-90 transition-opacity"
            onClick={(e) => {
              e.stopPropagation();
              setIsModalOpen(true);
            }}
          />
          {isModalOpen && (
            <div
              className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 p-4"
              onClick={() => setIsModalOpen(false)}
            >
              <button
                className="absolute top-4 right-4 md:top-6 md:right-6 text-white/70 hover:text-white bg-black/40 hover:bg-black/70 rounded-full p-2 transition-all z-10"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsModalOpen(false);
                }}
              >
                <X size={28} />
              </button>
              <img
                src={message.media}
                alt="fullscreen"
                className="max-w-full max-h-[90vh] object-contain rounded-lg cursor-zoom-out shadow-2xl"
              />
            </div>
          )}
        </>
      );
    }

    // ✅ VIDEO
    if (message.messageType === "video" && message.media) {
      return (
        <video
          src={message.media}
          controls
          className="rounded-lg max-w-[300px] md:max-w-[450px] w-full h-auto bg-black"
        />
      );
    }

    // ✅ file / DOCUMENT
    if (
      message.messageType === "document" ||
      message.messageType === "file"
    ) {
      return (
        <a
          href={message.media}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-3 bg-black/10 hover:bg-black/20 p-2 rounded-lg transition-colors min-w-[200px]"
        >
          <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
            <FileText size={20} />
          </div>
          <div className="flex flex-col flex-1 min-w-0">
            <span className="font-medium text-sm truncate">Document</span>
            <span className="text-xs opacity-70">Click to open</span>
          </div>
          <Download size={16} className="opacity-70 mx-1" />
        </a>
      );
    }

    // ✅ FALLBACK
    return "Unsupported message";
  };

  return (

    <div className={`flex ${isSent ? "justify-end" : "justify-start"}`}>

      <div className="flex flex-col max-w-[90%] md:max-w-[75%]">

        <div
          className={`rounded-xl text-sm
          ${(message.messageType === "image" || message.messageType === "video") ? "p-1" : "px-4 py-3"}
          ${isSent
              ? "bg-[#3B8056] text-white"
              : "bg-[#2A2A2A] text-gray-200"
            }`}
        >
          {renderContent()}
        </div>

        <span className="text-xs text-gray-500 mt-1">
          {message.time}
        </span>

      </div>

    </div>

  );
};

export default ChatBubble;