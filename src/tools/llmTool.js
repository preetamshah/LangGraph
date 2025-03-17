const { StructuredTool } = require('@langchain/core/tools');
const { z } = require('zod');

const llmSchema = z.object({
  configurations: z
    .object({
      rn: z.string().optional(),
      vin: z.string().optional(),
      config: z.string().optional(),
    })
    .describe('The configuration object'),
  isValid: z.boolean().describe('Whether the configuration is valid'),
  valueType: z.string().describe('Type of input (rn or vin)'),
  extractedValue: z.string().describe('The extracted RN or VIN value'),
});

const clarifySchema = z.object({
  inputText: z.string().describe('The raw user input'),
  valueType: z.string().optional().describe('Detected type (rn or vin) if any'),
});

class LLMTool {
  constructor() {
    this.explainResponse = new StructuredTool({
      name: 'explainResponse',
      description: 'Generates a plain English explanation of a configuration and its validation result.',
      schema: llmSchema,
      async call({ configurations, isValid, valueType, extractedValue }) {
        const configDesc = configurations.config || "no detailed configuration available";
        if (isValid) {
          return `The configuration for ${valueType.toUpperCase()} ${extractedValue} is valid. Here's what it looks like: ${configDesc}.`;
        } else {
          return `The configuration for ${valueType.toUpperCase()} ${extractedValue} is invalid. It seems the retrieved configuration (${configDesc}) doesn't meet the required criteria.`;
        }
      },
    });

    this.clarifyInput = new StructuredTool({
      name: 'clarifyInput',
      description: 'Generates a prompt asking the user to provide a complete RN or VIN number.',
      schema: clarifySchema,
      async call({ inputText, valueType }) {
        if (valueType === 'rn') {
          return "It looks like you want to review an RN, but you didn’t provide a complete RN number. Please provide a full RN number (e.g., RN5644).";
        } else if (valueType === 'vin') {
          return "It looks like you want to review a VIN, but you didn’t provide a complete VIN number. Please provide a full VIN number (e.g., VIN34534).";
        } else {
          return "I couldn’t determine if you want to review an RN or VIN. Please provide a complete RN or VIN number (e.g., RN5644 or VIN34534).";
        }
      },
    });
  }

  async explainResponse(configurations, isValid, valueType, extractedValue) {
    return this.explainResponse.call({ configurations, isValid, valueType, extractedValue });
  }

  async clarifyInput(inputText, valueType) {
    return this.clarifyInput.call({ inputText, valueType });
  }
}

module.exports = new LLMTool();
