import { buildAgent } from './utilities/agent-factory';
import { ChatOllama } from '@langchain/ollama';
import { LoggingCallback } from './utilities/logging-callback';
import 'dotenv/config';
import { getEnvironmentVariable } from './utilities/environment';
import {
  getModelContextSize,
  isModelSupported,
} from '@anaplian/model-context-size';

(async () => {
  const modelName = getEnvironmentVariable('MODEL_NAME');
  const model = new ChatOllama({
    model: modelName,
    baseUrl: 'http://localhost:11434',
    callbacks: [new LoggingCallback()],
  });
  const agent = await buildAgent(
    model,
    isModelSupported(modelName) ? getModelContextSize(modelName) : 16_000,
    getEnvironmentVariable('DIRECTIVE'),
  );
  process.on('SIGINT', () => agent.shutdown());
  await agent.run();
})();
