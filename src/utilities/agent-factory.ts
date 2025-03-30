import { AgentBuilder, AnaplianAgent, NopAction } from '@anaplian/core';
import { BaseLLM } from '@langchain/core/language_models/llms';
import { BaseChatModel } from '@langchain/core/language_models/chat_models';
import { Svg } from '../actions/svg';
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
    .addContextProvider(new RenderSvg(), 100)
    .addAction(new Svg())
    .addAction(new NopAction())
    .setOn('afterIterationEnd', async (context) =>
      console.info(JSON.stringify(context, null, 2)),
    )
    .setOn('beforeShutdown', async () =>
      console.info('RECEIVED SHUTDOWN SIGNAL'),
    )
    .build();
