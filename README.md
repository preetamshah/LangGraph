# LangGraph Application
A Node.js application using LangGraph to process RN/VIN inputs, fetch configurations, validate them, and explain results in plain English using an LLM-like tool.
## Setup
1. Install dependencies: `npm install`
2. Start the server: `npm start`
## Endpoints
- **POST /review**: Process user input (e.g., "Can I review this VIN - VIN34534")
- **POST /api/config/rn**: Fetch config by RN
- **POST /api/config/vin**: Fetch config by VIN
- **POST /api/validate**: Validate a configuration
- **POST /api/master-data**: Fetch master data (not used in graph yet)
## Notes
- The `llmTool.js` uses a mock LLM. Replace with a real LLM (e.g., OpenAI) for dynamic responses.
- Requires a hypothetical `@langchain/langgraph` package. Use a custom graph runner if unavailable.
