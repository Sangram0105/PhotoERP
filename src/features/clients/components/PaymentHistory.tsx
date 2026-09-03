import { Pencil, Trash2 } from 'lucide-react';

import Button from '../../../components/ui/Button';
import type { Payment } from '../types/payment.types';

interface PaymentHistoryProps {
  payments: Payment[];
  onEdit: (payment: Payment) => void;
  onDelete: (payment: Payment) => void;
}

const PaymentHistory = ({
  payments,
  onEdit,
  onDelete,
}: PaymentHistoryProps) => {
  if (payments.length === 0) {
    return (
      <p className="text-sm text-slate-400">
        No payments recorded yet.
      </p>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200">
      <table className="min-w-full">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-4 py-2.5 text-left text-sm font-semibold text-slate-700">
              Date
            </th>
            <th className="px-4 py-2.5 text-left text-sm font-semibold text-slate-700">
              Method
            </th>
            <th className="px-4 py-2.5 text-left text-sm font-semibold text-slate-700">
              Notes
            </th>
            <th className="px-4 py-2.5 text-right text-sm font-semibold text-slate-700">
              Amount
            </th>
            <th className="px-4 py-2.5 text-right text-sm font-semibold text-slate-700">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment) => (
            <tr
              key={payment.id}
              className="border-t hover:bg-slate-50"
            >
              <td className="px-4 py-3 text-sm text-slate-700">
                {payment.payment_date}
              </td>
              <td className="px-4 py-3 text-sm text-slate-700">
                {payment.payment_method || '—'}
              </td>
              <td className="px-4 py-3 text-sm text-slate-500">
                {payment.notes || '—'}
              </td>
              <td className="px-4 py-3 text-right text-sm font-semibold text-slate-900">
                ₹{payment.amount.toLocaleString()}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-1">
                  <Button
                    variant="secondary"
                    onClick={() => onEdit(payment)}
                  >
                    <Pencil size={14} />
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => onDelete(payment)}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentHistory;