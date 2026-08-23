import Card from '../../../components/ui/Card';

interface QuotationHeaderProps {
  quotationNo: string;
  quotationDate: string;
  validTill: string;
  disabled?: boolean
}

const QuotationHeader = ({
  
  quotationNo,
  quotationDate,
  validTill,
}: QuotationHeaderProps) => {
  return (
    <Card >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Create New Quotation
          </h1>

          <p className="mt-2 text-slate-500">
            Fill in the details below to create a quotation.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 rounded-xl bg-slate-50 p-4 text-sm md:grid-cols-3">
          <div>
            <p className="text-slate-500">Quotation No</p>
            <p className="font-semibold">{quotationNo}</p>
          </div>

          <div>
            <p className="text-slate-500">Date</p>
            <p className="font-semibold">{quotationDate}</p>
          </div>

          <div>
            <p className="text-slate-500">Valid Till</p>
            <p className="font-semibold">{validTill}</p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default QuotationHeader;