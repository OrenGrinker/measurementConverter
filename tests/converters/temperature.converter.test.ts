import { TemperatureConverter } from '../../src/converters/temperature.converter';

describe('TemperatureConverter', () => {
  it('should convert Celsius to Fahrenheit correctly', () => {
    const result = TemperatureConverter.convert(0, 'C', 'F');
    expect(result.toValue).toBe(32);
  });

  it('should convert Fahrenheit to Celsius correctly', () => {
    const result = TemperatureConverter.convert(32, 'F', 'C');
    expect(result.toValue).toBe(0);
  });

  it('should convert Kelvin to Celsius correctly', () => {
    const result = TemperatureConverter.convert(273.15, 'K', 'C');
    expect(result.toValue).toBe(0);
  });

  it('should respect precision parameter', () => {
    const result = TemperatureConverter.convert(0, 'C', 'F', 2);
    expect(result.toValue).toBe(32.00);
  });
});
