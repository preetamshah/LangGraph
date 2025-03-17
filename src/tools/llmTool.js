const { StructuredTool } = require('@langchain/core/tools');
const { z } = require('zod');

const llmSchema = z.object({
  configurations: z.array(
    z.object({
      rn: z.string().optional(),
      vin: z.string().optional(),
      config: z.string().optional(),
    })
  ).describe('Array of configuration objects'),
  isValid: z.array(z.boolean()).describe('Array of validation results'),
  valueTypes: z.array(z.string()).describe('Array of input types (rn or vin)'),
  extractedValues: z.array(z.string()).describe('Array of extracted RN or VIN values'),
});

const clarifySchema = z.object({
  inputText: z.string().describe('The raw user input'),
  valueType: z.string().optional().describe('Detected type (rn or vin) if any'),
});

class LLMTool {
  constructor() {
    this.explainResponse = new StructuredTool({
      name: 'explainResponse',
      description: 'Generates a plain English explanation of multiple configuration and validation results.',
      schema: llmSchema,
      async call({ configurations, isValid, valueTypes, extractedValues }) {
        const responses = configurations.map((config, i) => {
          const configDesc = config.config || "no detailed configuration available";
          const type = valueTypes[i].toUpperCase();
          const value = extractedValues[i];
          if (isValid[i]) {
            return `The configuration for ${type} ${value} is valid. Here's what it looks like: ${configDesc}.`;
          } else {
            return `The configuration for ${type} ${value} is invalid. It seems the retrieved configuration (${configDesc}) doesn't meet the required criteria.`;
          }
        });
        return responses.join(' ');
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

  async explainResponse(configurations, isValid, valueTypes, extractedValues) {
    return this.explainResponse.call({ configurations, isValid, valueTypes, extractedValues });
  }

  async clarifyInput(inputText, valueType) {
    return this.clarifyInput.call({ inputText, valueType });
  }
}

module.exports = new LLMTool();
