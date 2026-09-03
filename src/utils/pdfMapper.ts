
import type { PdfQuotation } from '../features/quotations/pdf/types';
import { QuotationDto } from '../types/database';

export const mapQuotationToPdf = (
  quotation: QuotationDto,
): PdfQuotation => {
  const today = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return {
    quotationNo: quotation.quotation_number,

    quotationDate: today,

    validTill: 'N/A',

    client: {
      name: quotation.client.name,
      phone: quotation.client.phone,
      email: quotation.client.email,
      address: quotation.client.address,
    },

    event: {
      eventType: quotation.event_type,
      eventDate: quotation.event_date,
      eventTime: quotation.event_time,
      venue: quotation.venue,
      city: quotation.city,
    },

    services: quotation.services.map((service, index) => ({
      id: index + 1,
      serviceName: service.service_name,
      quantity: 1,
      price: service.price,
    })),

    subtotal: quotation.subtotal,
    discount: quotation.discount,
    advance: quotation.advance_amount,
    total: quotation.total,
    balance: quotation.balance,

    studio: {
      phone: '+91 9022624329',
      email: 'Jadhavomkar604@gmail.com',
      website: 'www.photoerp.com',
    },
  };
};