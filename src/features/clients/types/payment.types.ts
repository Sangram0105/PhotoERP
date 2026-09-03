export const PAYMENT_METHODS = [
  'Cash',
  'UPI',
  'Bank Transfer',
  'Card',
  'Other',
] as const;

// ==============================
// Payment
// ==============================

export interface Payment {
  id: number;
  quotation_id: number;
  amount: number;
  payment_date: string;
  payment_method: string;
  notes: string;
  created_at: string;
}

// ==============================
// Payment Input
// ==============================

export interface PaymentInput {
  quotation_id: number;
  amount: number;
  payment_date: string;
  payment_method: string;
  notes: string;
}

// ==============================
// Payment Update
// ==============================

export interface PaymentUpdate {
  id: number;
  amount: number;
  payment_date: string;
  payment_method: string;
  notes: string;
}

// ==============================
// Payment Summary
// ==============================

export interface PaymentSummary {
  total: number;
  paid: number;
  pending: number;
  status: string;
}

// ==============================
// Quotation Payments
// ==============================

export interface QuotationPayments {
  quotation_id: number;
  payments: Payment[];
  summary: PaymentSummary;
}