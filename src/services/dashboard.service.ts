import { invoke } from '@tauri-apps/api/core';

import {
  DashboardStats,
  RevenueSummary,
} from '../features/dashboard/types/dashboard.types';

class DashboardService {
  async getStats(): Promise<DashboardStats> {
    return invoke<DashboardStats>(
      'get_dashboard_stats',
    );
  }

  async getMonthlyRevenue(): Promise<RevenueSummary[]> {
    return invoke<RevenueSummary[]>(
      'get_monthly_revenue',
    );
  }
}

export const dashboardService =
  new DashboardService();