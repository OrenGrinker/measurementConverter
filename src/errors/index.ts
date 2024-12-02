export class InvalidUnitError extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'InvalidUnitError';
    }
  }
  
  export class ConversionError extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'ConversionError';
    }
  }