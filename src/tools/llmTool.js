const { z } = require('zod');
const StructuredTool = require('./customTool');
const llmSchema = z.object({
  configurations: z.object({ rn: z.string().optional(), vin: z.string().optional(), config: z.string().optional() }).describe('The configuration object'),
  isValid: z.boolean().describe('Whether the configuration is valid'),
  valueType: z.string().describe('Type of input (rn or vin)'),
  extractedValue: z.string().describe('The extracted RN or VIN value'),
});
class LLMTool {
  constructor() {
    this.explainResponse = new StructuredTool({
      name: 'explainResponse',
      description: 'Generates a plain English explanation of a configuration and its validation result.',
      schema: llmSchema,
      execute: async ({ configurations, isValid, valueType, extractedValue }) => {
        const configDesc = configurations.config || "no detailed configuration available";
        if (isValid) {
          return `The configuration for ${valueType.toUpperCase()} ${extractedValue} is valid. Here's what it looks like: ${configDesc}.`;
        } else {
          return `The configuration for ${valueType.toUpperCase()} ${extractedValue} is invalid. It seems the retrieved configuration (${configDesc}) doesn't meet the required criteria.`;
        }
      },
    });
  }
  async explainResponse(configurations, isValid, valueType, extractedValue) {
    return this.explainResponse.call({ configurations, isValid, valueType, extractedValue });
  }
}
module.exports = new LLMTool();
