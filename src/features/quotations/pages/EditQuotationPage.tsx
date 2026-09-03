import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import QuotationForm from '../components/QuotationForm';
import { useQuotation } from '../hooks/useQuotation';
import { useQuotationValidation } from '../hooks/useQuotationValidation';
import { quotationService } from '../../../services/quotation.service';
import { QuotationDto } from '../../../types/database';
import { mapQuotationToDto } from '../../../utils/quotationMapper';
import { mapQuotationToPdf } from '../../../utils/pdfMapper';
import generateQuotationPdf from '../pdf/generateQuotationPdf';
import { toastDismiss, toastError, toastLoading, toastSuccess } from '../../../utils/toast';


const EditQuotationPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const pdfRef = useRef<HTMLDivElement>(null);
  const quotation = useQuotation();
  const validation = useQuotationValidation();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQuotation();
  }, []);

  const loadQuotation = async () => {
    if (!id) return;

    try {
      const data: QuotationDto =
        await quotationService.getQuotation(Number(id));

      quotation.loadQuotation(data);
    } catch (error) {
      console.error(error);
      toastError('Failed to load quotation');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuotation = async () => {
    const isValid = validation.validate(quotation.formState);
    if (!isValid) {
      toastError('Please fix the errors before updating');
      return;
    }

    const toastId = toastLoading('Updating quotation...');

    try {
      const dto = mapQuotationToDto(quotation.formState);

      await quotationService.updateQuotation(dto);

      validation.clearErrors();
      toastDismiss(toastId);
      toastSuccess('Quotation updated successfully');
      navigate(-1);
    } catch (err) {
      console.error(err);

      toastDismiss(toastId);
      toastError('Failed to update quotation');
    }
  };

  const pdfQuotation = mapQuotationToPdf(
    mapQuotationToDto(quotation.formState),
  );

  const handleGeneratePdf = async () => {
    if (!pdfRef.current) return;

    await generateQuotationPdf({
      element: pdfRef.current,
      fileName: pdfQuotation.quotationNo,
    });
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <QuotationForm
      quotation={quotation}
      loading={false}
      mode='edit'
      onUpdateQuotation={handleUpdateQuotation}
      onGeneratePdf={handleGeneratePdf}
      onCancel={() => navigate(-1)}
      errors={validation.errors}
      touched={validation.touched}
      onTouchField={validation.touchField}
      onValidateField={validation.validateField}
    />
  );
};

export default EditQuotationPage;
