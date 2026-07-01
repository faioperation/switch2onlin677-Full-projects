import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxios";
import { toast } from "react-toastify";

const AgentMessageSetup = ({ data }) => {

  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const [openingMessage, setOpeningMessage] = useState("");
  const [closingMessage, setClosingMessage] = useState("");

  // existing message show
  useEffect(() => {

    if (data) {
      setOpeningMessage(data?.opening_message || "");
      setClosingMessage(data?.closing_message || "");
    }

  }, [data]);

  const handleSubmit = async () => {

    if (!openingMessage.trim() || !closingMessage.trim()) {
      toast.error("Message cannot be empty ❌");
      return;
    }

    if (
      data &&
      openingMessage === data?.opening_message &&
      closingMessage === data?.closing_message
    ) {
      toast.info("No changes detected ⚠️");
      return;
    }

    try {

      const payload = {
        opening_message: openingMessage,
        closing_message: closingMessage
      };

      if (data?.id) {

        await axiosSecure.patch(
          "/api/v1/agent-behavior/",
          payload
        );

        // console.log("PATCH agent-behavior:", res.data);

        toast.success("Message has been changed ✅");

      } else {

        await axiosSecure.post(
          "/api/v1/agent-behavior/",
          payload
        );

        // console.log("POST agent-behavior:", res.data);

        toast.success("Message saved successfully 🎉");

      }

      queryClient.invalidateQueries(["agent-behavior"]);

    } catch {

      // console.log("Submit error:", err.response?.data);
      toast.error("Failed to save message ❌");

    }

  };

  return (

    <div className="bg-[#1A1A1A] border border-[#262626] rounded-xl p-3 md:p-6">

      <h3 className="text-white text-lg font-medium mb-4">
        Agent Message Setup
      </h3>

      <div className="space-y-4">

        <div>
          <p className="text-sm text-gray-400 mb-2">
            First Message
          </p>

          <textarea
            value={openingMessage}
            onChange={(e) => setOpeningMessage(e.target.value)}
            placeholder="Type message"
            className="w-full h-28 bg-[#111] border border-[#2A2A2A] rounded-lg p-3 text-white text-sm"
          />
        </div>

        <div>
          <p className="text-sm text-gray-400 mb-2">
            Closing Message
          </p>

          <textarea
            value={closingMessage}
            onChange={(e) => setClosingMessage(e.target.value)}
            placeholder="Type message"
            className="w-full h-28 bg-[#111] border border-[#2A2A2A] rounded-lg p-3 text-white text-sm"
          />
        </div>

        <button
          onClick={handleSubmit}
          className="btn-primary"
        >
          Save Message
        </button>

      </div>

    </div>

  );

};

export default AgentMessageSetup;