import { renderHook, act } from '@testing-library/react-native';
import { useHealthKit } from '../useHealthKit';
import { HealthKitService } from '../../services/HealthKitService';

jest.mock('../../services/HealthKitService');

describe('useHealthKit', () => {
  const mockHealthKitService = {
    initialize: jest.fn(),
    checkAvailability: jest.fn(),
    requestPermissions: jest.fn(),
    logWaterIntake: jest.fn(),
    getDailyWaterIntake: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (HealthKitService as jest.Mock).mockImplementation(() => mockHealthKitService);
  });

  it('should initialize HealthKit on mount', async () => {
    mockHealthKitService.checkAvailability.mockResolvedValue(true);
    mockHealthKitService.requestPermissions.mockResolvedValue(true);

    const { result } = renderHook(() => useHealthKit());

    expect(mockHealthKitService.initialize).toHaveBeenCalled();
    expect(result.current.isAvailable).toBe(false); // Initially false
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.isAvailable).toBe(true);
    expect(result.current.hasPermissions).toBe(true);
  });

  it('should log water intake', async () => {
    const { result } = renderHook(() => useHealthKit());
    const amount = 250;
    const date = new Date();

    await act(async () => {
      await result.current.logWaterIntake(amount, date);
    });

    expect(mockHealthKitService.logWaterIntake).toHaveBeenCalledWith(amount, date);
  });

  it('should get daily water intake', async () => {
    mockHealthKitService.getDailyWaterIntake.mockResolvedValue(750);
    const { result } = renderHook(() => useHealthKit());
    
    const startDate = new Date();
    const endDate = new Date();

    let total;
    await act(async () => {
      total = await result.current.getDailyWaterIntake(startDate, endDate);
    });

    expect(total).toBe(750);
    expect(mockHealthKitService.getDailyWaterIntake).toHaveBeenCalledWith(startDate, endDate);
  });

  it('should handle errors gracefully', async () => {
    mockHealthKitService.initialize.mockRejectedValue(new Error('HealthKit error'));
    const { result } = renderHook(() => useHealthKit());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.error).toBeTruthy();
  });
});
