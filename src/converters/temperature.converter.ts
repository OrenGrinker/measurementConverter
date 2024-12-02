// src/converters/temperature.converter.ts
import { ConversionResult, ConversionOptions, TemperatureUnit } from '../types';
import { temperatureUnits } from '../constants';
import { InvalidUnitError } from '../errors';

export class TemperatureConverter {
  static convert(
    value: number,
    fromUnit: string,
    toUnit: string,
    options: ConversionOptions = {}
  ): ConversionResult {
    const { precision = 4 } = options;
    const lowerFromUnit = fromUnit.toLowerCase() as TemperatureUnit;
    const lowerToUnit = toUnit.toLowerCase() as TemperatureUnit;

    if (!this.isValidUnit(lowerFromUnit) || !this.isValidUnit(lowerToUnit)) {
      throw new InvalidUnitError(`Invalid temperature unit. Valid units are: C, F, K`);
    }

    const converted = this.getConversion(lowerFromUnit, lowerToUnit)(value);

    return {
      fromValue: value,
      fromUnit: fromUnit,
      toValue: Number(converted.toFixed(precision)),
      toUnit: toUnit,
      formula: `Temperature conversion from ${fromUnit} to ${toUnit}`,
      precision
    };
  }

  private static isValidUnit(unit: string): unit is TemperatureUnit {
    return ['c', 'f', 'k'].includes(unit);
  }

  private static getConversion(from: TemperatureUnit, to: TemperatureUnit): (value: number) => number {
    if (from === to) return (value: number) => value;

    const conversionKey = `to${to.toUpperCase()}` as keyof typeof temperatureUnits;
    const conversions = temperatureUnits[conversionKey];
    
    if (typeof conversions === 'function') {
      throw new InvalidUnitError('Invalid temperature conversion');
    }

    const conversion = conversions[from];
    if (!conversion) {
      throw new InvalidUnitError(`Unable to convert from ${from} to ${to}`);
    }

    return conversion;
  }
}