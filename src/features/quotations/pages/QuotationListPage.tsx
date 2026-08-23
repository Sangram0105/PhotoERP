import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';

import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import Input from '../../../components/ui/Input';
import { confirm } from '@tauri-apps/plugin-dialog';
import {
  toastSuccess,
  toastError,
  toastLoading,
  toastDismiss,
} from '../../../utils/toast';
import { ROUTES } from '../../../constants/routes';
import { QuotationListItem } from '../types/quotationList.types';
import { useEffect, useState } from 'react';
import { quotationService } from '../../../services/quotation.service';
import QuotationTable from '../components/QuotationTable';

const QuotationListPage = () => {
  const navigate = useNavigate();

  const [quotations, setQuotations] = useState<QuotationListItem[]>([]);
const [loading, setLoading] = useState(true);
const [search, setSearch] = useState('');

  const filtered = quotations.filter((q) =>
  q.client_name
    .toLowerCase()
    .includes(search.toLowerCase()) ||
  q.quotation_number
    .toLowerCase()
    .includes(search.toLowerCase())
);


useEffect(() => {
  loadQuotations();
}, []);

const loadQuotations = async () => {
  try {
    setLoading(true);

    const data =
      await quotationService.getQuotations();

    setQuotations(data);
  } catch (error) {
    console.error(error);

    toastError('Failed to load quotations');
  } finally {
    setLoading(false);
  }
};
   

 

const handleView = (id: number) => {
  navigate(`/quotations/${id}`);
};

const handleEdit = (id: number) => {
  navigate(`/quotations/edit/${id}`);
};

const handleDelete = async (id: number) => {
const confirmed = await confirm(
  "Delete this quotation?",
);

if (!confirmed) return;

  const toastId = toastLoading(
    'Deleting quotation...'
  );

  try {
    await quotationService.deleteQuotation(id);

    await loadQuotations();

    toastDismiss(toastId);

    toastSuccess(
      'Quotation deleted successfully'
    );
  } catch (err) {
    console.error(err);

    toastDismiss(toastId);

    toastError(
      'Failed to delete quotation'
    );
  }
};
  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold">
            Quotations
          </h1>

          <p className="text-slate-500">
            Manage all quotations
          </p>
        </div>

        <Button
          leftIcon={<Plus size={18} />}
          onClick={() => navigate(ROUTES.NEW_QUOTATION)}
        >
          New Quotation
        </Button>
      </div>

      {/* Search */}
      <Card>
       <Input
      placeholder="Search quotation..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      />
      </Card>

      <QuotationTable
     quotations={filtered}
     loading={loading}
     onDelete={handleDelete}
     onEdit={handleEdit}
     onView={handleView}
     />

     
    </div>
  );
};

export default QuotationListPage;