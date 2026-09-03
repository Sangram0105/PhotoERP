// ==============================
// Client List Item
// ==============================

export interface ClientListItem {
  id: number;
  name: string;
  phone: string;
  email: string;
  event_count: number;
  overall_status: string;
}

// ==============================
// Client Info
// ==============================

export interface ClientInfo {
  id: number;
  name: string;
  phone: string;
  email: string;
  address: string;
}

// ==============================
// Client Event Service
// ==============================

export interface ClientEventService {
  id: number;
  service_name: string;
  quantity: number;
  price: number;
  total: number;
  status: string;
}

// ==============================
// Client Event
// ==============================

export interface ClientEvent {
  quotation_id: number;
  quotation_number: string;
  event_type: string;
  event_date: string;
  event_time: string;
  venue: string;
  city: string;
  total: number;
  paid: number;
  pending: number;
  payment_status: string;
  services: ClientEventService[];
  overall_status: string;
}

// ==============================
// Client Financial Summary
// ==============================

export interface ClientFinancialSummary {
  total_business: number;
  amount_paid: number;
  pending_amount: number;
  payment_status: string;
}

// ==============================
// Client Details
// ==============================

export interface ClientDetails {
  client: ClientInfo;
  events: ClientEvent[];
  overall_status: string;
  financial: ClientFinancialSummary;
}