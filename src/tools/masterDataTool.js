const { StructuredTool } = require('@langchain/core/tools');
const { z } = require('zod');

const masterDataSchema = z.object({
  product: z.string().describe('The product identifier'),
  market: z.string().describe('The market identifier'),
});

class MasterDataTool {
  constructor() {
    this.getMasterData = new StructuredTool({
      name: 'getMasterData',
      description: 'Fetches master data containing rules for a given product and market.',
      schema: masterDataSchema,
      async call({ product, market }) {
        return { product, market, rules: `Rules for ${product} in ${market}` };
      },
    });
  }

  async getMasterData(product, market) {
    return this.getMasterData.call({ product, market });
  }
}

module.exports = new MasterDataTool();
