const masterDataTool = require('../tools/masterDataTool');
async function getMasterData(req, res) {
  const { product, market } = req.body;
  try {
    const result = await masterDataTool.getMasterData(product, market);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}
module.exports = getMasterData;
