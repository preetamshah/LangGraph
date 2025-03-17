const configTool = require('../tools/configTool');
async function getConfigByRN(req, res) {
  const { rn } = req.body;
  try {
    const result = await configTool.getConfigByRN(rn);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}
module.exports = getConfigByRN;
