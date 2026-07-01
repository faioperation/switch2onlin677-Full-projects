import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxios";
import { toast } from "react-toastify";

const tones = [
  { id: "friendly", title: "Friendly & Warm", desc: "Conversational and welcoming" },
  { id: "professional", title: "Professional", desc: "Formal and business-like" },
  { id: "sales", title: "Sales-Oriented", desc: "Persuasive and promotional" }
];

const TonePersonality = ({ data }) => {

  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const [selected, setSelected] = useState("friendly");

  useEffect(() => {

    if (data?.tone) {
      setSelected(data.tone);
    }

  }, [data]);

  const handleSelect = async (tone) => {

    if (tone === selected) {
      toast.info("No changes detected ⚠️");
      return;
    }

    try {

      const payload = { tone };

      if (data?.id) {

        await axiosSecure.patch(
          "/api/v1/agent-behavior/",
          payload
        );

        // console.log("PATCH tone:", res.data);

      } else {

        await axiosSecure.post(
          "/api/v1/agent-behavior/",
          payload
        );

        // console.log("POST tone:", res.data);

      }

      setSelected(tone);

      queryClient.invalidateQueries(["agent-behavior"]);

      toast.success("Tone updated successfully ✅");

    } catch (error) {

      // console.log("Tone update error:", error.response?.data);
      toast.error("Failed to update tone ❌");

    }

  };

  return (

    <div className="bg-[#1A1A1A] border border-[#262626] rounded-xl p-3 md:p-6">

      <h3 className="text-white text-lg font-medium mb-4">
        Tone & Personality
      </h3>

      <p className="text-sm text-gray-400 mb-4">
        Communication Style
      </p>

      <div className="space-y-3">

        {tones.map((tone) => (

          <div
            key={tone.id}
            onClick={() => handleSelect(tone.id)}
            className={`p-4 rounded-lg border cursor-pointer transition
            ${
              selected === tone.id
                ? "border-green-500 bg-[#1f2a23]"
                : "border-[#2A2A2A]"
            }`}
          >

            <div className="flex justify-between items-center">

              <div>

                <p className="text-white text-sm font-medium">
                  {tone.title}
                </p>

                <p className="text-xs text-gray-400">
                  {tone.desc}
                </p>

              </div>

              <div
                className={`w-4 h-4 rounded-full border
                ${
                  selected === tone.id
                    ? "bg-green-500 border-green-500"
                    : "border-gray-500"
                }`}
              />

            </div>

          </div>

        ))}

      </div>

    </div>

  );

};

export default TonePersonality;