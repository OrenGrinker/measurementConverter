import { ConversionResult, ConversionFactors } from '../types';
import { InvalidUnitError } from '../errors';

export class BaseConverter {
  protected static convert(
    value: number,
    fromUnit: string,
    toUnit: string,
    factors: ConversionFactors,
    precision: number = 4
  ): ConversionResult {
    if (!(fromUnit in factors) || !(toUnit in factors)) {
      throw new InvalidUnitError('Invalid unit combination');
    }

    const baseValue = value * (factors[fromUnit] as number);
    const result = baseValue / (factors[toUnit] as number);

    return {
      fromValue: value,
      fromUnit,
      toValue: Number(result.toFixed(precision)),
      toUnit,
      formula: `(${value} ${fromUnit}) * (${factors[fromUnit]}) / (${factors[toUnit]})`,
      precision
    };
  }
}