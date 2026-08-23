import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import QuotationForm from '../components/QuotationForm';
import { useQuotation } from '../hooks/useQuotation';
import { quotationService } from '../../../services/quotation.service';
import { QuotationDto } from '../../../types/database';
import { mapQuotationToDto } from '../../../utils/quotationMapper';
import { mapQuotationToPdf } from '../../../utils/pdfMapper';
import  generateQuotationPdf  from '../pdf/generateQuotationPdf';
import { toastError, toastSuccess } from '../../../utils/toast';




const EditQuotationPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
const pdfRef = useRef<HTMLDivElement>(null);
  const quotation = useQuotation();

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
      alert('Failed to load quotation');
    } finally {
      setLoading(false);
    }
  };


const handleUpdateQuotation = async () => {
  try {
    const dto = mapQuotationToDto(
      quotation.formState
    );

    await quotationService.updateQuotation(dto);

    toastSuccess('Quotation updated successfully');
     navigate(-1);
  } catch (err) {
    console.error(err);

    toastError('Failed to update quotation');
  }
};

  const handleSaveDraft = () => {
    console.log('Save Draft');
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
  const handlePrint = () => {
    console.log('Print');
  };

  const handleCancel = () => {
    navigate(-1);
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
      onSaveDraft={handleSaveDraft}
      onGeneratePdf={handleGeneratePdf}
      onPrint={handlePrint}
      onCancel={handleCancel}
    />
  );
};

export default EditQuotationPage;