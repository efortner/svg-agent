import { Action } from '@anaplian/core';

export class Return implements Action {
  name: string = 'return';
  description: string = 'Use this action when you are finished executing. If you are satisfied that your most recent SVG satisfies the prompt, you may return.';
  examples = [
    {
      result: 'RETURNING',
    },
  ];
  apply = async (): Promise<string> => 'RETURNING';
}
