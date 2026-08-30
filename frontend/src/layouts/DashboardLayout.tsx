import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { dashboardApi } from '../api/dashboardApi';
import { DashboardSummary } from '../types';

export const DashboardLayout: React.FC = () => {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const location = useLocation();

  const fetchSummary = async () => {
    try {
      const data = await dashboardApi.getDashboard();
      setSummary(data);
    } catch (err) {
      console.error('Failed to fetch summary for layout badges:', err);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen bg-[#090d16] text-slate-100">
      <Sidebar
        atRiskCount={summary?.atRiskMachines || 0}
        totalAlerts={summary?.machinesRequiringAttention?.length || 0}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <Outlet />
      </div>
    </div>
  );
};
