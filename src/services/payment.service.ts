import { invoke } from '@tauri-apps/api/core';

import type {
  PaymentInput,
  PaymentSummary,
  PaymentUpdate,
  QuotationPayments,
} from '../features/clients/types/payment.types';

class PaymentService {
  async addPayment(payment: PaymentInput): Promise<void> {
    return invoke('add_payment', { payment });
  }

  async getPaymentsByQuotation(
    quotationId: number,
  ): Promise<QuotationPayments> {
    return invoke<QuotationPayments>('get_payments_by_quotation', {
      quotationId,
    });
  }

  async getPaymentSummary(
    quotationId: number,
  ): Promise<PaymentSummary> {
    return invoke<PaymentSummary>('get_payment_summary', {
      quotationId,
    });
  }

  async updatePayment(payment: PaymentUpdate): Promise<void> {
    return invoke('update_payment', { payment });
  }

  async deletePayment(id: number): Promise<void> {
    return invoke('delete_payment', { id });
  }
}

export const paymentService = new PaymentService();