import React, { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip
} from "recharts";

const PlatformChart = ({ distributionData }) => {
  
  const data = useMemo(() => {
    if (!distributionData) return [];
    
    // The API might return an array with one object or just the object itself
    const dist = Array.isArray(distributionData) ? distributionData[0] : distributionData;
    
    if (!dist || typeof dist !== 'object') return [];

    const colors = {
      whatsapp: "#22C55E",
      instagram: "#F472B6",
      facebook: "#38BDF8"
    };

    return Object.entries(dist).map(([key, val]) => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      value: typeof val === 'number' ? parseFloat(val.toFixed(1)) : 0,
      color: colors[key.toLowerCase()] || "#8884d8"
    }));
  }, [distributionData]);

  const totalValue = useMemo(() => data.reduce((acc, curr) => acc + curr.value, 0), [data]);


  return (
    <div className="bg-[#1A1A1A] rounded-xl p-6 lg:p-8 border border-[#262626] w-full h-full flex flex-col justify-center">

      <h3 className="text-white mb-6 font-medium">
        Platform Distribution
      </h3>

      <div className="grid grid-cols-1 xl:grid-cols-[180px_1fr] items-center gap-6">

        {/* Chart */}
        <div className="w-full h-[180px] max-w-[180px] mx-auto xl:mx-0">
          {data.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={totalValue > 0 ? data : [{ value: 1 }]}
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={totalValue > 0 ? 5 : 0}
                  dataKey="value"
                  stroke="none"
                >
                  {totalValue > 0 ? (
                    data.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))
                  ) : (
                    <Cell fill="#262626" />
                  )}
                </Pie>
                {totalValue > 0 && (
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#262626", border: "1px solid #333", borderRadius: "8px" }}
                    itemStyle={{ color: "#fff" }}
                  />
                )}
              </PieChart>
            </ResponsiveContainer>
          ) : (

            <div className="h-full flex items-center justify-center text-gray-500 text-sm">
              No Data
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="flex flex-col gap-3 w-full">
          {data.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between text-sm"
            >
              <div className="flex items-center gap-3">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ background: item.color }}
                />
                <span className="text-[#BFBFBF]">
                  {item.name}
                </span>
              </div>

              <span className="text-gray-400 font-medium">
                {item.value}%
              </span>
            </div>
          ))}
          {data.length === 0 && <p className="text-gray-600 text-sm italic">Waiting for platform data...</p>}
        </div>

      </div>

    </div>
  );
};

export default PlatformChart;