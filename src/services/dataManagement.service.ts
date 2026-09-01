import { invoke } from '@tauri-apps/api/core';

import type { DatabaseInfo } from '../features/settings/types/dataManagement.types';

class DataManagementService {
  /**
   * Export a consistent backup of the full database to the chosen path.
   * Returns the path where the backup was saved.
   */
  async exportBackup(destinationPath: string): Promise<string> {
    return invoke<string>('backup_database', {
      destinationPath,
    });
  }

  /**
   * Restore the database from a validated backup file.
   * A safety backup of the current data is created first.
   */
  async restoreBackup(backupPath: string): Promise<string> {
    return invoke<string>('restore_database', {
      backupPath,
    });
  }

  /**
   * Read information about the current database (path, size, modified time).
   */
  async getDatabaseInfo(): Promise<DatabaseInfo> {
    return invoke<DatabaseInfo>('get_database_info');
  }
}

export const dataManagementService = new DataManagementService();