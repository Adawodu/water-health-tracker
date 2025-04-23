import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import { WaterIntake } from '../WaterIntake';
import * as Health from 'expo-health';

jest.mock('../../hooks/useHealthKit');

describe('WaterIntake', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render initial water intake as 0ml', async () => {
    const { getByTestId } = render(<WaterIntake />);
    const waterAmount = getByTestId('water-amount');
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(waterAmount).toHaveTextContent('0 ml');
  });

  it('should increment water intake when add button is pressed', async () => {
    const { getByTestId } = render(<WaterIntake />);
    const addButton = getByTestId('add-water-button');
    const waterAmount = getByTestId('water-amount');
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
      fireEvent.press(addButton);
    });

    expect(waterAmount).toHaveTextContent('250 ml');
  });

  it('should not allow negative water intake', async () => {
    const { getByTestId } = render(<WaterIntake />);
    const decreaseButton = getByTestId('decrease-water-button');
    const waterAmount = getByTestId('water-amount');
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
      fireEvent.press(decreaseButton);
    });

    expect(waterAmount).toHaveTextContent('0 ml');
  });

  it('should show warning when HealthKit is not available', async () => {
    jest.spyOn(Health, 'isAvailable').mockResolvedValue(false);
    
    const { getByText } = render(<WaterIntake />);
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(getByText('HealthKit is not available')).toBeTruthy();
  });
});
