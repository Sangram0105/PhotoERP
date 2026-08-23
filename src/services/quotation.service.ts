import { invoke } from '@tauri-apps/api/core';

import type { QuotationDto } from '../types/database';
import { QuotationListItem } from '../features/quotations/types/quotationList.types';

class QuotationService {
  /**
   * Save a new quotation
   */
  async saveQuotation(
    quotation: QuotationDto,
  ): Promise<string> {
    return await invoke('save_quotation', {
      quotation,
    });
  }

  /**
   * Get all quotations
   */
async getQuotations() {
  return invoke<QuotationListItem[]>(
    'get_quotations'
  );
}

  /**
   * Get quotation by ID
   */
async getQuotation(id: number) {
  return invoke<QuotationDto>(
    'get_quotation_by_id',
    { id }
  );
}

  /**
   * Update quotation
   */
 async updateQuotation(data: QuotationDto) {
  return invoke(
    'update_quotation',
    { quotation: data }
  );
}

  /**
   * Delete quotation
   */
async deleteQuotation(id: number) {
  return invoke(
    'delete_quotation',
    { id }
  );
}

  /**
   * Generate next quotation number
   */
  async generateQuotationNumber(): Promise<string> {
    return await invoke('generate_quotation_number');
  }
}

export const quotationService = new QuotationService();