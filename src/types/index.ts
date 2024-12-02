// Basic conversion interfaces
export interface ConversionResult {
    fromValue: number;
    fromUnit: string;
    toValue: number;
    toUnit: string;
    formula: string;
    precision: number;
  }
  
  export interface ConversionRequest {
    value: number;
    fromUnit: string;
    toUnit: string;
    precision?: number;
  }
  
  export interface ConversionOptions {
    precision?: number;
    formatLocale?: string;
    roundingMode?: 'round' | 'ceil' | 'floor';
  }
  
  // Unit type definitions
  export type UnitType = 
    | 'length'
    | 'weight'
    | 'volume'
    | 'temperature'
    | 'area'
    | 'pressure'
    | 'energy'
    | 'speed'
    | 'data';
  
  export type TemperatureUnit = 'c' | 'f' | 'k';
  
  // Conversion factors type
  export type ConversionFactors = {
    [key: string]: number;
  };
  
  export type TemperatureConversionFactors = {
    [K in TemperatureUnit | `to${Uppercase<TemperatureUnit>}`]: K extends TemperatureUnit
      ? (value: number) => number
      : { [T in TemperatureUnit]: (value: number) => number };
  };
  
  // System definitions
  export interface UnitSystem {
    name: string;
    type: 'metric' | 'imperial' | 'other';
    baseUnit: string;
  }
  
  export interface UnitDefinition {
    symbol: string;
    name: string;
    type: UnitType;
    system: UnitSystem['type'];
    factor: number;
  }
  
  // Validation results
  export interface ValidationResult {
    isValid: boolean;
    errors?: string[];
    suggestions?: string[];
  }

  export interface FormatOptions {
  format?: 'short' | 'long';
  locale?: string;
}

  export interface TemperatureConversions {
  [key: string]: {
    [K in TemperatureUnit]: (value: number) => number;
  };
}