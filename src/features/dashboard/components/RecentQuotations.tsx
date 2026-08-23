import Badge from '../../../components/ui/Badge';
import Card from '../../../components/ui/Card';
import Table, { TableColumn } from '../../../components/ui/Table';

import { QuotationListItem } from '../../quotations/types/quotationList.types';

interface RecentQuotationsProps {
  quotations: QuotationListItem[];
}

const columns: TableColumn<QuotationListItem>[] = [
  {
    header: 'Quotation',
    accessor: 'quotation_number',
  },
  {
    header: 'Client',
    accessor: 'client_name',
  },
  {
    header: 'Event',
    accessor: 'event_type',
  },
  {
    header: 'Amount',
    render: (row) => (
      <>₹{row.total.toLocaleString()}</>
    ),
  },
  {
    header: 'Status',
    render: (row) => (
      <Badge
        variant={
       row.status === 'Paid'
                  ? 'success'
                  : row.status === 'Partial'
                  ? 'warning'
                  : 'danger'
}
      >
        {row.status}
      </Badge>
    ),
  },
];

const RecentQuotations = ({
  quotations,
}: RecentQuotationsProps) => {
  return (
    <Card title="Recent Quotations">
      <Table
        columns={columns}
        data={quotations}
      />
    </Card>
  );
};

export default RecentQuotations;