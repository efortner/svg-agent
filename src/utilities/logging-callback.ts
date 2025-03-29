import { BaseCallbackHandler } from '@langchain/core/callbacks/base';
import { Serialized } from '@langchain/core/load/serializable';

export class LoggingCallback extends BaseCallbackHandler {
  constructor() {
    super();
  }
  name = 'LoggingCallback';
  handleLLMStart = (llm: Serialized, prompts: string[]) => {
    console.log('[LoggingCallback]', llm, prompts);
  };
}
