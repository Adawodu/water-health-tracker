declare module 'expo-health' {
  export enum PermissionKind {
    WaterIntake = 'waterIntake',
  }

  export enum RecordType {
    WaterIntake = 'waterIntake',
  }

  export interface HealthRecord {
    type: RecordType;
    quantity: number;
    unit: string;
    timestamp: Date;
  }

  export function initialize(): Promise<void>;
  export function isAvailable(): Promise<boolean>;
  export function requestPermissions(permissions: PermissionKind[]): Promise<boolean>;
  export function writeRecords(records: HealthRecord[]): Promise<void>;
  export function readRecords(options: {
    type: RecordType;
    startDate: Date;
    endDate: Date;
  }): Promise<HealthRecord[]>;
}
