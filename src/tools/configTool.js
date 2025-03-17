const { StructuredTool } = require('@langchain/core/tools');
const { z } = require('zod');

const rnSchema = z.object({
  rn: z.string().describe('The RN (Reference Number) to fetch configuration for'),
});

const vinSchema = z.object({
  vin: z.string().describe('The VIN (Vehicle Identification Number) to fetch configuration for'),
});

class ConfigTool {
  constructor() {
    this.getConfigByRN = new StructuredTool({
      name: 'getConfigByRN',
      description: 'Fetches the configuration object for a given RN (Reference Number).',
      schema: rnSchema,
      async call({ rn }) {
        return { rn, config: `Config for RN ${rn}` };
      },
    });

    this.getConfigByVIN = new StructuredTool({
      name: 'getConfigByVIN',
      description: 'Fetches the configuration object for a given VIN (Vehicle Identification Number).',
      schema: vinSchema,
      async call({ vin }) {
        return { vin, config: `Config for VIN ${vin}` };
      },
    });
  }

  async getConfigByRN(rn) {
    return this.getConfigByRN.call({ rn });
  }

  async getConfigByVIN(vin) {
    return this.getConfigByVIN.call({ vin });
  }
}

module.exports = new ConfigTool();
