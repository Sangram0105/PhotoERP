export interface QuotationListItem {
  id: number;

  quotation_number: string;

  client_name: string;

  event_type: string;

  event_date: string;

  total: number;

  balance: number;

  status: string;
}