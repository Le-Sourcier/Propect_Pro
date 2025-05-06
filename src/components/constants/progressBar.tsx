import React from "react";

interface ProgressBarProps {
  progress: number;
  showLabel?: boolean;
  height?: number;
  animated?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  showLabel = true,
  height = 8,
  animated = true,
}) => {
  return (
    <div className="relative pt-1">
      <div className="flex mb-2 items-center justify-between">
        <div>
          <span className="text-xs font-semibold inline-block py-1.5 px-3 uppercase rounded-full text-blue-600 bg-blue-100 transform transition-all duration-300 hover:bg-blue-200">
            Profile Completion
          </span>
        </div>
        {showLabel && (
          <div className="text-right">
            <span className="text-xs font-semibold inline-block text-blue-600 bg-blue-50 rounded-full px-2 py-1 transition-all duration-500">
              {progress}%
            </span>
          </div>
        )}
      </div>
      <div
        className="overflow-hidden rounded-full bg-gradient-to-r from-blue-50 to-blue-100 shadow-inner"
        style={{ height: `${height}px` }}
      >
        <div
          style={{
            width: `${progress}%`,
            transition: "width 1s ease-in-out",
          }}
          className={`
            relative h-full
            bg-gradient-to-r from-blue-500 to-blue-600
            shadow-lg
            ${animated ? "animate-pulse-light" : ""}
          `}
        >
          {/* Shimmer effect */}
          <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
            <div
              className="absolute inset-y-0 -inset-x-1/2 w-[200%] animate-[shimmer_2s_infinite]"
              style={{
                background:
                  "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)",
              }}
            />
          </div>

          {/* Progress glow effect */}
          <div
            className="absolute right-0 h-full w-2 bg-white/30 blur-sm"
            style={{
              boxShadow: "0 0 8px 2px rgba(255, 255, 255, 0.3)",
            }}
          />
        </div>
      </div>

      {/* Milestone markers */}
      <div className="flex justify-between mt-1">
        {[0, 33, 66, 100].map((milestone) => (
          <div
            key={milestone}
            className={`
              w-2 h-2 rounded-full transition-all duration-300
              ${progress >= milestone ? "bg-blue-500" : "bg-blue-100"}
              ${progress >= milestone ? "scale-100" : "scale-100"}
            `}
          />
        ))}
      </div>
    </div>
  );
};

export default ProgressBar;
