const configTool = require('../tools/configTool');
const validationTool = require('../tools/validationTool');
const llmTool = require('../tools/llmTool');
const nodes = {
  parseInput: (state) => {
    const input = state.inputText.toLowerCase();
    const vinMatch = input.match(/vin[\w\d]+/);
    const rnMatch = input.match(/rn[\w\d]+/);
    if (vinMatch) {
      state.extractedValue = vinMatch[0].replace('vin', '');
      state.valueType = 'vin';
    } else if (rnMatch) {
      state.extractedValue = rnMatch[0].replace('rn', '');
      state.valueType = 'rn';
    } else {
      state.responseMessage = "I couldn't find a valid RN or VIN in your input. Please provide a clear RN or VIN.";
    }
    return state;
  },
  fetchConfig: async (state) => {
    if (!state.extractedValue) return state;
    try {
      if (state.valueType === 'rn') {
        state.configurations = await configTool.getConfigByRN(state.extractedValue);
      } else if (state.valueType === 'vin') {
        state.configurations = await configTool.getConfigByVIN(state.extractedValue);
      }
    } catch (error) {
      state.responseMessage = `Failed to fetch configuration: ${error.message}`;
    }
    return state;
  },
  validateConfig: async (state) => {
    if (!state.configurations) {
      state.responseMessage = "No configuration was retrieved to validate.";
      return state;
    }
    try {
      state.isValid = await validationTool.validateConfig(state.configurations);
      state.responseMessage = await llmTool.explainResponse(
        state.configurations,
        state.isValid,
        state.valueType,
        state.extractedValue
      );
    } catch (error) {
      state.responseMessage = `Validation or explanation failed: ${error.message}`;
    }
    return state;
  },
  end: (state) => { return state; },
};
module.exports = nodes;
