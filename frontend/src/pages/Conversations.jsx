import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router";
import useAxiosSecure from "../hooks/useAxios";

import ConversationList from "../components/conversation/ConversationList";
import ChatHeader from "../components/conversation/ChatHeader";
import ChatMessages from "../components/conversation/ChatMessages";
import Loader from "../components/Loader";

const Conversations = () => {

  const axiosSecure = useAxiosSecure();
  const [selectedUser, setSelectedUser] = useState(null);
  const [showMobileChat, setShowMobileChat] = useState(false);

  // Read ?sender_id= from URL (set when navigating from Leads page)
  const [searchParams] = useSearchParams();
  const targetSenderId = searchParams.get("sender_id");

  /* ======================
      GET ALL SENDERS
  ====================== */

  const { data: conversations = [], isLoading } = useQuery({
    queryKey: ["conversations"],
    retry: false, // don't retry — a failure should show the page, not hang it
    queryFn: async () => {
      const res = await axiosSecure.get("/api/v1/conversation/senders/");
      // console.log("API RAW:", res.data);
      // API returns a paginated response: { count, next, results: [...] }
      const sendersList = res.data || [];
      // console.log("Senders List:", sendersList);

      const sendersWithLastMessage = await Promise.all(
        sendersList.map(async (item) => {
          let lastMessageText = "No messages yet";

          try {
            // Timeout after 5s so one slow sender doesn't block the list
            const timeoutPromise = new Promise((_, reject) =>
              setTimeout(() => reject(new Error("timeout")), 5000)
            );
            const fetchPromise = axiosSecure.get(
              `/api/v1/conversation/senders/${item.id}/messages/`
            );
            const msgRes = await Promise.race([fetchPromise, timeoutPromise]);
            const msgs = msgRes.data;

            if (msgs && msgs.length > 0) {
              const lastMsg = msgs[msgs.length - 1];
              if (lastMsg.message_type === "image") {
                lastMessageText = "📷 Image";
              } else if (lastMsg.message_type === "video") {
                lastMessageText = "🎥 Video";
              } else if (lastMsg.message_type === "file" || lastMsg.message_type === "pdf") {
                lastMessageText = "📄 Document";
              } else {
                lastMessageText = lastMsg.text_content || "Unsupported message";
              }
            }
          } catch {
            // fallback — don't block the list
          }

          return {
            id: item.id,
            sender_id: item.sender_id, // keep original sender_id for matching from Leads
            name: item.full_name || "User",
            platform: item.platform,
            time: item.last_interaction
              ? new Date(item.last_interaction).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })
              : "",
            initial: (item.full_name || "U").charAt(0).toUpperCase(),
            lastMessage: lastMessageText,
          };
        })
      );

      return sendersWithLastMessage;
    }
  });


  // GET MESSAGES


  const { data: messages = [], isLoading: msgLoading } = useQuery({
    queryKey: ["messages", selectedUser?.id],
    enabled: !!selectedUser?.id,
    queryFn: async () => {

      const res = await axiosSecure.get(
        `/api/v1/conversation/senders/${selectedUser.id}/messages/`
      );
      // console.log("Messages Response:", res.data);

      return res.data.map((msg) => ({

        id: msg.id,
        text: msg.text_content,
        media: msg.media_url,
        messageType: msg.message_type,

        type: msg.is_from_customer ? "received" : "sent",

        rawTimestamp: msg.timestamp ?? null,

        time: msg.timestamp
          ? new Date(msg.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
          : "",

      }));
    }
  });

  // Auto-select conversation:
  // If ?sender_id= in URL → match by sender_id (coming from Leads page)
  // Otherwise → default to the first conversation
  useEffect(() => {
    if (!conversations.length) return;

    if (targetSenderId) {
      const match = conversations.find((c) => c.sender_id === targetSenderId);
      if (match) {
        setSelectedUser(match);
        setShowMobileChat(true);
        return;
      }
    }

    // Default: select first conversation
    if (!selectedUser) {
      setSelectedUser(conversations[0]);
    }
  }, [conversations, targetSenderId]);

  if (isLoading) return <Loader />;

  const activeUser = selectedUser;

  // console.log("Selected User:", activeUser);
  // console.log("Messages:", messages);
  // console.log("Messages:", messages);

  return (

    <div className="h-[calc(100dvh-80px)] md:h-[calc(100vh-100px)] -m-6 md:m-0">

      <div className="h-full bg-[#1A1A1A] md:border border-[#262626] md:rounded-xl overflow-hidden flex flex-col md:flex-row">

        {/* LEFT: Conversation List */}
        <div className={`w-full md:w-[350px] lg:w-[400px] md:border-r border-[#262626] md:h-full overflow-y-auto ${showMobileChat ? "hidden md:block" : "h-full"}`}>
          <ConversationList
            conversations={conversations}
            selectedUser={activeUser}
            setSelectedUser={(user) => {
              setSelectedUser(user);
              setShowMobileChat(true);
            }}
          />
        </div>

        {/* RIGHT: Chat */}
        <div className={`flex-col flex-1 md:h-full border-t border-[#00CE51] md:border-none ${showMobileChat ? "flex h-full" : "hidden md:flex h-full"}`}>

          {activeUser && (
            <>
              <ChatHeader user={activeUser} onBack={() => setShowMobileChat(false)} />

              <div className="flex-1 flex flex-col min-h-0">
                {msgLoading ? (
                  <Loader />
                ) : (
                  <ChatMessages messages={messages} selectedUserId={activeUser.id} />
                )}
              </div>
            </>
          )}

        </div>

      </div>

    </div>
  );
};

export default Conversations;