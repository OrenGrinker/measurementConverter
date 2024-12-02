import { 
    ConversionResult, 
    ConversionFactors, 
    ConversionRequest, 
    ConversionOptions,
    ValidationResult,
    TemperatureUnit,
    UnitType
  } from '../types';
  import { InvalidUnitError } from '../errors';
  import {
    temperatureUnits,
    lengthUnits,
    weightUnits,
    volumeUnits,
    areaUnits,
    pressureUnits,
    energyUnits,
    speedUnits,
    dataUnits
  } from '../constants';
  
  export class BaseConverter {
    public static convert(
      value: number,
      fromUnit: string,
      toUnit: string,
      factors: ConversionFactors,
      options: ConversionOptions = {}
    ): ConversionResult {
      const { precision = 4 } = options;
  
      if (!(fromUnit in factors) || !(toUnit in factors)) {
        throw new InvalidUnitError('Invalid unit combination');
      }
  
      const fromFactor = factors[fromUnit];
      const toFactor = factors[toUnit];
  
      if (typeof fromFactor !== 'number' || typeof toFactor !== 'number') {
        throw new InvalidUnitError('Invalid conversion factors');
      }
  
      const baseValue = value * fromFactor;
      const result = baseValue / toFactor;
  
      return {
        fromValue: value,
        fromUnit,
        toValue: Number(result.toFixed(precision)),
        toUnit,
        formula: `(${value} ${fromUnit}) * (${fromFactor}) / (${toFactor})`,
        precision
      };
    }
  
    public static validateUnits(
      fromUnit: string,
      toUnit: string,
      factors: ConversionFactors
    ): ValidationResult {
      const errors: string[] = [];
  
      if (!(fromUnit in factors)) {
        errors.push(`Invalid source unit: ${fromUnit}`);
      }
  
      if (!(toUnit in factors)) {
        errors.push(`Invalid target unit: ${toUnit}`);
      }
  
      return {
        isValid: errors.length === 0,
        errors: errors.length > 0 ? errors : undefined
      };
    }
  }
  
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
        formula: this.getFormula(fromUnit, toUnit),
        precision
      };
    }
  
    static validateUnit(unit: string): ValidationResult {
      const isValid = this.isValidUnit(unit.toLowerCase());
      return {
        isValid,
        errors: isValid ? undefined : [`Invalid temperature unit: ${unit}`],
        suggestions: isValid ? undefined : ['C', 'F', 'K']
      };
    }
  
    private static getFormula(fromUnit: string, toUnit: string): string {
      const formulas = {
        CtoF: '(°C × 9/5) + 32',
        CtoK: '°C + 273.15',
        FtoC: '(°F - 32) × 5/9',
        FtoK: '(°F - 32) × 5/9 + 273.15',
        KtoC: 'K - 273.15',
        KtoF: '(K - 273.15) × 9/5 + 32'
      };
  
      const key = `${fromUnit}to${toUnit}` as keyof typeof formulas;
      return formulas[key] || 'Direct conversion';
    }
  
    private static isValidUnit(unit: string): unit is TemperatureUnit {
      return ['c', 'f', 'k'].includes(unit);
    }
  
    private static getConversion(from: TemperatureUnit, to: TemperatureUnit): (value: number) => number {
      if (from === to) return (value: number) => value;
  
      const conversionKey = `to${to.toUpperCase()}` as keyof typeof temperatureUnits;
      const conversions = temperatureUnits[conversionKey];
      
      if (typeof conversions === 'function' || !conversions[from]) {
        throw new InvalidUnitError(`Invalid conversion from ${from} to ${to}`);
      }
  
      return conversions[from];
    }
  }
  
  export class BatchConverter {
    static convert(
      requests: ConversionRequest[], 
      globalOptions: ConversionOptions = {}
    ): ConversionResult[] {
      return requests.map(request => {
        const options = {
          ...globalOptions,
          precision: request.precision ?? globalOptions.precision
        };
  
        const category = this.getUnitCategory(request.fromUnit);
        if (!category) {
          throw new InvalidUnitError(`Unknown unit: ${request.fromUnit}`);
        }
  
        return this.processSingleConversion(request, category, options);
      });
    }
  
    private static processSingleConversion(
      request: ConversionRequest,
      category: UnitType,
      options: ConversionOptions
    ): ConversionResult {
      const { value, fromUnit, toUnit } = request;
  
      if (category === 'temperature') {
        return TemperatureConverter.convert(value, fromUnit, toUnit, options);
      }
  
      const factors = this.getConversionFactors(category);
      if (!factors) {
        throw new InvalidUnitError(`Unsupported category: ${category}`);
      }
      
      return BaseConverter.convert(value, fromUnit, toUnit, factors, options);
    }
  
    private static getUnitCategory(unit: string): UnitType | undefined {
      const unitFactors = {
        length: lengthUnits,
        weight: weightUnits,
        volume: volumeUnits,
        area: areaUnits,
        pressure: pressureUnits,
        energy: energyUnits,
        speed: speedUnits,
        data: dataUnits,
        temperature: temperatureUnits
      };
  
      const lowerUnit = unit.toLowerCase();
      return Object.keys(unitFactors).find(category => {
        const factors = unitFactors[category as UnitType];
        return typeof factors === 'object' && lowerUnit in factors;
      }) as UnitType | undefined;
    }
  
    private static getConversionFactors(category: UnitType): ConversionFactors | undefined {
      type UnitMapping = {
        [K in Exclude<UnitType, 'temperature'>]: ConversionFactors;
      };
  
      const factorsMap: UnitMapping = {
        length: lengthUnits,
        weight: weightUnits,
        volume: volumeUnits,
        area: areaUnits,
        pressure: pressureUnits,
        energy: energyUnits,
        speed: speedUnits,
        data: dataUnits
      };
  
      return category === 'temperature' ? undefined : factorsMap[category];
    }
  }
  
  // Export all converters
  export const Converters = {
    Base: BaseConverter,
    Temperature: TemperatureConverter,
    Batch: BatchConverter
  };