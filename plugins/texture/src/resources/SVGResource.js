import TextureResource from './TextureResource';
import ImageResource from './ImageResource';
import { utils } from '@pixi/core';

const SVG_SIZE = /<svg[^>]*(?:\s(width|height)=('|")(\d*(?:\.\d+)?)(?:px)?('|"))[^>]*(?:\s(width|height)=('|")(\d*(?:\.\d+)?)(?:px)?('|"))[^>]*>/i; // eslint-disable-line max-len

/**
 * @class
 * @memberof texture
 */
export default class SVGResource extends TextureResource
{
    /**
     * @param {string|Image} data The string source to load the svg from (XML or Url), or an Image to use as the source.
     * @param {object} options Extra options
     * @param {number} options.scale The scale of the svg to use.
     * @param {number} options.width The original width of the SVG image, defauts to being auto-detected from `data`.
     * @param {number} options.height The original height of the SVG image, defauts to being auto-detected from `data`.
     */
    constructor(data, options)
    {
        super();

        this.scale = (options && options.scale) || 1;

        this.svgSource = null;
        this.svgWidth = (options && options.width) || 0;
        this.svgHeight = (options && options.height) || 0;

        if (typeof data === 'string')
        {
            const dataUri = utils.decomposeDataUri(data);

            // if it matched regex, assume this is a data uri
            if (dataUri)
            {
                this._loadFromDataUri(dataUri);
            }
            // otherwise if it starts with '<svg' we assume it is XML source
            else if (data.indexOf('<svg') === 0)
            {
                this._loadFromString(data);
            }
            // otherwise just assume it is a URL
            else
            {
                this._loadFromXhr(data);
            }
        }
        else if (data instanceof Image)
        {
            this._loadFromImage(data);
        }
    }

    /**
     * Reads an SVG string from data URI and then calls `_loadSvgSourceUsingString`.
     *
     * @private
     * @param {utils.DecomposedDataUri} dataUri The decomposed data uri info.
     */
    _loadFromDataUri(dataUri)
    {
        let svgString;

        if (dataUri.encoding === 'base64')
        {
            if (!atob)
            {
                this.onError.dispatch(new Error('Your browser doesn\'t support base64 conversions.'), this);

                return;
            }

            svgString = atob(dataUri.data);
        }
        else
        {
            svgString = dataUri.data;
        }

        this._loadFromString(svgString);
    }

    /**
     * Loads an SVG string from `imageUrl` using XHR and then calls `_loadFromString`.
     *
     * @private
     * @param {string} url The url to load from
     */
    _loadFromXhr(url)
    {
        const xhr = new XMLHttpRequest();

        // This throws error on IE, so SVG Document can't be used
        // svgXhr.responseType = 'document';

        // This is not needed since we load the svg as string (breaks IE too)
        // but overrideMimeType() can be used to force the response to be parsed as XML
        // svgXhr.overrideMimeType('image/svg+xml');

        xhr.addEventListener('load', () =>
        {
            if (xhr.readyState !== xhr.DONE || xhr.status !== 200)
            {
                this.onError.dispatch(new Error('Failed to load SVG using XHR.'), this, xhr);

                return;
            }

            this._loadFromString(xhr.responseText);
        });

        xhr.addEventListener('error', () =>
        {
            this.onError.dispatch(new Error('Failed to load SVG using XHR.'), this, xhr);
        });

        xhr.addEventListener('abort', () =>
        {
            this.onError.dispatch(new Error('SVG\'s XHR load was aborted.'), this, xhr);
        });

        xhr.addEventListener('timeout', () =>
        {
            this.onError.dispatch(new Error('SVG\'s XHR load timed out.'), this, xhr);
        });

        xhr.open('GET', url, true);
        xhr.send();
    }

    /**
     * Loads texture using an SVG string. The original SVG Image is stored as `origSource` and the
     * created canvas is the new `source`. The SVG is scaled using `sourceScale`. Called by
     * `_loadFromXhr` or `_loadFromDataUri`.
     *
     * @private
     * @param {string} sourceXML SVG source as string
     */
    _loadFromString(sourceXML)
    {
        const size = SVGResource.getSvgSize(sourceXML);

        if (size.width === 0 || size.height === 0)
        {
            this.onError.dispatch(new Error('The SVG source xml must have width/height defined (in pixels).'), this);

            return;
        }

        const img = new Image();

        img.src = `data:image/svg+xml,${sourceXML}`;

        this._loadFromImage(img, size.width, size.height);
    }

    /**
     * Loads texture from an Image element.
     *
     * @private
     * @param {Image} image The image element to load from.
     * @param {number} width The width to use as the source width, defaults to the width of the image after loading.
     * @param {number} height The height to use as the source height, defaults to the height of the image after loading.
     */
    _loadFromImage(image, width, height)
    {
        this.svgSource = image;

        ImageResource.waitForImageLoad(image, (err) =>
        {
            if (err)
            {
                this.onError.dispatch(err, this, image);

                return;
            }

            this.svgWidth = this.svgWidth || width || image.width;
            this.svgHeight = this.svgHeight || height || image.height;

            // Scale width and height
            this.width = Math.round(this.svgWidth * this.scale);
            this.height = Math.round(this.svgHeight * this.scale);

            // Create a canvas element
            const canvas = document.createElement('canvas');

            canvas.width = this.width;
            canvas.height = this.height;

            // Draw the Svg to the canvas
            canvas
                .getContext('2d')
                .drawImage(image, 0, 0, this.svgWidth, this.svgHeight, 0, 0, this.width, this.height);

            this.data = canvas;
            this.onReady.dispatch(this);
        });
    }

    /**
     * Typedef for SVGSize object.
     *
     * @typedef {object} SVGSize
     * @property {width} width
     * @property {height} height
     */

    /**
     * Get size from an svg string using regexp.
     *
     * @static
     * @param {string} sourceXML The source XML of an SVG as a string.
     * @return {SVGSize} The size of the SVG.
     */
    static getSvgSize(sourceXML)
    {
        const sizeMatch = SVG_SIZE.exec(sourceXML);
        const size = { width: 0, height: 0 };

        if (sizeMatch)
        {
            size[sizeMatch[1].toLowerCase()] = Math.round(parseFloat(sizeMatch[3]));
            size[sizeMatch[5].toLowerCase()] = Math.round(parseFloat(sizeMatch[7]));
        }

        return size;
    }
}
