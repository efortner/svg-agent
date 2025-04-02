import { ContextProvider, Image } from '@anaplian/core';
import sharp from 'sharp';

type RenderSvgContext = {
  readonly lastSvg: string;
};
export class RenderSvg
  implements ContextProvider<'renderedSvg', RenderSvgContext>
{
  constructor(private readonly initialContext: RenderSvgContext) {}
  getNextContext: ContextProvider<
    'renderedSvg',
    RenderSvgContext
  >['getNextContext'] = async (props) => {
    if (!props.actionTaken.startsWith('render_svg(')) {
      return {
        lastSvg: props.priorContext.renderedSvg.lastSvg,
        IMAGES: props.priorContext.renderedSvg.IMAGES,
      };
    }
    let pngBuffer: Buffer | undefined;
    let svgContent: string;
    try {
      svgContent = props.actionResult;
      pngBuffer = await new Promise<Buffer>((accept, reject) =>
        sharp(Buffer.from(svgContent, 'utf-8'))
          .png()
          .toBuffer((error, buffer) => {
            if (error) {
              reject(error);
            }
            accept(buffer);
          }),
      );
    } catch (error) {
      svgContent = `ERROR WHILE RENDERING - argument to "render_svg" must be in valid SVG XML format`;
      if (error instanceof Error) {
        svgContent += `\n\tRAW ERROR: ${error.message}`;
      }
    }
    return {
      lastSvg: svgContent,
      IMAGES: [
        ...(pngBuffer
          ? [
              <Image>{
                imageType: 'png',
                imageContent: pngBuffer,
                annotation: `Rendered PNG of last SVG output`,
              },
            ]
          : []),
      ],
    };
  };
  getInitialContext: ContextProvider<
    'renderedSvg',
    RenderSvgContext
  >['getInitialContext'] = async () => ({
    ...this.initialContext,
    IMAGES: [],
  });
  key = 'renderedSvg' as const;
  description: string = 'Provides a PNG rendering of the last SVG created.';
  fieldDescriptions: Record<'lastSvg', string> = {
    lastSvg: 'The XML content of the last SVG created.',
  };
  examples: ContextProvider<'renderedSvg', RenderSvgContext>['examples'] = [
    {
      example: {
        lastSvg:
          '<svg width="15" height="15" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_1606_24)"><path d="M0.954505 8.45448C0.515165 8.89383 0.515165 9.60618 0.954505 10.0455C1.39385 10.4848 2.10615 10.4848 2.5455 10.0455L5.5 7.09099L8.45448 10.0455C8.89383 10.4848 9.60618 10.4848 10.0455 10.0455C10.4848 9.60618 10.4848 8.89383 10.0455 8.45448L7.09099 5.5L10.0455 2.5455C10.4848 2.10615 10.4848 1.39385 10.0455 0.954505C9.60618 0.515165 8.89383 0.515165 8.45448 0.954505L5.5 3.90901L2.5455 0.954505C2.10615 0.515165 1.39385 0.515165 0.954506 0.954505C0.515166 1.39385 0.515166 2.10615 0.954506 2.5455L3.90901 5.5L0.954505 8.45448Z" fill="#8290A4"/></g><defs><clipPath id="clip0_1606_24"><rect width="9.75" height="9.75" fill="white" transform="translate(0.625 0.625)" /></clipPath></defs></svg>',
      },
      description:
        'This represents the context provider after the model has provided one SVG. Under `svgHistory`, the model\'s output is shown in the `svg` field. For this particular example, the model was asked to create an svg that looks like the times symbol ("x"). Not shown here, but an accompanying PNG will also be provided for comparison.',
    },
  ];
}
