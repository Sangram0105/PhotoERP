import { QuotationListItem } from "../../quotations/types/quotationList.types";


export interface DashboardStats {
  total_quotations: number;
  total_revenue: number;
  pending_balance: number;
  upcoming_events: number;
  recent_quotations: QuotationListItem[];
  upcoming_event_list: QuotationListItem[];
}


export interface RevenueSummary {
  month: string;
  amount: number;
}