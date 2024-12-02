export const temperatureUnits = {
  c: (value: number) => value,
  f: (value: number) => (value - 32) * 5/9,
  k: (value: number) => value - 273.15,
  toC: {
    c: (value: number) => value,
    f: (value: number) => (value - 32) * 5/9,
    k: (value: number) => value - 273.15
  },
  toF: {
    c: (value: number) => value * 9/5 + 32,
    f: (value: number) => value,
    k: (value: number) => (value - 273.15) * 9/5 + 32
  },
  toK: {
    c: (value: number) => value + 273.15,
    f: (value: number) => (value - 32) * 5/9 + 273.15,
    k: (value: number) => value
  }
};