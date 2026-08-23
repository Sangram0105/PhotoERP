import { forwardRef } from 'react';
import './quotation.css';
import photoERP from './photoERP.jpg';
import logo from './logo.png';

import QuotationHeader from './QuotationHeader';
import QuotationMeta from './QuotationMeta';
import ClientSection from './ClientSection';
import EventSection from './EventSection';
import PackageTable from './PackageTable';
import TotalsSection from './TotalsSection';
import Footer from './Footer';

import type { PdfQuotation } from './types';

interface Props {
  quotation: PdfQuotation;
}

const QuotationTemplate = forwardRef<HTMLDivElement, Props>(
  ({ quotation }, ref) => {
    return (
      <div className="pdf-wrapper">
        <div ref={ref} className="pdf-page">
          <div className="pdf-body">
            <QuotationHeader floralBanner={photoERP} logo={logo} />

            <QuotationMeta
              quotationNo={quotation.quotationNo}
              quotationDate={quotation.quotationDate}
              validTill={quotation.validTill}
            />

            <div className="client-event-grid avoid-break">
              <ClientSection client={quotation.client} />
              <EventSection event={quotation.event} />
            </div>

            <PackageTable services={quotation.services} />

            <TotalsSection
              subtotal={quotation.subtotal}
              discount={quotation.discount}
              advance={quotation.advance}
              total={quotation.total}
              balance={quotation.balance}
            />
          </div>

          <Footer
            phone={quotation.studio.phone}
            email={quotation.studio.email}
            website={quotation.studio.website}
          />
        </div>
      </div>
    );
  }
);

QuotationTemplate.displayName = 'QuotationTemplate';

export default QuotationTemplate;