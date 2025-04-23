export const mockLogWaterIntake = jest.fn();
export const mockGetDailyWaterIntake = jest.fn().mockResolvedValue(0);

export const useHealthKit = () => ({
  isAvailable: true,
  hasPermissions: true,
  error: null,
  logWaterIntake: mockLogWaterIntake,
  getDailyWaterIntake: mockGetDailyWaterIntake,
});
