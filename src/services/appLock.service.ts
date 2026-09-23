import { invoke } from '@tauri-apps/api/core';

import type { AppLockStatus } from '../types/appLock';

class AppLockService {
  async getStatus(): Promise<AppLockStatus> {
    return invoke<AppLockStatus>('get_app_lock_status');
  }

  async verifyPin(pin: string): Promise<boolean> {
    return invoke<boolean>('verify_app_lock_pin', { pin });
  }

  async enable(pin: string): Promise<void> {
    return invoke<void>('enable_app_lock', { pin });
  }

  async disable(pin: string): Promise<void> {
    return invoke<void>('disable_app_lock', { pin });
  }

  async changePin(currentPin: string, newPin: string): Promise<void> {
    return invoke<void>('change_app_lock_pin', { currentPin, newPin });
  }
}

export const appLockService = new AppLockService();