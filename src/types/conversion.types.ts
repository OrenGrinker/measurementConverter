export interface ConversionResult {
    fromValue: number;
    fromUnit: string;
    toValue: number;
    toUnit: string;
    formula: string;
    precision: number;
  }
  
  export interface UnitSystem {
    name: string;
    type: 'metric' | 'imperial' | 'other';
    baseUnit: string;
  }
  
  export type ConversionFactors = {
    [key: string]: number | {
      [key: string]: (value: number) => number;
    };
  };
  
  export interface ConversionRequest {
    value: number;
    fromUnit: string;
    toUnit: string;
    precision?: number;
  }
  
  export interface TimezoneInfo {
    cityName: string;
    timezone: string;
    currentOffset: string;
    isDST: boolean;
    dstStart: string;
    region: string;
    subregion: string;
  }