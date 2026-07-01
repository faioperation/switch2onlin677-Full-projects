import React, { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Cell,
} from "recharts";

const ConversationChart = ({ chartData }) => {
  const [activeIndex, setActiveIndex] = useState(null);

  // Transform object data from API { "Mon": 10, ... } to array [{ day: "Mon", value: 10 }, ...]
  const data = useMemo(() => {
    if (!chartData) return [];
    
    // Custom order to ensure days follow a logical sequence if needed, 
    // or just use keys from API. Let's follow a standard week starting Mon.
    // const order = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    
  //   return order.map(day => ({
  //     day,
  //     value: chartData[day] || 0
  //   }));
  // }, [chartData]);

  return chartData
    ? Object.entries(chartData).map(([day, value]) => ({ day, value }))
    : [];
  }, [chartData]);

  const maxValue = useMemo(() => {
    if (!data.length) return 100;
    const max = Math.max(...data.map(d => d.value));
    return max > 0 ? Math.ceil(max / 10) * 10 + 10 : 100; // Dynamic scale with some padding
  }, [data]);

  // console.log("Chart Data:", data);

  return (
    <div className="bg-[#1A1A1A] rounded-xl p-3 md:p-6 border border-[#262626] w-full">

      <h3 className="text-white mb-6 font-medium">
        Conversation (Last 7 Days)
      </h3>

      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data}>

          <XAxis
            dataKey="day"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#9CA3AF", fontSize: 12 }}
          />

          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#9CA3AF", fontSize: 12 }}
            domain={[0, maxValue]}
            allowDecimals={false}
          />

          <Tooltip 
            cursor={{ fill: "rgba(255,255,255,0.05)" }} 
            contentStyle={{ backgroundColor: "#262626", border: "1px solid #333", borderRadius: "8px" }}
            itemStyle={{ color: "#00CE51" }}
          />

          <Bar
            dataKey="value"
            radius={[6, 6, 0, 0]}
            barSize={28}
            onMouseLeave={() => setActiveIndex(null)}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={activeIndex === index ? "#00CE51" : "#3B8056"}
                onMouseEnter={() => setActiveIndex(index)}
              />
            ))}
          </Bar>

        </BarChart>
      </ResponsiveContainer>

    </div>
  );
};

export default ConversationChart;
