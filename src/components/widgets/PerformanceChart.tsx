import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { BarChart } from "lucide-react";
import { ChartDataPoint, PerformanceChartProps, ViewMode } from "../types";
import { useNotifStore } from "../../stores/notification";
import useAuth from "../../hooks/useAuth";

const PerformanceChart: React.FC<PerformanceChartProps> = ({
  title = "Performance Overview",
  subtitle = "Scraping and enrichment metrics",
}) => {
  const [performanceData, setPerformanceData] = useState<ChartDataPoint[]>([]);
  const { getallMetricsData } = useNotifStore();

  const [viewMode, setViewMode] = useState<ViewMode>("both");
  const [chartHeight, setChartHeight] = useState(350);
  const hasData = performanceData && performanceData.length > 0;
  const { user } = useAuth();

  useEffect(() => {
    const getMetrics = async () => {
      let data: ChartDataPoint[];
      if (user) {
        data = await getallMetricsData(user?.id);
      } else {
        data = [];
      }
      setPerformanceData(data);
    };

    const updateChartHeight = () => {
      if (window.innerWidth < 640) {
        setChartHeight(250);
      } else if (window.innerWidth < 1024) {
        setChartHeight(300);
      } else {
        setChartHeight(350);
      }
    };

    window.addEventListener("resize", updateChartHeight);
    updateChartHeight();
    getMetrics();
    return () => window.removeEventListener("resize", updateChartHeight);
  }, []);

  const calculatePercentage = (value: number, total: number) => {
    return total > 0 ? Math.round((value / total) * 100) : 0;
  };

  const getChartLines = () => {
    const lines = [];

    if (viewMode === "both" || viewMode === "scraping") {
      const scrapingTotal =
        performanceData.length > 0
          ? performanceData[performanceData.length - 1].scraping.completed +
            performanceData[performanceData.length - 1].scraping.failed +
            performanceData[performanceData.length - 1].scraping.pending
          : 0;

      lines.push(
        <Line
          key="scraping-completed"
          type="monotone"
          dataKey="scraping.completed"
          name={`● Scraping Completed (${calculatePercentage(
            performanceData[performanceData.length - 1]?.scraping.completed ||
              0,
            scrapingTotal
          )}%)`}
          stroke="#0EA5E9"
          strokeWidth={2.5}
          dot={{ r: 4, fill: "#0EA5E9" }}
          activeDot={{
            r: 6,
            stroke: "#0EA5E9",
            strokeWidth: 2,
            fill: "#0EA5E9",
          }}
        />,
        <Line
          key="scraping-failed"
          type="monotone"
          dataKey="scraping.failed"
          name={`● Scraping Failed (${calculatePercentage(
            performanceData[performanceData.length - 1]?.scraping.failed || 0,
            scrapingTotal
          )}%)`}
          stroke="#F43F5E"
          strokeWidth={2.5}
          dot={{ r: 4, fill: "#F43F5E" }}
          activeDot={{
            r: 6,
            stroke: "#F43F5E",
            strokeWidth: 2,
            fill: "#F43F5E",
          }}
        />,
        <Line
          key="scraping-pending"
          type="monotone"
          dataKey="scraping.pending"
          name={`● Scraping Pending (${calculatePercentage(
            performanceData[performanceData.length - 1]?.scraping.pending || 0,
            scrapingTotal
          )}%)`}
          stroke="#F59E0B"
          strokeWidth={2.5}
          dot={{ r: 4, fill: "#F59E0B" }}
          activeDot={{
            r: 6,
            stroke: "#F59E0B",
            strokeWidth: 2,
            fill: "#F59E0B",
          }}
        />
      );
    }

    if (viewMode === "both" || viewMode === "enrichment") {
      const enrichmentTotal =
        performanceData.length > 0
          ? performanceData[performanceData.length - 1].enrichment.completed +
            performanceData[performanceData.length - 1].enrichment.failed +
            performanceData[performanceData.length - 1].enrichment.pending
          : 0;

      lines.push(
        <Line
          key="enrichment-completed"
          type="monotone"
          dataKey="enrichment.completed"
          name={`● Enrichment Completed (${calculatePercentage(
            performanceData[performanceData.length - 1]?.enrichment.completed ||
              0,
            enrichmentTotal
          )}%)`}
          stroke="#10B981"
          strokeWidth={2.5}
          dot={{ r: 4, fill: "#10B981" }}
          activeDot={{
            r: 6,
            stroke: "#10B981",
            strokeWidth: 2,
            fill: "#10B981",
          }}
        />,
        <Line
          key="enrichment-failed"
          type="monotone"
          dataKey="enrichment.failed"
          name={`● Enrichment Failed (${calculatePercentage(
            performanceData[performanceData.length - 1]?.enrichment.failed || 0,
            enrichmentTotal
          )}%)`}
          stroke="#BE123C"
          strokeWidth={2.5}
          dot={{ r: 4, fill: "#BE123C" }}
          activeDot={{
            r: 6,
            stroke: "#BE123C",
            strokeWidth: 2,
            fill: "#BE123C",
          }}
        />,
        <Line
          key="enrichment-pending"
          type="monotone"
          dataKey="enrichment.pending"
          name={`● Enrichment Pending (${calculatePercentage(
            performanceData[performanceData.length - 1]?.enrichment.pending ||
              0,
            enrichmentTotal
          )}%)`}
          stroke="#EAB308"
          strokeWidth={2.5}
          dot={{ r: 4, fill: "#EAB308" }}
          activeDot={{
            r: 6,
            stroke: "#EAB308",
            strokeWidth: 2,
            fill: "#EAB308",
          }}
        />
      );
    }

    return lines;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 sm:p-4 border border-gray-200 rounded-lg shadow-lg max-w-[90vw] sm:max-w-xs">
          <p className="font-medium text-gray-900 mb-2 text-sm sm:text-base">
            {label}
          </p>
          <div className="max-h-[200px] overflow-y-auto">
            {payload.map((entry: any, index: number) => (
              <div
                key={index}
                className="flex items-center gap-2 text-xs sm:text-sm py-0.5"
              >
                <div
                  className="w-2 h-2 sm:w-3 sm:h-3 rounded-full"
                  style={{ backgroundColor: entry.color }}
                ></div>
                <span className="text-gray-600 truncate">{entry.name}:</span>
                <span className="font-medium">{entry.value}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0 mb-4">
          <div>
            <h3 className="text-base sm:text-lg font-medium leading-6 text-gray-900">
              {title}
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
              {subtitle}
            </p>
          </div>
        </div>
        <div className="flex justify-center sm:justify-start">
          <div className="inline-flex gap-1 p-1 bg-gray-100 rounded-lg">
            <button
              onClick={() => setViewMode("both")}
              className={`px-3 sm:px-4 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all ${
                viewMode === "both"
                  ? "bg-white text-gray-900 shadow"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Both
            </button>
            <button
              onClick={() => setViewMode("scraping")}
              className={`px-3 sm:px-4 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all ${
                viewMode === "scraping"
                  ? "bg-white text-gray-900 shadow"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Scraping
            </button>
            <button
              onClick={() => setViewMode("enrichment")}
              className={`px-3 sm:px-4 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all ${
                viewMode === "enrichment"
                  ? "bg-white text-gray-900 shadow"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Enrichment
            </button>
          </div>
        </div>
      </div>
      <div className="p-4 sm:p-6">
        {hasData ? (
          <ResponsiveContainer width="100%" height={chartHeight}>
            <LineChart
              data={performanceData}
              margin={{
                top: 5,
                right: 10,
                left: 0,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: "#6B7280" }}
                tickLine={{ stroke: "#e0e0e0" }}
                axisLine={{ stroke: "#e0e0e0" }}
                interval="preserveStartEnd"
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#6B7280" }}
                tickLine={{ stroke: "#e0e0e0" }}
                axisLine={{ stroke: "#e0e0e0" }}
                width={35}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="circle"
                iconSize={8}
                wrapperStyle={{
                  paddingTop: 20,
                  borderTop: "1px solid #e0e0e0",
                  fontSize: "12px",
                }}
              />
              {getChartLines()}
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div
            className={`h-[${chartHeight}px] py-4 flex flex-col items-center justify-center text-gray-500 border border-dashed border-gray-300 rounded-md`}
          >
            <BarChart className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400 mb-2" />
            <span className="text-xs sm:text-sm mb-1">
              No metrics data available
            </span>
            <span className="text-xs text-gray-400 text-center px-4">
              Start scraping or enrichment tasks to see metrics
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PerformanceChart;
