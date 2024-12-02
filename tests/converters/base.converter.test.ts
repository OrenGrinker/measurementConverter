import { BaseConverter } from '../../src/converters/base.converter';
import { InvalidUnitError } from '../../src/errors';

describe('BaseConverter', () => {
  const mockFactors = {
    a: 1,
    b: 2,
    c: 0.5
  };

  it('should convert units correctly', () => {
    const result = (BaseConverter as any).convert(10, 'a', 'b', mockFactors);
    expect(result.toValue).toBe(5);
    expect(result.formula).toBe('(10 a) * (1) / (2)');
  });

  it('should throw error for invalid units', () => {
    expect(() => {
      (BaseConverter as any).convert(10, 'a', 'invalid', mockFactors);
    }).toThrow(InvalidUnitError);
  });

  it('should respect precision parameter', () => {
    const result = (BaseConverter as any).convert(10, 'a', 'c', mockFactors, 2);
    expect(result.toValue).toBe(20.00);
  });
});
