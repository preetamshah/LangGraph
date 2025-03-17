const { z } = require('zod');
class StructuredTool {
  constructor({ name, description, schema, execute }) {
    this.name = name;
    this.description = description;
    this.schema = schema;
    this.execute = execute;
  }
  async call(input) {
    try {
      const validatedInput = this.schema.parse(input);
      return await this.execute(validatedInput);
    } catch (error) {
      throw new Error(`Tool ${this.name} failed: ${error.message}`);
    }
  }
}
module.exports = StructuredTool;
