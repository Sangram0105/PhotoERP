import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import QuotationForm from '../components/QuotationForm';

import { useQuotation } from '../hooks/useQuotation';
import { quotationService } from '../../../services/quotation.service';

import { mapQuotationToDto } from '../../../utils/quotationMapper';
import { mapQuotationToPdf } from '../../../utils/pdfMapper';

import generateQuotationPdf from '../pdf/generateQuotationPdf';
import PdfPreview from '../pdf/PdfPreview';
import { toastSuccess } from '../../../utils/toast';

const ViewQuotationPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const quotation = useQuotation();

  const pdfRef = useRef<HTMLDivElement>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQuotation();
  }, []);

  const loadQuotation = async () => {
    if (!id) return;

    try {
      const data = await quotationService.getQuotation(
        Number(id),
      );

      quotation.loadQuotation(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const pdfQuotation = mapQuotationToPdf(
    mapQuotationToDto(quotation.formState),
  );

  const handleGeneratePdf = async () => {
    if (!pdfRef.current) return;

    toastSuccess('pdf generated successfully!!');

    await document.fonts.ready;

    const images =
      Array.from(
        pdfRef.current.querySelectorAll('img')
      );

    await Promise.all(
      images.map((img) => {
        if (img.complete) {
          return Promise.resolve();
        }

        return new Promise((resolve) => {
          img.onload = resolve;
          img.onerror = resolve;
        });
      })
    );

    await generateQuotationPdf({
      element: pdfRef.current,
      fileName: pdfQuotation.quotationNo,
    });
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <QuotationForm
        quotation={quotation}
        mode="view"
        loading={false}
        onGeneratePdf={handleGeneratePdf}
        onCancel={() => navigate(-1)}
        onEdit={() => navigate(`/quotations/edit/${id}`)}
      />

      <PdfPreview
        ref={pdfRef}
        quotation={pdfQuotation}
      />
    </>
  );
};

export default ViewQuotationPage;
