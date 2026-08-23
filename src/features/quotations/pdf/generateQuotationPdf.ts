import html2pdf from 'html2pdf.js';

interface GeneratePdfOptions {
  element: HTMLElement;
  fileName: string;
}

const generateQuotationPdf = async ({
  element,
  fileName,
}: GeneratePdfOptions) => {
  const options = {
    margin: 0,
    filename: `${fileName}.pdf`,
    image: {
      type: 'jpeg' as const,
      quality: 0.98,
    },
    html2canvas: {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#FDFAF8',
      logging: false,
      windowWidth: 794, // Standard A4 width in pixels at 96 DPI
    },
    jsPDF: {
      unit: 'mm' as const,
      format: 'a4' as const,
      orientation: 'portrait' as const,
    },
    // Multi-page automatic page break configuration
    pagebreak: {
      mode: ['avoid-all', 'css', 'legacy'],
      avoid: [
        '.avoid-break',
        '.client-event-grid',
        '.totals-section',
        '.quotation-header',
        '.quotation-footer',
        'tr',
      ],
    },
  };

  await html2pdf().set(options).from(element).save();
};

export default generateQuotationPdf;