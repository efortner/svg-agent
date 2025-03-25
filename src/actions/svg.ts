import { Action } from '@anaplian/core';
import * as fs from 'node:fs';

const rawExampleSvg =
  '<svg width="15" height="15" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_1606_24)"><path d="M0.954505 8.45448C0.515165 8.89383 0.515165 9.60618 0.954505 10.0455C1.39385 10.4848 2.10615 10.4848 2.5455 10.0455L5.5 7.09099L8.45448 10.0455C8.89383 10.4848 9.60618 10.4848 10.0455 10.0455C10.4848 9.60618 10.4848 8.89383 10.0455 8.45448L7.09099 5.5L10.0455 2.5455C10.4848 2.10615 10.4848 1.39385 10.0455 0.954505C9.60618 0.515165 8.89383 0.515165 8.45448 0.954505L5.5 3.90901L2.5455 0.954505C2.10615 0.515165 1.39385 0.515165 0.954506 0.954505C0.515166 1.39385 0.515166 2.10615 0.954506 2.5455L3.90901 5.5L0.954505 8.45448Z" fill="#8290A4"/></g><defs><clipPath id="clip0_1606_24"><rect width="9.75" height="9.75" fill="white" transform="translate(0.625 0.625)" /></clipPath></defs></svg>';
export class Svg implements Action<'svg'> {
  private index: number = 0;

  name: string = 'svg';
  arguments: Action<'svg'>['arguments'] = [
    {
      name: 'svg',
      description: 'Raw SVG XML',
    },
  ];
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
