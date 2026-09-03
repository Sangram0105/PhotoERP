import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import QuotationForm from '../components/QuotationForm';
import { useQuotation } from '../hooks/useQuotation';
import { useQuotationValidation } from '../hooks/useQuotationValidation';

import { quotationService } from '../../../services/quotation.service';

import { mapQuotationToDto } from '../../../utils/quotationMapper';
import { mapQuotationToPdf } from '../../../utils/pdfMapper';

import generateQuotationPdf from '../pdf/generateQuotationPdf';
import PdfPreview from '../pdf/PdfPreview';
import { toastDismiss, toastError, toastLoading, toastSuccess } from '../../../utils/toast';

const NewQuotationPage = () => {
  const navigate = useNavigate();
  const quotation = useQuotation();
  const validation = useQuotationValidation();

  const pdfRef = useRef<HTMLDivElement>(null);

  const [loading, setLoading] = useState(false);

  const pdfQuotation = mapQuotationToPdf(
    mapQuotationToDto(quotation.formState),
  );

  const handleSaveQuotation = async () => {
    const isValid = validation.validate(quotation.formState);
    if (!isValid) {
      toastError('Please fix the errors before saving');
      return;
    }

    const toastId = toastLoading('Saving quotation...');

    try {
      setLoading(true);

      const dto = mapQuotationToDto(quotation.formState);

      await quotationService.saveQuotation(dto);

      validation.clearErrors();
      toastDismiss(toastId);
      toastSuccess('Quotation saved successfully');
    } catch (error) {
      console.error(error);

      toastDismiss(toastId);
      toastError('Failed to save quotation');
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePdf = async () => {
    if (!pdfRef.current) {
      toastError('PDF preview not available');
      return;
    }

    try {
      await generateQuotationPdf({
        element: pdfRef.current,
        fileName: pdfQuotation.quotationNo,
      });

      toastSuccess('PDF generated successfully');
    } catch (error) {
      console.error(error);

      toastError('Failed to generate PDF');
    }
  };

  return (
    <>
      <QuotationForm
        quotation={quotation}
        mode="create"
        loading={loading}
        onSaveQuotation={handleSaveQuotation}
        onGeneratePdf={handleGeneratePdf}
        onCancel={() => navigate(-1)}
        errors={validation.errors}
        touched={validation.touched}
        onTouchField={validation.touchField}
        onValidateField={validation.validateField}
      />

      <PdfPreview
        ref={pdfRef}
        quotation={pdfQuotation}
      />
    </>
  );
};

export default NewQuotationPage;
