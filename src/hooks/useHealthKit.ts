import { useState, useEffect } from 'react';
import { HealthKitService } from '../services/HealthKitService';

export const useHealthKit = () => {
  const [isAvailable, setIsAvailable] = useState(false);
  const [hasPermissions, setHasPermissions] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [healthKitService] = useState(() => new HealthKitService());

  useEffect(() => {
    const initializeHealthKit = async () => {
      try {
        await healthKitService.initialize();
        const available = await healthKitService.checkAvailability();
        setIsAvailable(available);

        if (available) {
          const permissions = await healthKitService.requestPermissions();
          setHasPermissions(permissions);
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to initialize HealthKit'));
      }
    };

    initializeHealthKit();
  }, [healthKitService]);

  const logWaterIntake = async (amount: number, timestamp: Date = new Date()) => {
    try {
      await healthKitService.logWaterIntake(amount, timestamp);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to log water intake'));
      throw err;
    }
  };

  const getDailyWaterIntake = async (startDate: Date, endDate: Date) => {
    try {
      return await healthKitService.getDailyWaterIntake(startDate, endDate);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to get water intake'));
      return 0;
    }
  };

  return {
    isAvailable,
    hasPermissions,
    error,
    logWaterIntake,
    getDailyWaterIntake,
  };
};
