import {
  FileText,
  IndianRupee,
  Calendar,
  Wallet,
} from 'lucide-react';

import StatCard from '../components/StatCard';
import RecentQuotations from '../components/RecentQuotations';
import RevenueSummary from '../components/RevenueSummary';
import UpcomingEvents from '../components/UpcomingEvents';

import { useDashboard } from '../hooks/useDashboard';

const DashboardPage = () => {
  const {
    stats,
    revenue,
    loading,
  } = useDashboard();



  console.log(stats);
  if (loading) {
    return (
      <div className="p-10">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* Header */}

      <div>
        <h1 className="text-3xl font-bold">
          Dashboard
        </h1>

        <p className="mt-1 text-slate-500">
          Welcome back 👋
        </p>
      </div>

      {/* Statistics */}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

        <StatCard
          title="Total Quotations"
          value={String(stats?.total_quotations ?? 0)}
          subtitle="All quotations"
          icon={<FileText size={22} />}
        />

        <StatCard
          title="Revenue"
          value={`₹${(stats?.total_revenue ?? 0).toLocaleString()}`}
          subtitle="Total Revenue"
          icon={<IndianRupee size={22} />}
          iconBg="bg-green-100 text-green-600"
        />

        <StatCard
          title="Pending Balance"
          value={`₹${(stats?.pending_balance ?? 0).toLocaleString()}`}
          subtitle="Awaiting Payment"
          icon={<Wallet size={22} />}
          iconBg="bg-orange-100 text-orange-600"
        />

        <StatCard
          title="Upcoming Events"
          value={String(stats?.upcoming_events ?? 0)}
          subtitle="Future Events"
          icon={<Calendar size={22} />}
          iconBg="bg-purple-100 text-purple-600"
        />

      </div>

      {/* Quick Actions */}

      {/* <QuickActions /> */}

      {/* Bottom Section */}

      <div className="grid gap-6 xl:grid-cols-3">

        <div className="xl:col-span-2">
         <RecentQuotations
  quotations={stats?.recent_quotations ?? []}
/>
        </div>

        <div className="space-y-6">
          <UpcomingEvents quotations={stats?.upcoming_event_list ?? []}/>
          <RevenueSummary revenue={revenue}/>
        </div>

      </div>

    </div>
  );
};

export default DashboardPage;