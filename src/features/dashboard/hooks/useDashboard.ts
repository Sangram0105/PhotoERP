import { useEffect, useState } from 'react';

import { dashboardService } from '../../../services/dashboard.service';

import type {
  DashboardStats,
  RevenueSummary,
} from '../types/dashboard.types';

export const useDashboard = () => {
  const [stats, setStats] =
    useState<DashboardStats>();

  const [revenue, setRevenue] =
    useState<RevenueSummary[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
   try {
  const dashboardStats =
    await dashboardService.getStats();

  console.log("Dashboard", dashboardStats);

  setStats(dashboardStats);

  const monthlyRevenue =
    await dashboardService.getMonthlyRevenue();

  console.log("Revenue", monthlyRevenue);

  setRevenue(monthlyRevenue);

}  catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return {
    stats,
    revenue,
    loading,
    refresh: loadDashboard,
  };
};