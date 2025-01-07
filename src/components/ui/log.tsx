import React, { useEffect, useRef, useState } from "react";

interface LogBoardProps {
  initialLogs?: string[];
  clusterId?: string;
  autoScroll?: boolean;
}

export const LogBoard: React.FC<LogBoardProps> = ({
  initialLogs = [],
  clusterId,
  autoScroll = true,
}) => {
  const [logs, setLogs] = useState<string[]>(initialLogs);
  const logEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // 模拟测试数据
    const testLogs = [
      `2023-10-01 12:00:00 - INFO: Cluster ${clusterId} - Application started`,
      `2023-10-01 12:01:00 - DEBUG: Cluster ${clusterId} - User logged in`,
      `2023-10-01 12:02:00 - ERROR: Cluster ${clusterId} - Failed to load resource`,
      `2023-10-01 12:03:00 - INFO: Cluster ${clusterId} - User logged out`,
      `2023-10-01 12:04:00 - WARNING: Cluster ${clusterId} - Application closed`,
    ];
    const interval = setInterval(() => {
      const randomLog = testLogs[Math.floor(Math.random() * testLogs.length)];
      setLogs((prevLogs) => [...prevLogs, randomLog]);
    }, 1000);

    return () => clearInterval(interval);
  }, [clusterId]);

  useEffect(() => {
    if (autoScroll && logEndRef.current) {
      logEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [logs, autoScroll]);

  return (
    <div className="bg-black text-white p-4 rounded-lg overflow-y-scroll overflow-x-scroll h-full w-full border border-gray-800 pb-20">
      <div className="font-mono">
        {logs.map((log, index) => {
          let logClass = "text-green-400";
          if (log.includes("WARN") || log.includes("DEBUG")) {
            logClass = "text-yellow-400";
          }
          if (log.includes("ERROR") || log.includes("FATAL")) {
            logClass = "text-red-400";
          }
          return (
            <div key={index} className={logClass}>
              {log}
            </div>
          );
        })}
        <div ref={logEndRef} className="pb-20" />
      </div>
    </div>
  );
};

export default LogBoard;
