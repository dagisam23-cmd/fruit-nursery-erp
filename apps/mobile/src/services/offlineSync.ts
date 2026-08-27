import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import NetInfo from '@react-native-community/netinfo';

export interface SyncRecord {
  id: string;
  entity_type: string;
  data: any;
  operation: 'create' | 'update' | 'delete';
  timestamp: number;
  syncStatus: 'pending' | 'synced' | 'conflict';
}

class OfflineSyncService {
  private readonly DB_PREFIX = 'erp_sync_';
  private syncInterval: NodeJS.Timer | null = null;
  private readonly SYNC_INTERVAL = 5 * 60 * 1000; // 5 minutes

  async initialize() {
    // Start automatic sync when online
    this.startAutoSync();
  }

  /**
   * Save a record locally for offline use
   */
  async saveRecord(entityType: string, data: any, operation: 'create' | 'update' | 'delete' = 'create') {
    const record: SyncRecord = {
      id: data.id || `${Date.now()}_${Math.random()}`,
      entity_type: entityType,
      data,
      operation,
      timestamp: Date.now(),
      syncStatus: 'pending',
    };

    const key = `${this.DB_PREFIX}${entityType}_${record.id}`;
    await AsyncStorage.setItem(key, JSON.stringify(record));

    return record;
  }

  /**
   * Get all pending records
   */
  async getPendingChanges(): Promise<SyncRecord[]> {
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      const syncKeys = allKeys.filter((key) => key.startsWith(this.DB_PREFIX));

      const records: SyncRecord[] = [];
      for (const key of syncKeys) {
        const item = await AsyncStorage.getItem(key);
        if (item) {
          const record = JSON.parse(item);
          if (record.syncStatus === 'pending') {
            records.push(record);
          }
        }
      }

      return records;
    } catch (error) {
      console.error('Error getting pending changes:', error);
      return [];
    }
  }

  /**
   * Sync all pending records with server
   */
  async syncAll() {
    const isOnline = await this.isConnected();
    if (!isOnline) {
      throw new Error('No internet connection');
    }

    const pendingRecords = await this.getPendingChanges();
    const syncResults = {
      synced: 0,
      failed: 0,
      conflicts: [] as any[],
    };

    for (const record of pendingRecords) {
      try {
        const endpoint = `/api/v1/${record.entity_type}`;
        
        let response;
        switch (record.operation) {
          case 'create':
            response = await axios.post(endpoint, record.data);
            break;
          case 'update':
            response = await axios.put(`${endpoint}/${record.id}`, record.data);
            break;
          case 'delete':
            response = await axios.delete(`${endpoint}/${record.id}`);
            break;
        }

        // Mark as synced
        const key = `${this.DB_PREFIX}${record.entity_type}_${record.id}`;
        record.syncStatus = 'synced';
        await AsyncStorage.setItem(key, JSON.stringify(record));
        syncResults.synced++;
      } catch (error: any) {
        if (error.response?.status === 409) {
          // Conflict detected
          syncResults.conflicts.push({
            recordId: record.id,
            error: error.response.data,
          });
          record.syncStatus = 'conflict';
          const key = `${this.DB_PREFIX}${record.entity_type}_${record.id}`;
          await AsyncStorage.setItem(key, JSON.stringify(record));
        } else {
          syncResults.failed++;
        }
      }
    }

    if (syncResults.conflicts.length > 0) {
      throw new Error('Sync completed with conflicts');
    }

    return syncResults;
  }

  /**
   * Check internet connection
   */
  private async isConnected(): Promise<boolean> {
    const state = await NetInfo.fetch();
    return state.isConnected || false;
  }

  /**
   * Start automatic sync
   */
  private startAutoSync() {
    this.syncInterval = setInterval(async () => {
      const isOnline = await this.isConnected();
      if (isOnline) {
        try {
          await this.syncAll();
          console.log('Auto-sync completed');
        } catch (error) {
          console.error('Auto-sync failed:', error);
        }
      }
    }, this.SYNC_INTERVAL);
  }

  /**
   * Stop automatic sync
   */
  stopAutoSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }

  /**
   * Resolve conflict by choosing server version
   */
  async resolveConflict(recordId: string, entityType: string, useServer: boolean) {
    if (useServer) {
      // Delete local version
      const key = `${this.DB_PREFIX}${entityType}_${recordId}`;
      await AsyncStorage.removeItem(key);
    } else {
      // Mark for re-sync
      const key = `${this.DB_PREFIX}${entityType}_${recordId}`;
      const item = await AsyncStorage.getItem(key);
      if (item) {
        const record = JSON.parse(item);
        record.syncStatus = 'pending';
        await AsyncStorage.setItem(key, JSON.stringify(record));
      }
    }
  }
}

export const OfflineSyncManager = new OfflineSyncService();
