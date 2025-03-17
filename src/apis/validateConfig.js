const validationTool = require('../tools/validationTool');
async function validateConfig(req, res) {
  const { configurations } = req.body;
  try {
    const isValid = await validationTool.validateConfig(configurations);
    res.json({ isValid });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}
module.exports = validateConfig;
