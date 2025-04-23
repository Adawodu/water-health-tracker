import { Platform } from 'react-native';

interface WaterIntakeRecord {
  timestamp: Date;
  quantity: number;
}

class WebStorageService {
  private static KEY = 'waterIntakeRecords';

  static getRecords(): WaterIntakeRecord[] {
    try {
      const stored = localStorage.getItem(this.KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  static saveRecord(record: WaterIntakeRecord) {
    const records = this.getRecords();
    records.push(record);
    localStorage.setItem(this.KEY, JSON.stringify(records));
  }

  static getRecordsInRange(startDate: Date, endDate: Date): WaterIntakeRecord[] {
    return this.getRecords().filter(record => {
      const timestamp = new Date(record.timestamp);
      return timestamp >= startDate && timestamp <= endDate;
    });
  }
}

export class HealthKitService {
  async initialize(): Promise<void> {
    // No initialization needed for web
    return Promise.resolve();
  }

  async checkAvailability(): Promise<boolean> {
    // Web storage is always available
    return true;
  }

  async requestPermissions(): Promise<boolean> {
    // No permissions needed for web storage
    return true;
  }

  async logWaterIntake(amount: number, timestamp: Date = new Date()): Promise<void> {
    if (Platform.OS === 'web') {
      WebStorageService.saveRecord({ timestamp, quantity: amount });
    }
  }

  async getDailyWaterIntake(startDate: Date, endDate: Date): Promise<number> {
    if (Platform.OS === 'web') {
      const records = WebStorageService.getRecordsInRange(startDate, endDate);
      return records.reduce((total, record) => total + record.quantity, 0);
    }
    return 0;
  }
}
