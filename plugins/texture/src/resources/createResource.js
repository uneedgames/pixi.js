import { data as coreData /* @ifdef DEBUG */, debug /* @endif */ } from '@pixi/core';

import TextureResource from './TextureResource';
import BufferResource from './BufferResource';
import ImageResource from './ImageResource';
import SVGResource from './SVGResource';
import CanvasResource from './CanvasResource';
import VideoResource from './VideoResource';

const rgxVideo = /^[^?#]+(\.(?:mp4|webm|ogg|h264|avi|mov))/i;
const rgxSVG = /^[^?#]+(\.(?:svg))/i;

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

    // If they specify it is SVG, just do it
    if (options.isSvg)
    {
        return new SVGResource(source, options);
    }

    // If this is an array, we assume it is a set of video params for fromUrl
    if (Array.isArray(source))
    {
        return VideoResource.fromUrl(source, options);
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
            return new SVGResource(source, options);
        }

        return ImageResource.fromUrl(source, options);
    }

    // Image element
    if (coreData.DEVICE_SUPPORT.IMAGE_BITMAP && source instanceof ImageBitmap)
    {
        return new ImageResource(source, options);
    }
    else if (source instanceof HTMLImageElement)
    {
        if (source.src.match(rgxSVG) || source.src.indexOf('data:image/svg+xml') === 0)
        {
            return new SVGResource(source, options);
        }
        else
        {
            return new ImageResource(source, options);
        }
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
