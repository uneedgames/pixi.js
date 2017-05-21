// @ifdef DEBUG
import { debug } from '@pixi/core';
// @endif

import TextureResource from './TextureResource';
import BufferResource from './BufferResource';
import ImageResource from './ImageResource';
import SVGResource from './SVGResource';
import CanvasResource from './CanvasResource';
import VideoResource from './VideoResource';

const rgxVideo = /\.(mp4|webm|ogg|h264|avi|mov)$/;
const rgxSVG = /\.(svg)$/;

export function isSvgUrl(urlStr)
{
    return urlStr.match(rgxSVG);
}

export default function createResource(source, options)
{
    // @ifdef DEBUG
    debug.ASSERT(!!source, `Cannot create a resource from an empty source.`, source);
    // @endif

    // If this is already a resource, do nothing.
    if (source instanceof TextureResource)
    {
        return source;
    }

    // If a string, we send it over to the .from() methods of different resources
    // depending on the extension of the string.
    if (typeof source === 'string')
    {
        if (source.match(rgxVideo))
        {
            return VideoResource.fromUrl(source, options);
        }

        if (source.match(rgxSVG))
        {
            return SVGResource.fromUrl(source, options);
        }

        return ImageResource.fromUrl(source, options);
    }

    // SVG Element
    if (source instanceof HTMLElement && source.tagName.toUpperCase() === 'SVG')
    {
        return new SVGResource(source, options);
    }

    // Image element
    if (source instanceof HTMLImageElement || (typeof ImageBitmap !== 'undefined' && source instanceof ImageBitmap))
    {
        return new ImageResource(source, options);
    }

    // Canvas element
    if (source instanceof HTMLCanvasElement)
    {
        return new CanvasResource(source, options);
    }

    // video element
    if (source instanceof HTMLVideoElement)
    {
        return new VideoResource(source, options);
    }

    // data element
    if (source instanceof ArrayBuffer || source.buffer instanceof ArrayBuffer)
    {
        return new BufferResource(source, options);
    }

    // @ifdef DEBUG
    debug.VALIDATE(false, `Unable to create resource.`, source);
    // @endif

    return null;
}
