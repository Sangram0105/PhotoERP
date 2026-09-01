import { invoke } from '@tauri-apps/api/core';

import type {
  ClientListItem,
  ClientDetails,
} from '../features/clients/types/client.types';

class ClientService {
  async getClients(): Promise<ClientListItem[]> {
    return invoke<ClientListItem[]>('get_clients');
  }

  async getClientDetails(id: number): Promise<ClientDetails> {
    return invoke<ClientDetails>('get_client_details', { id });
  }

  async updateServiceStatus(
    serviceId: number,
    status: string,
  ): Promise<void> {
    return invoke('update_service_status', {
      serviceId,
      status,
    });
  }
}

export const clientService = new ClientService();
