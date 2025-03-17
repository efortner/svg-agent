import {
  AgentBuilder,
  AnaplianAgent,
  HistoryContextProvider,
} from '@anaplian/core';
import { BaseLLM } from '@langchain/core/language_models/llms';
import { BaseChatModel } from '@langchain/core/language_models/chat_models';
import { RenderSvg } from '../contexts/render-svg';

export const buildAgent = (
  model: BaseLLM | BaseChatModel,
  contextWindowSize: number,
  roleAssignmentDirective: string,
): Promise<AnaplianAgent> =>
  new AgentBuilder({
    model,
    roleAssignmentDirective,
  })
    .setContextWindowSize(contextWindowSize)
    .addContextProvider(new HistoryContextProvider({}), 30)
    .addContextProvider(new RenderSvg(), 70)
    .build();
