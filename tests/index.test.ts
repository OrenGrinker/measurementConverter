import { MeasurementConverter, InvalidUnitError } from '../src';

describe('MeasurementConverter', () => {
  describe('convert', () => {
    it('should convert length units correctly', () => {
      const result = MeasurementConverter.convert(1, 'km', 'm');
      expect(result.toValue).toBe(1000);
    });

    it('should convert weight units correctly', () => {
      const result = MeasurementConverter.convert(1, 'kg', 'g');
      expect(result.toValue).toBe(1000);
    });

    it('should convert volume units correctly', () => {
      const result = MeasurementConverter.convert(1, 'l', 'ml');
      expect(result.toValue).toBe(1000);
    });

    it('should convert temperature correctly', () => {
      const result = MeasurementConverter.convert(0, 'C', 'F');
      expect(result.toValue).toBe(32);
    });

    it('should throw error for invalid units', () => {
      expect(() => {
        MeasurementConverter.convert(1, 'invalid', 'm');
      }).toThrow(InvalidUnitError);
    });
  });

  describe('batch', () => {
    it('should convert multiple values correctly', () => {
      const results = MeasurementConverter.batch([
        { value: 1, fromUnit: 'km', toUnit: 'm' },
        { value: 1, fromUnit: 'kg', toUnit: 'g' }
      ]);
      expect(results[0].toValue).toBe(1000);
      expect(results[1].toValue).toBe(1000);
    });
  });

  describe('unit validation', () => {
    it('should validate units correctly', () => {
      expect(MeasurementConverter.validateUnit('km')).toBe(true);
      expect(MeasurementConverter.validateUnit('invalid')).toBe(false);
    });
  });

  describe('getAvailableUnits', () => {
    it('should return units for specific category', () => {
      const lengthUnits = MeasurementConverter.getAvailableUnits('length');
      expect(lengthUnits).toContain('m');
      expect(lengthUnits).toContain('km');
    });

    it('should return all units when no category specified', () => {
      const allUnits = MeasurementConverter.getAvailableUnits();
      expect(allUnits).toContain('m');
      expect(allUnits).toContain('kg');
    });
  });

  describe('getCommonUnits', () => {
    it('should return common units for category', () => {
      const commonLength = MeasurementConverter.getCommonUnits('length');
      expect(commonLength).toContain('m');
      expect(commonLength).toContain('km');
    });

    it('should return empty array for invalid category', () => {
      const invalid = MeasurementConverter.getCommonUnits('invalid');
      expect(invalid).toEqual([]);
    });
  });
});