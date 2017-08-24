// Type definitions for svgo v0.6.1
// Project: https://github.com/svg/svgo
// Definitions by: Laurens Rietveld <https://github.com/LaurensRietveld/>
// Definitions: https://github.com/borisyankov/DefinitelyTyped

declare module "sharp" {
  import * as stream from "stream";

  function sharp(input: Buffer | string): sharp.SharpDuplex;

  namespace sharp {
    export interface ImageInfo {
      format: string;
      size: number;
      width: number;
      height: number;
    }

    interface SvgoCallback {
      (result: { error?: string; data: string }): any;
    }
    export class SharpDuplex extends stream.Duplex {
      /**
            Scale output to width x height. By default, the resized image is cropped to the exact size specified.
            width is the integral Number of pixels wide the resultant image should be, between 1 and 16383 (0x3FFF). Use null or undefined to auto-scale the width to match the height.
            height is the integral Number of pixels high the resultant image should be, between 1 and 16383. Use null or undefined to auto-scale the height to match the width.
            */
      resize(width?: number, height?: number): SharpDuplex;
      /**

            Preserving aspect ratio, resize the image to be as large as possible while ensuring its dimensions are less than or equal to the width and height specified.
            Both width and height must be provided via resize otherwise the behaviour will default to crop.
            */
      max(): SharpDuplex;
      /**
            Preserving aspect ratio, resize the image to be as small as possible while ensuring its dimensions are greater than or equal to the width and height specified.
            Both width and height must be provided via resize otherwise the behaviour will default to crop.
            */
      min(): SharpDuplex;
      toFormat(format: string): SharpDuplex;

      /**
            Write image data to a Buffer, the format of which will match the input image by default. JPEG, PNG and WebP are supported.
            */
      toBuffer(cb: (err: any, buffer: Buffer, info: ImageInfo) => void): void;
      toBuffer(): Promise<Buffer>;
    }
  }
  export = sharp;
}
