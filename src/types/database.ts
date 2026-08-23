// ==============================
// Client DTO
// ==============================

export interface ClientDto {
  name: string;
  phone: string;
  email: string;
  address: string;
}

// ==============================
// Service DTO
// ==============================

export interface ServiceItemDto {
  service_name: string;

  quantity: number;

  price: number;

  total: number;
}

// ==============================
// Quotation DTO
// ==============================

export interface QuotationDto {
  id?: number;
  quotation_number: string;

  client: ClientDto;

  event_type: string;

  event_date: string;

  event_time: string;

  venue: string;

  city: string;

  subtotal: number;

  discount: number;

  advance_amount: number;

  total: number;

  balance: number;

  notes: string;

  services: ServiceItemDto[];
}



export interface Quotation extends QuotationDto {
  id: number;

  quotation_date: string;

  valid_till: string;
}