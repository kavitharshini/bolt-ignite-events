import { useState, useEffect } from "react";

interface QuickStatsProps {
  totalEvents: number;
  totalAttendees: number;
  revenue: string;
  successRate: string;
}

export const useQuickStats = (): QuickStatsProps => {
  const [stats, setStats] = useState<QuickStatsProps>({
    totalEvents: 0,
    totalAttendees: 0,
    revenue: "₹0",
    successRate: "0%"
  });

  useEffect(() => {
    // Simulate loading real-time stats
    const loadStats = () => {
      setStats({
        totalEvents: 24,
        totalAttendees: 1247,
        revenue: "₹32,45,230",
        successRate: "94%"
      });
    };

    loadStats();
    
    // Update stats every 30 seconds
    const interval = setInterval(loadStats, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return stats;
};

export default useQuickStats;