class AppState {
  constructor() {
    this.inputText = null;          // Raw user input
    this.extractedValues = [];      // Array of extracted RN or VIN values
    this.valueTypes = [];           // Array of 'rn' or 'vin' types
    this.configurations = [];       // Array of configuration objects from API
    this.isValid = [];              // Array of validation results
    this.responseMessage = null;    // Plain English response
  }
}

module.exports = AppState;
