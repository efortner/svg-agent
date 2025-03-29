import { buildAgent } from './utilities/agent-factory';
import { Ollama } from '@langchain/ollama';
import { LoggingCallback } from './utilities/logging-callback';

(async () => {
  const model = new Ollama({
    model: 'gemma3:27b',
    baseUrl: 'http://localhost:11434',
    callbacks: [new LoggingCallback()],
  });
  const agent = await buildAgent(
    model,
    128_000,
    'You are a graphic designer, and your goal is to create a vector image of a pixel art-style cat. It must be very detailed.',
  );
  process.on('SIGINT', () => agent.shutdown());
  await agent.run();
})();
