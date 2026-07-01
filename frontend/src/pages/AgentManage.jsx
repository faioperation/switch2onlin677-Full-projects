import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../hooks/useAxios";
import Loader from "../components/Loader";

import AgentMessageSetup from "../components/agent/AgentMessageSetup";
import TonePersonality from "../components/agent/TonePersonality";

const AgentManage = () => {

  const axiosSecure = useAxiosSecure();

  const { data, isLoading } = useQuery({
    queryKey: ["agent-behavior"],
    queryFn: async () => {

      try {

        const res = await axiosSecure.get("/api/v1/agent-behavior/");
        // console.log("GET agent-behavior:", res.data);

        return res.data;

      } catch (error) {

        if (error.response?.status === 404) {
          return null;
        }

        throw error;

      }

    },
    retry: false
  });

  if (isLoading) {
    return <Loader />;
  }

  return (

    <div className="grid lg:grid-cols-2 gap-6">

      <AgentMessageSetup data={data} />

      <TonePersonality data={data} />

    </div>

  );

};

export default AgentManage;