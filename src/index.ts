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
    dataUnits,
    commonUnits
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
      temperature: {} // Temperature has special handling
    };
  
    /**
     * Convert a value from one unit to another
     */
    static convert(
      value: number,
      fromUnit: string,
      toUnit: string,
      options: ConversionOptions = {}
    ): ConversionResult {
      const category = this.getUnitCategory(fromUnit);
      
      if (!category) {
        throw new InvalidUnitError(`Unsupported unit: ${fromUnit}`);
      }
  
      if (category === 'temperature') {
        return TemperatureConverter.convert(value, fromUnit, toUnit, options);
      }
  
      const factors = this.unitFactors[category];
      return BaseConverter.convert(value, fromUnit, toUnit, factors, options);
    }
  
    /**
     * Convert multiple values at once
     */
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
  
    /**
     * Get all available units for a category
     */
    static getAvailableUnits(category?: UnitType): string[] {
      if (category) {
        return Object.keys(this.unitFactors[category]);
      }
  
      return Object.values(this.unitFactors).reduce<string[]>(
        (acc, factors) => [...acc, ...Object.keys(factors)],
        []
      );
    }
  
    /**
     * Get all supported measurement categories
     */
    static getSupportedCategories(): UnitType[] {
      return Object.keys(this.unitFactors) as UnitType[];
    }
  
    /**
     * Validate a unit and get suggestions if invalid
     */
    static validateUnit(unit: string): ValidationResult {
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
  
    /**
     * Get commonly used units for a category
     */
    static getCommonUnits(category: keyof typeof commonUnits): readonly string[] {
      return commonUnits[category] || [];
    }
  
    /**
     * Format a conversion result as a string
     */
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
  
    /**
     * Get the measurement category for a unit
     */
    private static getUnitCategory(unit: string): UnitType | undefined {
      const lowerUnit = unit.toLowerCase();
      return Object.keys(this.unitFactors).find(category => 
        lowerUnit in this.unitFactors[category as UnitType]
      ) as UnitType | undefined;
    }
  
    /**
     * Find similar units for suggestions
     */
    private static findSimilarUnits(unit: string, maxSuggestions: number = 3): string[] {
      const allUnits = this.getAvailableUnits();
      return allUnits
        .filter(availableUnit => this.calculateSimilarity(unit, availableUnit) > 0.5)
        .slice(0, maxSuggestions);
    }
  
    /**
     * Calculate string similarity for unit suggestions
     */
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