const { StructuredTool } = require('@langchain/core/tools');
const { z } = require('zod');

const configSchema = z.object({
  configurations: z
    .object({
      rn: z.string().optional(),
      vin: z.string().optional(),
      config: z.string().optional(),
    })
    .describe('The configuration object to validate'),
});

class ValidationTool {
  constructor() {
    this.validateConfig = new StructuredTool({
      name: 'validateConfig',
      description: 'Validates whether a given configuration object is valid.',
      schema: configSchema,
      async call({ configurations }) {
        return !!configurations.config;
      },
    });
  }

  async validateConfig(configurations) {
    return this.validateConfig.call({ configurations });
  }
}

module.exports = new ValidationTool();
