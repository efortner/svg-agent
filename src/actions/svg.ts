import { Action } from '@anaplian/core';
import * as fs from 'node:fs';

const rawExampleSvg = `<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="40" fill="red" /></svg>`;
export class Svg implements Action<'svg'> {
  private index: number = 0;

  name: string = 'renderSvg';
  arguments: Action<'svg'>['arguments'] = {
    svg: {
      exampleValidValues: [rawExampleSvg],
      exampleInvalidValues: ['circle', 'star', 'square'],
      description: 'Raw SVG XML',
    },
  };
  description: string =
    'Use this action to create a new iteration of your SVG image. Your SVG will be rendered to a PNG so that you can view the result and make adjustments.';
  examples: {
    readonly arguments: [string];
    readonly result: string;
  }[] = [
    {
      arguments: [rawExampleSvg],
      result: rawExampleSvg,
    },
  ];
  apply = async (args: Record<'svg', string>): Promise<string> => {
    fs.writeFileSync(`${this.index}.svg`, Buffer.from(args.svg));
    return args.svg;
  };
}
