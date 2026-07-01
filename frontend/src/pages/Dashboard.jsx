import React from "react";
import StatsCard from "../components/dashboard/StatsCard";
import ConversationChart from "../components/dashboard/ConversationChart";
import PlatformChart from "../components/dashboard/PlatformChart";
import RecentConversation from "../components/dashboard/RecentConversation";
import TrendingProducts from "../components/dashboard/TrendingProducts";
import useAxiosSecure from "../hooks/useAxios";
import { useQuery } from "@tanstack/react-query";

import { MessageSquare, MessageCircle, Users, UserPlus, Loader2 } from "lucide-react";

const Dashboard = () => {
  const axiosSecure = useAxiosSecure();

  const { data: stats, isLoading, isError } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const res = await axiosSecure.get("/api/v1/dashboard/stats/");
      return res.data;
    },
  });

  console.log("dashboard stats data : ", stats);

  if (isLoading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#00CE51]" size={40} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="h-[60vh] flex items-center justify-center text-red-500 font-medium">
        Failed to load dashboard data. Please try again.
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

        <StatsCard
          title="Total Conversations"
          value={stats?.total_conversations || 0}
          change="Updated"
          positive
          icon={<MessageSquare size={18} className="text-purple-400" />}
        />

        <StatsCard
          title="Today's Conversations"
          value={stats?.today_conversations || 0}
          change="Real-time"
          positive
          icon={<MessageCircle size={18} className="text-yellow-400" />}
        />

        <StatsCard
          title="Total Leads"
          value={stats?.total_leads || 0}
          change="Overall"
          positive
          icon={<Users size={18} className="text-blue-400" />}
        />

        <StatsCard
          title="Today's Leads"
          value={stats?.today_leads || 0}
          change="New"
          positive
          icon={<UserPlus size={18} className="text-green-400" />}
        />

      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <div className="lg:col-span-2">
          <ConversationChart chartData={stats?.conversations_last_7_days} />
        </div>

        <PlatformChart distributionData={stats?.platform_distribution} />

      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <RecentConversation />

        <TrendingProducts />

      </div>

    </div>
  );
};

export default Dashboard;
