const configTool = require('../tools/configTool');
const validationTool = require('../tools/validationTool');
const llmTool = require('../tools/llmTool');

const nodes = {
  parseInput: async (state) => {
    const input = state.inputText.toLowerCase();
    const vinMatch = input.match(/vin[\w\d]+/);
    const rnMatch = input.match(/rn[\w\d]+/);

    if (vinMatch) {
      state.extractedValue = vinMatch[0].replace('vin', '');
      state.valueType = 'vin';
    } else if (rnMatch) {
      state.extractedValue = rnMatch[0].replace('rn', '');
      state.valueType = 'rn';
    } else if (input.includes('vin')) {
      state.valueType = 'vin';
      state.responseMessage = await llmTool.clarifyInput(input, 'vin');
    } else if (input.includes('rn')) {
      state.valueType = 'rn';
      state.responseMessage = await llmTool.clarifyInput(input, 'rn');
    } else {
      state.responseMessage = await llmTool.clarifyInput(input, null);
    }
    return state;
  },

  fetchConfig: async (state) => {
    if (!state.extractedValue || state.responseMessage) return state; // Skip if clarification needed

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
    if (!state.configurations || state.responseMessage) return state; // Skip if no config or clarification sent

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

  end: (state) => {
    return state;
  },
};

module.exports = nodes;
