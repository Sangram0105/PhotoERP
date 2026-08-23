import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

import Button from '../../../components/ui/Button';

import QuotationTemplate from '../pdf/QuotationTemplate';

import { quotationService } from '../../../services/quotation.service';

import type { PdfQuotation } from '../pdf/types';
import { mapQuotationToPdf } from '../../../utils/pdfMapper';

import generateQuotationPdf from '../pdf/generateQuotationPdf';

const PdfPreviewPage = () => {
  const { id } = useParams();

  const pdfRef = useRef<HTMLDivElement>(null);

  const [quotation, setQuotation] =
    useState<PdfQuotation>();

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    loadQuotation();
  }, []);

  const loadQuotation = async () => {
    try {
      const dto =
        await quotationService.getQuotation(
          Number(id),
        );

      setQuotation(
        mapQuotationToPdf(dto),
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePdf = async () => {
    if (!pdfRef.current || !quotation) {
      return;
    }

    await generateQuotationPdf({
      element: pdfRef.current,
      fileName: quotation.quotationNo,
    });
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!quotation) {
    return <p>Quotation not found.</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={handleGeneratePdf}>
          Download PDF
        </Button>
      </div>

      <QuotationTemplate
        ref={pdfRef}
        quotation={quotation}
      />
    </div>
  );
};

export default PdfPreviewPage;