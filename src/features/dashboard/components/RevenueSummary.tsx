import Card from '../../../components/ui/Card';

import type { RevenueSummary as RevenueSummaryType } from '../types/dashboard.types';

interface RevenueSummaryProps {
  revenue: RevenueSummaryType[];
}

const RevenueSummary = ({
  revenue,
}: RevenueSummaryProps) => {
  return (
    <Card title="Revenue Summary">

      {revenue.length === 0 ? (
        <p className="py-6 text-center text-slate-500">
          No revenue available
        </p>
      ) : (
        <div className="space-y-4">

          {revenue.map((item) => (

            <div
              key={item.month}
              className="flex items-center justify-between border-b pb-3 last:border-none"
            >
              <span className="font-medium text-slate-700">
                {item.month}
              </span>

              <span className="font-semibold text-green-600">
                ₹ {item.amount.toLocaleString()}
              </span>
            </div>

          ))}

        </div>
      )}

    </Card>
  );
};

export default RevenueSummary;