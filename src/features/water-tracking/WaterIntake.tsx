import React, { useState, useEffect } from 'react';
import { Platform, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useHealthKit } from '../../hooks/useHealthKit';

export const WaterIntake: React.FC = () => {
  const [waterAmount, setWaterAmount] = useState(0);
  const { isAvailable, hasPermissions, error, logWaterIntake, getDailyWaterIntake } = useHealthKit();
  const INCREMENT_AMOUNT = 250; // 250ml per increment

  useEffect(() => {
    if (error && Platform.OS !== 'web') {
      console.error('Error:', error.message);
    }
  }, [error]);

  useEffect(() => {
    const fetchTodayWaterIntake = async () => {
      if (Platform.OS === 'web') {
        // On web, we'll use local storage to simulate HealthKit
        const stored = localStorage.getItem('waterAmount');
        if (stored) {
          setWaterAmount(parseInt(stored, 10));
        }
      } else if (isAvailable && hasPermissions) {
        const startDate = new Date();
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date();
        const total = await getDailyWaterIntake(startDate, endDate);
        setWaterAmount(total);
      }
    };

    fetchTodayWaterIntake();
  }, [isAvailable, hasPermissions, getDailyWaterIntake]);

  const addWater = async () => {
    try {
      const newAmount = waterAmount + INCREMENT_AMOUNT;
      if (Platform.OS === 'web') {
        setWaterAmount(newAmount);
        localStorage.setItem('waterAmount', newAmount.toString());
      } else if (Platform.OS === 'ios' || Platform.OS === 'android') {
        await logWaterIntake(INCREMENT_AMOUNT);
        setWaterAmount(newAmount);
      }
    } catch (error) {
      console.error('Failed to log water intake:', error);
    }
  };

  const decreaseWater = async () => {
    if (waterAmount === 0) return;
    
    const newAmount = Math.max(0, waterAmount - INCREMENT_AMOUNT);
    setWaterAmount(newAmount);
    
    if (isAvailable && hasPermissions) {
      try {
        await logWaterIntake(-INCREMENT_AMOUNT);
      } catch (error) {
        setWaterAmount(waterAmount); // Revert on error
        Alert.alert('Error', 'Failed to update water intake');
      }
    }
  };

  if (Platform.OS === 'web') {
    return (
      <div style={webStyles.container}>
        <div style={webStyles.amountDisplay}>
          <span style={webStyles.amount}>{waterAmount}</span>
          <span style={webStyles.unit}>ml</span>
        </div>
        <button
          onClick={addWater}
          style={webStyles.button}
        >
          Add Water (+{INCREMENT_AMOUNT}ml)
        </button>
        <p style={webStyles.info}>Your daily water intake goal: 2000ml</p>
      </div>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.amountDisplay}>
        <Text style={styles.amount}>{waterAmount}</Text>
        <Text style={styles.unit}>ml</Text>
      </View>
      <TouchableOpacity
        onPress={addWater}
        style={styles.button}
        disabled={Platform.OS !== 'web' && (!isAvailable || !hasPermissions)}
      >
        <Text style={styles.buttonText}>Add Water (+{INCREMENT_AMOUNT}ml)</Text>
      </TouchableOpacity>
      <Text style={styles.info}>Your daily water intake goal: 2000ml</Text>

      {!isAvailable && (
        <Text style={styles.warning}>HealthKit is not available on this device</Text>
      )}

      {isAvailable && !hasPermissions && (
        <Text style={styles.warning}>Please grant HealthKit permissions</Text>
      )}
    </View>
  );
};

const webStyles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    minWidth: '300px',
  },
  amountDisplay: {
    display: 'flex',
    alignItems: 'baseline',
    marginBottom: '20px',
  },
  amount: {
    fontSize: '48px',
    fontWeight: 'bold' as const,
    color: '#2196f3',
  },
  unit: {
    fontSize: '24px',
    color: '#666',
    marginLeft: '8px',
  },
  button: {
    backgroundColor: '#2196f3',
    color: '#ffffff',
    padding: '12px 24px',
    border: 'none',
    borderRadius: '6px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    ':hover': {
      backgroundColor: '#1976d2',
    },
  },
  info: {
    marginTop: '20px',
    color: '#666',
    fontSize: '14px',
  },
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    minWidth: 300,
  },
  amountDisplay: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 20,
  },
  amount: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#2196f3',
  },
  unit: {
    fontSize: 24,
    color: '#666',
    marginLeft: 8,
  },
  button: {
    backgroundColor: '#2196f3',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
  },
  info: {
    marginTop: 20,
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
  },
  warning: {
    color: '#FF3B30',
    textAlign: 'center',
    marginTop: 10,
    fontSize: 14,
  },
});
