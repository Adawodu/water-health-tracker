import { Platform, View, Text, StyleSheet } from 'react-native';
import { WaterIntake } from './src/features/water-tracking/WaterIntake';

export default function App() {
  if (Platform.OS === 'web') {
    return (
      <div style={webStyles.container}>
        <h1 style={webStyles.title}>Water Health Tracker</h1>
        <p style={webStyles.note}>
          Note: HealthKit features are only available on iOS devices.
          This is a demo of the web interface.
        </p>
        <WaterIntake />
      </div>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Water Health Tracker</Text>
      <WaterIntake />
    </View>
  );
}

const webStyles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#f0f0f0',
    padding: '20px',
  },
  title: {
    fontSize: '24px',
    marginBottom: '20px',
    color: '#333',
  },
  note: {
    color: '#666',
    marginBottom: '20px',
    textAlign: 'center' as const,
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: '#333',
  },
});
