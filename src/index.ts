import { buildAgent } from './utilities/agent-factory';
import { Ollama } from '@langchain/ollama';

(async () => {
  const model = new Ollama({
    model: 'gemma3:27b',
    baseUrl: 'http://localhost:11434',
  });
  const agent = await buildAgent(
    model,
    128_000,
    'You are a graphic designer, and your goal is to create an SVG image of a PIXEL ART CAT using the svg() action. It must be highly detailed.' +
      ' Use multiple iterations to fix mistakes and improve detail. You will alternate between using the think() and ' +
      ' svg() actions. Use the think() action to plan and the svg() action to render your SVG.',
  );
  process.on('SIGINT', () => agent.shutdown());
  await agent.run();
})();
