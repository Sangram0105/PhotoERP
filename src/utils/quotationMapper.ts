import type { QuotationDto } from '../types/database';
import type { UseQuotationState } from '../features/quotations/types/quotation.types';

export const mapQuotationToDto = (
  data: UseQuotationState,
): QuotationDto => {
  return {
    id: data.id,
    quotation_number: data.quotationNo,

    client: {
      name: data.client.name,
      phone: data.client.phone,
      email: data.client.email,
      address: data.client.address,
    },

    event_type: data.event.eventType,
    event_date: data.event.eventDate,
    event_time: data.event.eventTime,

    venue: data.event.venue,
    city: data.event.city,

    subtotal: data.subtotal,
    discount: data.discount,
    advance_amount: data.advance,
    total: data.total,
    balance: data.balance,

    notes: data.notes,

    services: data.services.map((service) => ({
      service_name: service.serviceName,
      quantity: service.quantity,
      price: service.price,
      total: service.quantity * service.price,
    })),
  };
};

export const mapDtoToQuotationState = (
  dto: QuotationDto,
): UseQuotationState => {
  return {
    id: dto.id,
    quotationNo: dto.quotation_number,

    // Until you store quotation_date in the database
    quotationDate: new Date()
      .toISOString()
      .split('T')[0],

    client: {
      name: dto.client.name,
      phone: dto.client.phone,
      email: dto.client.email,
      address: dto.client.address,
    },

    event: {
      eventType: dto.event_type,
      eventDate: dto.event_date,
      eventTime: dto.event_time,
      venue: dto.venue,
      city: dto.city,
      eventNotes: '',
    },

    services: dto.services.map((service, index) => ({
      id: index + 1,
      serviceName: service.service_name,
      quantity: service.quantity,
      price: service.price,
    })),

    notes: dto.notes,

    discount: dto.discount,

    advance: dto.advance_amount,

    subtotal: dto.subtotal,

    total: dto.total,

    balance: dto.balance,
  };
};