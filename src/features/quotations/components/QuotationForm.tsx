import ClientDetailsForm from './ClientDetailsForm';
import EventDetailsForm from './EventDetailsForm';
import NotesSection from './NotesSection';
import PaymentSummary from './PaymentSummary';
import QuotationActions from './QuotationActions';
import QuotationHeader from './QuotationHeader';
import ServicesTable from './ServicesTable';

import type { QuotationErrors, FieldTouched } from '../types/validation.types';

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

  errors?: QuotationErrors;
  touched?: FieldTouched;
  onTouchField?: (field: keyof FieldTouched) => void;
  onValidateField?: (field: keyof FieldTouched, state: any) => void;
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
  errors,
  touched,
  onTouchField,
  onValidateField,
}: QuotationFormProps) => {

  const readOnly = mode === 'view';
  const isValidating = mode !== 'view';

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
        error={isValidating ? {
          name: errors?.clientName || '',
          phone: errors?.clientPhone || '',
          email: errors?.clientEmail || '',
        } : undefined}
        touched={isValidating ? {
          name: touched?.name || false,
          phone: touched?.phone || false,
          email: touched?.email || false,
        } : undefined}
        onTouchField={isValidating ? onTouchField : undefined}
        onValidateField={isValidating ? onValidateField : undefined}
        quotationState={isValidating ? quotation.formState : undefined}
      />

      <EventDetailsForm
        event={quotation.event}
        onChange={quotation.updateEvent}
        readOnly={readOnly}
        error={isValidating ? {
          eventType: errors?.eventType || '',
          eventDate: errors?.eventDate || '',
        } : undefined}
        touched={isValidating ? {
          eventType: touched?.eventType || false,
          eventDate: touched?.eventDate || false,
        } : undefined}
        onTouchField={isValidating ? onTouchField : undefined}
        onValidateField={isValidating ? onValidateField : undefined}
        quotationState={isValidating ? quotation.formState : undefined}
      />

      <ServicesTable
        services={quotation.services}
        addService={quotation.addService}
        removeService={quotation.removeService}
        updateService={quotation.updateService}
        readOnly={readOnly}
        error={isValidating ? errors?.noServices : undefined}
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
        error={isValidating ? {
          discount: errors?.discountExceeds || '',
          advance: errors?.advanceExceeds || '',
        } : undefined}
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
