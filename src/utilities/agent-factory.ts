import {
  AgentBuilder,
  AnaplianAgent,
  HistoryContextProvider,
  ThinkAction,
} from '@anaplian/core';
import { BaseLLM } from '@langchain/core/language_models/llms';
import { BaseChatModel } from '@langchain/core/language_models/chat_models';
import { RenderSvg } from '../contexts/render-svg';
import { Svg } from '../actions/svg';

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
    .addAction(new ThinkAction())
    .addAction(new Svg())
    .setOn('afterIterationEnd', async (context) =>
      console.info(JSON.stringify(context, null, 2)),
    )
    .setOn('beforeShutdown', async () =>
      console.info('RECEIVED SHUTDOWN SIGNAL'),
    )
    .build();
