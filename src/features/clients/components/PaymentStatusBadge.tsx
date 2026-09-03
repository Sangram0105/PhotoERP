import clsx from 'clsx';

interface PaymentStatusBadgeProps {
  status: string;
}

const PaymentStatusBadge = ({ status }: PaymentStatusBadgeProps) => {
  const normalized = status.toLowerCase();

  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold',
        {
          'bg-green-100 text-green-700':
            normalized === 'paid',
          'bg-yellow-100 text-yellow-700':
            normalized === 'partial',
          'bg-red-100 text-red-700':
            normalized === 'pending',
          'bg-slate-100 text-slate-700':
            normalized !== 'paid' &&
            normalized !== 'partial' &&
            normalized !== 'pending',
        },
      )}
    >
      {status}
    </span>
  );
};

export default PaymentStatusBadge;