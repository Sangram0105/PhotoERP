import ClientDetailsForm from './ClientDetailsForm';
import EventDetailsForm from './EventDetailsForm';
import NotesSection from './NotesSection';
import PaymentSummary from './PaymentSummary';
import QuotationActions from './QuotationActions';
import QuotationHeader from './QuotationHeader';
import ServicesTable from './ServicesTable';

interface QuotationFormProps {
  quotation: any;
  mode: 'create' | 'edit' | 'view';
  loading: boolean;

  onSaveQuotation?: () => void;
onSaveDraft?: () => void;
onUpdateQuotation?: () => void;
onGeneratePdf?: () => void;
onPrint?: () => void;
onCancel?: () => void;
onEdit?: () => void;
 
}

const QuotationForm = ({
  quotation,
  loading,
  mode,
  onUpdateQuotation,
  onEdit,
  onSaveQuotation,
  onSaveDraft,
  onGeneratePdf,
  onPrint,
  onCancel,
}: QuotationFormProps) => {

     const readOnly = mode === 'view';

  return (
    <div className="space-y-8">
      <QuotationHeader
        quotationNo={quotation.quotationNo}
        quotationDate={quotation.quotationDate}
        disabled={readOnly}
        validTill="06-Aug-2026"
      />

      <ClientDetailsForm
        client={quotation.client}
        onChange={quotation.updateClient}
        readOnly={readOnly}
      />

      <EventDetailsForm
        event={quotation.event}
        onChange={quotation.updateEvent}
        readOnly={readOnly}
      />

      <ServicesTable
  services={quotation.services}
  addService={quotation.addService}
  removeService={quotation.removeService}
  updateService={quotation.updateService}
  readOnly={readOnly}
/>

      <PaymentSummary
        subtotal={quotation.subtotal}
        discount={quotation.discount}
        advance={quotation.advance}
        total={quotation.total}
        balance={quotation.balance}
        setDiscount={quotation.setDiscount}
        setAdvance={quotation.setAdvance}
        readOnly={readOnly}
      />

      <NotesSection
        notes={quotation.notes}
        onChange={quotation.setNotes}
        readOnly={readOnly}
      />

        <QuotationActions
  mode={mode}
  loading={loading}
  onSaveDraft={onSaveDraft}
  onUpdateQuotation={onUpdateQuotation}
  onSaveQuotation={onSaveQuotation}
  onGeneratePdf={onGeneratePdf}
  onPrint={onPrint}
  onCancel={onCancel}
  onEdit={onEdit}
/>
    </div>
  );
};

export default QuotationForm;