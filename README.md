# Water Health Tracker

A cross-platform application for tracking daily water intake, built with React Native and Expo. The app integrates with HealthKit on iOS devices and provides a web interface with local storage support for other platforms.

## Features

- Track daily water intake
- Integration with Apple HealthKit (iOS)
- Web support with local storage
- Beautiful, responsive UI
- Cross-platform compatibility (iOS, Web)

## Technologies Used

- React Native
- Expo
- TypeScript
- Apple HealthKit
- Local Storage (Web)

## Getting Started

1. Clone the repository
```bash
git clone <repository-url>
cd water-health-tracker
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm start
```

4. Run on your preferred platform:
- Press `i` to run on iOS simulator
- Press `w` to run in web browser
- Scan QR code with Expo Go app to run on your device

## Development

The project uses TypeScript and follows a feature-based directory structure:

```
src/
  ├── features/
  │   └── water-tracking/
  │       └── WaterIntake.tsx
  ├── hooks/
  │   └── useHealthKit.ts
  └── services/
      └── HealthKitService.ts
```

## License

MIT
