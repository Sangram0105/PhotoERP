import clsx from 'clsx';

interface StatusBadgeProps {
  status: string;
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold',
        {
          'bg-green-100 text-green-700':
            status === 'Completed',

          'bg-yellow-100 text-yellow-700':
            status === 'Pending',

          'bg-blue-100 text-blue-700':
            status !== 'Completed' && status !== 'Pending',
        },
      )}
    >
      {status}
    </span>
  );
};

export default StatusBadge;
