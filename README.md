# LangGraph Application

A Node.js application using LangGraph to process RN (Reference Number) and VIN (Vehicle Identification Number) inputs, fetch their configurations, validate them, and explain the results in plain English using an LLM-like tool. The application supports processing multiple RNs and VINs in parallel when provided in a single input.

## Setup
1. Install dependencies: `npm install`
2. Start the server: `npm start`

## Endpoints
- **POST /review**: Process user input, supporting multiple RNs and VINs in parallel.
  - **Input**: A JSON object with a `text` field (e.g., `{"text": "I want to review RN5644 and VIN34534"}`).
  - **Behavior**:
    - Extracts RNs (e.g., `RN5644`) and VINs (e.g., `VIN34534`) from the input.
    - Fetches and validates configurations in parallel for all detected RNs and VINs.
    - Returns a combined plain English response.
  - **Examples**:
    - Single RN: `{"text": "Can I review RN5644"}`
      - Response: `{"message": "The configuration for RN 5644 is valid. Here's what it looks like: Config for RN 5644."}`
    - RN and VIN: `{"text": "I want to review RN5644 and VIN34534"}`
      - Response: `{"message": "The configuration for RN 5644 is valid. Here's what it looks like: Config for RN 5644. The configuration for VIN 34534 is valid. Here's what it looks like: Config for VIN 34534."}`
    - Incomplete: `{"text": "I want to review RN"}`
      - Response: `{"message": "It looks like you want to review an RN, but you didn’t provide a complete RN number. Please provide a full RN number (e.g., RN5644)."}`
- **POST /api/config/rn**: Fetch configuration by RN.
  - Input: `{"rn": "5644"}`
  - Output: `{"rn": "5644", "config": "Config for RN 5644"}`
- **POST /api/config/vin**: Fetch configuration by VIN.
  - Input: `{"vin": "34534"}`
  - Output: `{"vin": "34534", "config": "Config for VIN 34534"}`
- **POST /api/validate**: Validate a configuration.
  - Input: `{"configurations": {"rn": "5644", "config": "Config for RN 5644"}}`
  - Output: `{"isValid": true}`
- **POST /api/master-data**: Fetch master data (not used in the graph workflow yet).
  - Input: `{"product": "car", "market": "US"}`
  - Output: `{"product": "car", "market": "US", "rules": "Rules for car in US"}`

## Notes
- Uses `@langchain/core@0.3.42` for `StructuredTool` to define tools with structured inputs.
- The `llmTool.js` currently uses a mock LLM implementation for generating responses. To use a real LLM (e.g., OpenAI), replace the mock logic in `explainResponse` and `clarifyInput` with an API call and add the necessary dependency (e.g., `openai`).
- Assumes `@langchain/langgraph` is available for Node.js to manage the graph workflow. If unavailable, implement a custom graph runner.
- The application detects RNs and VINs using simple regex patterns (`rn[\w\d]+` and `vin[\w\d]+`). For stricter validation, update the regex in `nodes.js`.

## Development
- Run with `nodemon` for auto-restart during development: `npx nodemon src/index.js`.
- Test endpoints using tools like `curl` or Postman.
