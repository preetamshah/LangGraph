const configTool = require('../tools/configTool');
async function getConfigByVIN(req, res) {
  const { vin } = req.body;
  try {
    const result = await configTool.getConfigByVIN(vin);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}
module.exports = getConfigByVIN;
