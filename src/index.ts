// src/index.ts
import { 
  ConversionResult, 
  ConversionRequest, 
  ConversionOptions,
  UnitType,
  ValidationResult,
  FormatOptions
} from './types';
import { BaseConverter, TemperatureConverter } from './converters';
import { InvalidUnitError } from './errors';
import {
  lengthUnits,
  weightUnits,
  volumeUnits,
  areaUnits,
  pressureUnits,
  energyUnits,
  speedUnits,
  dataUnits
} from './constants';

export class MeasurementConverter {
  private static readonly unitFactors: Record<UnitType, Record<string, number>> = {
    length: lengthUnits,
    weight: weightUnits,
    volume: volumeUnits,
    area: areaUnits,
    pressure: pressureUnits,
    energy: energyUnits,
    speed: speedUnits,
    data: dataUnits,
    temperature: {} // Placeholder for type completion
  };

  static convert(
    value: number,
    fromUnit: string,
    toUnit: string,
    options: ConversionOptions = {}
  ): ConversionResult {
    // First check if it's a temperature conversion
    if (this.isTemperatureUnit(fromUnit) || this.isTemperatureUnit(toUnit)) {
      return TemperatureConverter.convert(value, fromUnit, toUnit, options);
    }

    const category = this.getUnitCategory(fromUnit);
    if (!category) {
      throw new InvalidUnitError(`Unsupported unit: ${fromUnit}`);
    }

    const factors = this.unitFactors[category];
    return BaseConverter.convert(value, fromUnit, toUnit, factors, options);
  }

  static batch(
    conversions: ConversionRequest[],
    globalOptions: ConversionOptions = {}
  ): ConversionResult[] {
    return conversions.map(conv => 
      this.convert(
        conv.value, 
        conv.fromUnit, 
        conv.toUnit, 
        {
          ...globalOptions,
          precision: conv.precision ?? globalOptions.precision
        }
      )
    );
  }

  static getAvailableUnits(category?: UnitType): string[] {
    if (category) {
      return Object.keys(this.unitFactors[category]);
    }

    return Object.values(this.unitFactors).reduce<string[]>((acc, factors) => 
      [...acc, ...Object.keys(factors)], 
    []);
  }

  static getSupportedCategories(): UnitType[] {
    return Object.keys(this.unitFactors) as UnitType[];
  }

  static validateUnit(unit: string): ValidationResult {
    if (this.isTemperatureUnit(unit)) {
      return { isValid: true };
    }

    const category = this.getUnitCategory(unit);
    if (!category) {
      const suggestions = this.findSimilarUnits(unit);
      return {
        isValid: false,
        errors: [`Unknown unit: ${unit}`],
        suggestions: suggestions.length ? suggestions : undefined
      };
    }

    return {
      isValid: true
    };
  }

  static getCommonUnits(category: UnitType): readonly string[] {
    const commonUnitMap: Record<UnitType, readonly string[]> = {
      length: ['m', 'km', 'cm', 'mm', 'mile', 'foot', 'inch'],
      weight: ['kg', 'g', 'lb', 'oz'],
      volume: ['l', 'ml', 'gal', 'cup'],
      temperature: ['c', 'f', 'k'],
      area: ['m2', 'km2', 'ha', 'acre'],
      pressure: ['pa', 'bar', 'psi', 'atm'],
      energy: ['j', 'kj', 'cal', 'kwh'],
      speed: ['kph', 'mph', 'mps'],
      data: ['kb', 'mb', 'gb', 'tb']
    };

    return commonUnitMap[category] || [];
  }

  static formatResult(
    result: ConversionResult,
    options: FormatOptions = {}
  ): string {
    const { format = 'short' } = options;
    
    if (format === 'long') {
      return `${result.fromValue} ${result.fromUnit} is equal to ${result.toValue} ${result.toUnit}`;
    }
    
    return `${result.fromValue} ${result.fromUnit} = ${result.toValue} ${result.toUnit}`;
  }

  private static getUnitCategory(unit: string): UnitType | undefined {
    const lowerUnit = unit.toLowerCase();
    return Object.keys(this.unitFactors).find(category => 
      lowerUnit in this.unitFactors[category as UnitType]
    ) as UnitType | undefined;
  }

  private static isTemperatureUnit(unit: string): boolean {
    const normalizedUnit = unit.toLowerCase();
    return ['c', 'f', 'k'].includes(normalizedUnit);
  }

  private static findSimilarUnits(unit: string, maxSuggestions: number = 3): string[] {
    const allUnits = this.getAvailableUnits();
    return allUnits
      .filter(availableUnit => this.calculateSimilarity(unit, availableUnit) > 0.5)
      .slice(0, maxSuggestions);
  }

  private static calculateSimilarity(a: string, b: string): number {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;

    const matrix = Array(a.length + 1).fill(null).map(() => 
      Array(b.length + 1).fill(null)
    );

    for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
    for (let j = 0; j <= b.length; j++) matrix[0][j] = j;

    for (let i = 1; i <= a.length; i++) {
      for (let j = 1; j <= b.length; j++) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j - 1] + cost
        );
      }
    }

    const maxLength = Math.max(a.length, b.length);
    const distance = matrix[a.length][b.length];
    return (maxLength - distance) / maxLength;
  }
}

// Export types and errors
export {
  ConversionResult,
  ConversionRequest,
  ConversionOptions,
  UnitType,
  ValidationResult,
  FormatOptions,
  InvalidUnitError
};