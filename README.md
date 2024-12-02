# Measurement Converter

![npm Version](https://img.shields.io/npm/v/measurement-converter)
![TypeScript](https://img.shields.io/npm/types/measurement-converter)
![License](https://img.shields.io/npm/l/measurement-converter)
![Downloads](https://img.shields.io/npm/dm/measurement-converter)
![Node Version](https://img.shields.io/node/v/measurement-converter)

A powerful TypeScript library for handling various unit conversions with high precision and type safety. Perfect for applications requiring measurement conversions, scientific calculations, and engineering tools.

## 🌟 Key Features

- 📏 **Multiple Measurement Types**: Support for length, weight, volume, temperature, and more
- 🎯 **High Precision Calculations**: Configurable precision for all conversions
- 🔍 **Type Safety**: Full TypeScript support with comprehensive type definitions
- 🌐 **Locale Support**: Format results according to different locales
- ⚡ **Batch Conversions**: Convert multiple values at once
- 🧮 **Formula Tracking**: See the conversion formulas used
- ❌ **Error Handling**: Comprehensive error checking and validation

## 📦 Installation

```bash
npm install measurement-converter
```

## 🚀 Quick Start

### Basic Conversions

```typescript
import { MeasurementConverter } from 'measurement-converter';

// Simple length conversion
const length = MeasurementConverter.convert(100, 'km', 'm');
console.log(length);
/* Output:
{
  fromValue: 100,
  fromUnit: 'km',
  toValue: 100000,
  toUnit: 'm',
  formula: '(100 km) * (1000) / (1)',
  precision: 4
}
*/

// Temperature conversion
const temp = MeasurementConverter.convert(32, 'F', 'C');
console.log(MeasurementConverter.formatResult(temp));
// Output: "32 F = 0 C"
```

## 💡 Advanced Usage

### 🔄 Batch Conversion

```typescript
// Convert multiple values at once
const results = MeasurementConverter.batch([
  { value: 1, fromUnit: 'km', toUnit: 'm' },
  { value: 2.5, fromUnit: 'kg', toUnit: 'lb' },
  { value: 30, fromUnit: 'c', toUnit: 'f' }
]);

results.forEach(result => {
  console.log(MeasurementConverter.formatResult(result));
});
```

### 🔍 Unit Validation

```typescript
// Validate units before conversion
const validation = MeasurementConverter.validateUnit('kmh');
if (!validation.isValid && validation.suggestions) {
  console.log(`Did you mean: ${validation.suggestions.join(', ')}?`);
}
```

### 🌐 Locale Support

```typescript
// Format results with specific locale
const result = MeasurementConverter.convert(1, 'km', 'm');
const formatted = MeasurementConverter.formatResult(result, {
  locale: 'fr-FR',
  format: 'long'
});
console.log(formatted);
// Output: "1 kilomètre is equal to 1000 mètres"
```

## 📋 Supported Units

### Length
- Meters (m)
- Kilometers (km)
- Centimeters (cm)
- Millimeters (mm)
- Miles (mile)
- Yards (yard)
- Feet (foot)
- Inches (inch)
- Nautical Miles (nm)
- Micrometers (μm)
- Picometers (pm)

### Weight
- Kilograms (kg)
- Grams (g)
- Milligrams (mg)
- Pounds (lb)
- Ounces (oz)
- Tons (ton)
- Stones (stone)
- Grains (grain)

### Volume
- Liters (l)
- Milliliters (ml)
- Gallons (gal)
- Quarts (qt)
- Cups (cup)
- Fluid Ounces (floz)
- Tablespoons (tbsp)
- Teaspoons (tsp)

### Temperature
- Celsius (c)
- Fahrenheit (f)
- Kelvin (k)

### Area
- Square Meters (m2)
- Square Kilometers (km2)
- Hectares (ha)
- Acres (acre)
- Square Feet (sqft)
- Square Inches (sqin)

### Pressure
- Pascal (pa)
- Bar (bar)
- PSI (psi)
- Atmospheres (atm)
- Millimeters of Mercury (mmhg)

### Energy
- Joules (j)
- Calories (cal)
- Kilowatt Hours (kwh)
- BTU (btu)

### Data Storage
- Bytes (b)
- Kilobytes (kb)
- Megabytes (mb)
- Gigabytes (gb)
- Terabytes (tb)
- Petabytes (pb)

## 📋 Type Definitions

```typescript
interface ConversionResult {
  fromValue: number;
  fromUnit: string;
  toValue: number;
  toUnit: string;
  formula: string;
  precision: number;
}

interface ConversionRequest {
  value: number;
  fromUnit: string;
  toUnit: string;
  precision?: number;
}

interface ConversionOptions {
  precision?: number;
  formatLocale?: string;
  roundingMode?: 'round' | 'ceil' | 'floor';
}

interface ValidationResult {
  isValid: boolean;
  errors?: string[];
  suggestions?: string[];
}
```

## 🔍 Error Handling

```typescript
try {
  const result = MeasurementConverter.convert(100, 'invalid', 'm');
} catch (error) {
  if (error instanceof InvalidUnitError) {
    console.error('Invalid unit:', error.message);
  } else {
    console.error('Unexpected error:', error);
  }
}
```

## 🚀 Best Practices

1. Always validate units before conversion
2. Use proper unit symbols from the supported units list
3. Handle errors appropriately
4. Consider precision requirements for your specific use case
5. Use batch conversions for multiple operations
6. Cache common conversion results if needed

## 🛠️ Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Run tests with coverage
npm test -- --coverage

# Build the project
npm run build

# Lint the code
npm run lint
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -am 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 💬 Support

For support, please [open an issue](https://github.com/OrenGrinker/measurementConverter/issues/new) on GitHub.