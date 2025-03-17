import { ContextProvider } from '@anaplian/core';
import svg2png from 'svg2png';

type RenderSvgContext = {
  readonly svgHistory: {
    readonly id: number;
    readonly svg: string;
  }[];
};
export class RenderSvg
  implements ContextProvider<'renderedSvg', RenderSvgContext>
{
  getNextContext: ContextProvider<
    'renderedSvg',
    RenderSvgContext
  >['getNextContext'] = async (props) => {
    if (props.actionTaken !== 'svg') {
      return {
        svgHistory: props.priorContext.renderedSvg.svgHistory,
        IMAGES: props.priorContext.renderedSvg.IMAGES,
      };
    }
    const nextSvgId = props.priorContext.renderedSvg.svgHistory.length;
    return {
      svgHistory: [
        ...props.priorContext.renderedSvg.svgHistory,
        {
          id: nextSvgId,
          svg: props.actionResult,
        },
      ],
      IMAGES: [
        ...(props.priorContext.renderedSvg.IMAGES || []),
        {
          imageType: 'png',
          imageContent: await svg2png(
            Buffer.from(props.actionResult, 'utf-8'),
            {
              width: 400,
            },
          ),
          annotation: `Rendered PNG of SVG ID ${nextSvgId}`,
        },
      ],
    };
  };
  getInitialContext: ContextProvider<
    'renderedSvg',
    RenderSvgContext
  >['getInitialContext'] = async () => ({
    svgHistory: [],
    IMAGES: [],
  });
  key = 'renderedSvg' as const;
  description: string =
    'Provides a history of generated SVG files. The raw SVG is provided as well as a rendered PNG of the SVG. The index of the image represents the order in which it was created.';
  fieldDescriptions: Record<'svgHistory', string> = {
    svgHistory:
      'A set of SVG IDs as well as the raw SVG XML that was generated by the model.',
  };
  examples: ContextProvider<'renderedSvg', RenderSvgContext>['examples'] = [
    {
      example: {
        svgHistory: [
          {
            id: 0,
            svg: '<svg width="15" height="15" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_1606_24)"><path d="M0.954505 8.45448C0.515165 8.89383 0.515165 9.60618 0.954505 10.0455C1.39385 10.4848 2.10615 10.4848 2.5455 10.0455L5.5 7.09099L8.45448 10.0455C8.89383 10.4848 9.60618 10.4848 10.0455 10.0455C10.4848 9.60618 10.4848 8.89383 10.0455 8.45448L7.09099 5.5L10.0455 2.5455C10.4848 2.10615 10.4848 1.39385 10.0455 0.954505C9.60618 0.515165 8.89383 0.515165 8.45448 0.954505L5.5 3.90901L2.5455 0.954505C2.10615 0.515165 1.39385 0.515165 0.954506 0.954505C0.515166 1.39385 0.515166 2.10615 0.954506 2.5455L3.90901 5.5L0.954505 8.45448Z" fill="#8290A4"/></g><defs><clipPath id="clip0_1606_24"><rect width="9.75" height="9.75" fill="white" transform="translate(0.625 0.625)" /></clipPath></defs></svg>',
          },
        ],
      },
      description:
        'This represents the context provider after the model has provided one SVG. Under `svgHistory`, the model\'s output is shown in the `svg` field. For this particular example, the model was asked to create an svg that looks like the times symbol ("x"). Not shown here, but an accompanying PNG will also be provided for comparison.',
    },
  ];
}
