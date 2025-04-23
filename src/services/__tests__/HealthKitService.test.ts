import * as Health from 'expo-health';
import { HealthKitService } from '../HealthKitService';

jest.mock('expo-health', () => ({
  initialize: jest.fn(),
  isAvailable: jest.fn(),
  requestPermissions: jest.fn(),
  readRecords: jest.fn(),
  writeRecords: jest.fn(),
  PermissionKind: {
    WaterIntake: 'waterIntake',
  },
  RecordType: {
    WaterIntake: 'waterIntake',
  },
}));

describe('HealthKitService', () => {
  let healthKitService: HealthKitService;

  beforeEach(() => {
    jest.clearAllMocks();
    healthKitService = new HealthKitService();
  });

  it('should check if HealthKit is available', async () => {
    (Health.isAvailable as jest.Mock).mockResolvedValue(true);
    const isAvailable = await healthKitService.checkAvailability();
    expect(isAvailable).toBe(true);
    expect(Health.isAvailable).toHaveBeenCalled();
  });

  it('should request permissions', async () => {
    (Health.requestPermissions as jest.Mock).mockResolvedValue(true);
    const hasPermissions = await healthKitService.requestPermissions();
    expect(hasPermissions).toBe(true);
    expect(Health.requestPermissions).toHaveBeenCalledWith([
      Health.PermissionKind.WaterIntake,
    ]);
  });

  it('should log water intake', async () => {
    const amount = 250;
    const timestamp = new Date();
    (Health.writeRecords as jest.Mock).mockResolvedValue(true);

    await healthKitService.logWaterIntake(amount, timestamp);
    
    expect(Health.writeRecords).toHaveBeenCalledWith([
      {
        type: Health.RecordType.WaterIntake,
        quantity: amount,
        unit: 'ml',
        timestamp,
      },
    ]);
  });

  it('should get daily water intake', async () => {
    const mockRecords = [
      { quantity: 250 },
      { quantity: 500 },
    ];
    (Health.readRecords as jest.Mock).mockResolvedValue(mockRecords);

    const startDate = new Date();
    const endDate = new Date();
    const total = await healthKitService.getDailyWaterIntake(startDate, endDate);

    expect(total).toBe(750);
    expect(Health.readRecords).toHaveBeenCalledWith({
      type: Health.RecordType.WaterIntake,
      startDate,
      endDate,
    });
  });

  it('should handle errors gracefully', async () => {
    (Health.writeRecords as jest.Mock).mockRejectedValue(new Error('HealthKit error'));
    
    await expect(healthKitService.logWaterIntake(250, new Date()))
      .rejects
      .toThrow('Failed to log water intake to HealthKit');
  });
});
