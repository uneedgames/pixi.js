import determineCrossOrigin from '../../utils/determineCrossOrigin';
import TextureResource from './TextureResource';
import { data as coreData /* @ifdef DEBUG */, debug /* @endif */ } from '@pixi/core';

/**
 * @class
 * @memberof texture
 */
export default class ImageResource extends TextureResource
{
    /**
     * @param {HTMLImageElement|ImageBitmap} data The drawing source.
     */
    constructor(data)
    {
        super(data);

        // @ifdef DEBUG
        /* eslint-disable max-len */
        debug.ASSERT(this.data instanceof HTMLImageElement || this.data instanceof ImageBitmap, 'ImageResource expects an HTMLImageElement as the underlying data.');
        /* eslint-enable max-len */
        // @endif

        if (coreData.DEVICE_SUPPORT.IMAGE_BITMAP && this.data instanceof ImageBitmap)
        {
            this._complete();
        }
        else
        {
            ImageResource.waitForImageLoad(this.data, (err) =>
            {
                if (err) this.onError.dispatch(err, this);
                else this._complete();
            });
        }
    }

    /**
     * Destroys this texture resource.
     *
     */
    destroy()
    {
        super.destroy();

        this.source.src = '';
    }

    /**
     * Called when the underlying image has finished loading.
     *
     * @private
     */
    _complete()
    {
        if (coreData.DEVICE_SUPPORT.IMAGE_BITMAP && !(this.data instanceof ImageBitmap))
        {
            window.createImageBitmap(this.data)
                .then((imageBitmap) =>
                {
                    this.data = imageBitmap;
                    this.width = this.data.width;
                    this.height = this.data.height;
                    this.onReady.dispatch(this);
                })
                .catch((e) =>
                {
                    this.onError.dispatch(e, this);
                });
        }
        else
        {
            this.width = this.data.width;
            this.height = this.data.height;
            this.onReady.dispatch(this);
        }
    }

    /**
     * Creates a new ImageResource from a url.
     *
     * @static
     * @param {string} url The url to load from.
     * @param {object} options Options to pass to the ctor
     * @param {string|boolean} crossorigin The crossorigin value to use for the image.
     * @returns {ImageResource} The newly created resource.
     */
    static fromUrl(url, options)
    {
        const image = new Image();

        if (options.crossorigin == null && url.indexOf('data:') !== 0)
        {
            image.crossOrigin = determineCrossOrigin(url);
        }
        else if (options.crossorigin)
        {
            image.crossOrigin = typeof options.crossorigin === 'string' ? options.crossorigin : 'anonymous';
        }

        image.src = url;

        return new ImageResource(image);
    }

    /**
     * Helper that calls a callback once the Image element has loaded.
     *
     * @static
     * @param {Image} img The image to wait for.
     * @param {Function} cb The function to call when complete (or error).
     */
    static waitForImageLoad(img, cb)
    {
        if (img.complete && img.src)
        {
            setTimeout(cb, 1);
        }
        else
        {
            const loadCallback = () =>
            {
                cb();
                img.removeEventListener('load', loadCallback);
                img.removeEventListener('error', errCallback); // eslint-disable-line no-use-before-define
            };

            const errCallback = (evt) =>
            {
                cb(evt);
                img.removeEventListener('load', loadCallback);
                img.removeEventListener('error', errCallback);
            };

            img.addEventListener('load', loadCallback);
            img.addEventListener('error', errCallback);
        }
    }
}
