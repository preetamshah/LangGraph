const configTool = require('../tools/configTool');
const validationTool = require('../tools/validationTool');
const llmTool = require('../tools/llmTool');

const nodes = {
  parseInput: async (state) => {
    const input = state.inputText.toLowerCase();
    const vinMatches = input.match(/vin[\w\d]+/g) || [];
    const rnMatches = input.match(/rn[\w\d]+/g) || [];

    state.extractedValues = [
      ...rnMatches.map((rn) => rn.replace('rn', '')),
      ...vinMatches.map((vin) => vin.replace('vin', '')),
    ];
    state.valueTypes = [
      ...rnMatches.map(() => 'rn'),
      ...vinMatches.map(() => 'vin'),
    ];

    if (state.extractedValues.length === 0) {
      if (input.includes('vin')) {
        state.responseMessage = await llmTool.clarifyInput(input, 'vin');
      } else if (input.includes('rn')) {
        state.responseMessage = await llmTool.clarifyInput(input, 'rn');
      } else {
        state.responseMessage = await llmTool.clarifyInput(input, null);
      }
    }
    return state;
  },

  fetchConfig: async (state) => {
    if (state.extractedValues.length === 0 || state.responseMessage) return state;

    try {
      const fetchPromises = state.valueTypes.map((type, i) =>
        type === 'rn'
          ? configTool.getConfigByRN(state.extractedValues[i])
          : configTool.getConfigByVIN(state.extractedValues[i])
      );
      state.configurations = await Promise.all(fetchPromises);
    } catch (error) {
      state.responseMessage = `Failed to fetch configurations: ${error.message}`;
    }
    return state;
  },

  validateConfig: async (state) => {
    if (state.configurations.length === 0 || state.responseMessage) return state;

    try {
      const validatePromises = state.configurations.map((config) =>
        validationTool.validateConfig(config)
      );
      state.isValid = await Promise.all(validatePromises);
      state.responseMessage = await llmTool.explainResponse(
        state.configurations,
        state.isValid,
        state.valueTypes,
        state.extractedValues
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
