const express = require('express');
const { StateGraph } = require('@langchain/langgraph');
const AppState = require('./graph/state');
const nodes = require('./graph/nodes');
const edges = require('./graph/edges');
const graph = new StateGraph(AppState)
  .addNode('parseInput', nodes.parseInput)
  .addNode('fetchConfig', nodes.fetchConfig)
  .addNode('validateConfig', nodes.validateConfig)
  .addNode('end', nodes.end)
  .addEdge('parseInput', edges.parseInput)
  .addEdge('fetchConfig', edges.fetchConfig)
  .addEdge('validateConfig', edges.validateConfig)
  .setEntryPoint('parseInput')
  .setFinishPoint('end');
const appGraph = graph.compile();
const app = express();
app.use(express.json());
app.post('/review', async (req, res) => {
  const { text } = req.body;
  const state = new AppState();
  state.inputText = text;
  try {
    const result = await appGraph.invoke(state);
    res.json({ message: result.responseMessage });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.post('/api/config/rn', require('./apis/getConfigByRN'));
app.post('/api/config/vin', require('./apis/getConfigByVIN'));
app.post('/api/validate', require('./apis/validateConfig'));
app.post('/api/master-data', require('./apis/getMasterData'));
app.listen(3000, () => { console.log('Server running on port 3000'); });
