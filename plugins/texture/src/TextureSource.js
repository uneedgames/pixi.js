import Signal from 'mini-signals';
import bitTwiddle from 'bit-twiddle';
import { components, data, settings /* @ifdef DEBUG */, debug /* @endif */ } from '@pixi/core';




import {
    uid, getUrlFileExtension, decomposeDataUri, getSvgSize,
    getResolutionOfUrl, BaseTextureCache, TextureCache,
} from '../utils';

import { FORMATS, TARGETS, TYPES, SCALE_MODES } from '../const';
import ImageResource from './resources/ImageResource';
import BufferResource from './resources/BufferResource';
import CanvasResource from './resources/CanvasResource';
import SVGResource from './resources/SVGResource';
import VideoResource from './resources/VideoResource';
import createResource from './resources/createResource';

import settings from '../settings';
import bitTwiddle from 'bit-twiddle';

/**
 * A TextureSource is a wrapper around a texture resource that can be drawn with the
 * WebGL API. It contains information necessary for managing that resource.
 *
 * @class
 * @mixes DispatchesUpdateComponent
 * @memberof texture
 */
export default class TextureSource extends components.DispatchesUpdateComponent(Object)
{
    /**
     * @param {TextureResource} resource - The drawable source.
     * @param {number} scaleMode - How to scale the texture source. Either `WebGLRenderingContext.LINEAR`
     *  or `WebGLRenderingContext.NEAREST`.
     * @param {number} wrapMode - How to scale the texture source. Either `WebGLRenderingContext.CLAMP_TO_EDGE`,
     *  `WebGLRenderingContext.REPEAT`, or `WebGLRenderingContext.MIRRORED_REPEAT`.
     * @param {boolean} mipmap - Whether a mipmap should be generated for this texture.
     */
    constructor(
        resource,
        resolution = settings.RESOLUTION,
        width = -1,
        height = -1,
        scaleMode = TextureSource.defaultScaleMode,
        wrapMode = TextureSource.defaultWrapMode,
        format = TextureSource.defaultFormat,
        type = TextureSource.defaultType,
        mipmap = TextureSource.defaultMipMap
    )
    {
        super();

        this.uid = uid();

        this.touched = 0;

        /**
         * The width of texture
         *
         * @member {Number}
         */
        this.width = width;

        /**
         * The height of texture
         *
         * @member {Number}
         */
        this.height = height;

        /**
         * The resolution / device pixel ratio of the texture
         *
         * @member {number}
         * @default 1
         */
        this.resolution = resolution;

        /**
         * Whether or not the texture is a power of two, try to use power of two textures as much
         * as you can
         *
         * @private
         * @member {boolean}
         */
        this.isPowerOfTwo = false;

        /**
         * If mipmapping was used for this texture, enable and disable with enableMipmap()
         *
         * @member {Boolean}
         */
        this.mipmap = false;

        /**
         * Set to true to enable pre-multiplied alpha
         *
         * @member {Boolean}
         */
        this.premultiplyAlpha = true;

        /**
         * [wrapMode description]
         * @type {[type]}
         */
        this.wrapMode = settings.WRAP_MODE;

        /**
         * The scale mode to apply when scaling this texture
         *
         * @member {number}
         * @default PIXI.settings.SCALE_MODE
         * @see PIXI.SCALE_MODES
         */
        this.scaleMode = scaleMode || settings.SCALE_MODE;

        /**
         * The pixel format of the texture. defaults to gl.RGBA
         *
         * @member {Number}
         */
        this.format = format;
        this.type = type;

        this.target = TARGETS.TEXTURE_2D;

        this._glTextures = {};

        this._new = true;

        this.dirtyId = 0;

        this.valid = false;

        this.resource = null;

        if (resource)
        {
            // lets convert this to a resource..
            resource = createResource(resource);
            this.setResource(resource);
        }

        this.cacheId = null;

        this.validate();

        this.textureCacheIds = [];

        /**
         * Fired when a not-immediately-available source finishes loading.
         *
         * @protected
         * @event PIXI.BaseTexture#loaded
         * @param {PIXI.BaseTexture} baseTexture - Resource loaded.
         */

        /**
         * Fired when a not-immediately-available source fails to load.
         *
         * @protected
         * @event PIXI.BaseTexture#error
         * @param {PIXI.BaseTexture} baseTexture - Resource errored.
         */

        /**
         * Fired when BaseTexture is updated.
         *
         * @protected
         * @event PIXI.BaseTexture#loaded
         * @param {PIXI.BaseTexture} baseTexture - Resource loaded.
         */

        /**
         * Fired when BaseTexture is destroyed.
         *
         * @protected
         * @event PIXI.BaseTexture#error
         * @param {PIXI.BaseTexture} baseTexture - Resource errored.
         */

        /**
         * Fired when BaseTexture is updated.
         *
         * @protected
         * @event PIXI.BaseTexture#update
         * @param {PIXI.BaseTexture} baseTexture - Instance of texture being updated.
         */

        /**
         * Fired when BaseTexture is destroyed.
         *
         * @protected
         * @event PIXI.BaseTexture#dispose
         * @param {PIXI.BaseTexture} baseTexture - Instance of texture being destroyed.
         */
    }

    updateResolution()
    {
        const resource = this.resource;

        if(resource && resource.width !== -1 && resource.hight !== -1)
        {
            this.width = resource.width / this.resolution;
            this.height = resource.height / this.resolution;
        }
    }

    setResource(resource)
    {
        // TODO currently a resource can only be set once..

        if(this.resource)
        {
            this.resource.resourceUpdated.remove(this);
        }


        this.resource = resource;

        resource.resourceUpdated.add(this); //calls resourceUpaded

        if(resource.loaded)
        {
            this.resourceLoaded(resource)
        }

        resource.load
        .then(this.resourceLoaded.bind(this))
        .catch((reason)=>{

            // failed to load - maybe resource was destroyed before it loaded.
            console.warn(reason);

        })

    }

    resourceLoaded(resource)
    {
        if(this.resource === resource)
        {
            this.updateResolution();

            this.validate();

            if(this.valid)
            {
                this.isPowerOfTwo = bitTwiddle.isPow2(this.realWidth) && bitTwiddle.isPow2(this.realHeight);

                // we have not swapped half way!
                this.dirtyId++;

                this.emit('loaded', this);
            }
        }

    }

    resourceUpdated()
    {
        // the resource was updated..
        this.dirtyId++;
    }

    update()
    {
        this.dirtyId++;
    }

    resize(width, height)
    {
        this.width = width;
        this.height = height;

        this.dirtyId++;
    }

    validate()
    {
        let valid = true;

        if(this.width === -1 || this.height === -1)
        {
            valid = false;
        }

        this.valid = valid;
    }

    get realWidth()
    {
        return this.width * this.resolution;
    }

    get realHeight()
    {
        return this.height * this.resolution;
    }

    /**
     * Destroys this base texture
     *
     */
    destroy()
    {
        if (this.cacheId)
        {
            delete BaseTextureCache[this.cacheId];
            delete TextureCache[this.cacheId];

            this.cacheId = null;
        }

        // remove and destroy the resource

        if(this.resource)
        {
            this.resource.destroy();
            this.resource = null;
        }

        // finally let the webGL renderer know..
        this.dispose();

        BaseTexture.removeFromCache(this);
        this.textureCacheIds = null;
    }

    /**
     * Frees the texture from WebGL memory without destroying this texture object.
     * This means you can still use the texture later which will upload it to GPU
     * memory again.
     *
     * @fires PIXI.BaseTexture#dispose
     */
    dispose()
    {
        this.emit('dispose', this);
    }

    /**
     * Helper function that creates a base texture based on the source you provide.
     * The source can be - image url, image element, canvas element.
     *
     * @static
     * @param {string|HTMLImageElement|HTMLCanvasElement} source - The source to create base texture from.
     * @param {number} [scaleMode=PIXI.settings.SCALE_MODE] - See {@link PIXI.SCALE_MODES} for possible values
     * @param {number} [sourceScale=(auto)] - Scale for the original image, used with Svg images.
     * @return {PIXI.BaseTexture} The new base texture.
     */
    static from(source, scaleMode, sourceScale)
    {
        var cacheId = null;

        if (typeof source === 'string')
        {
            cacheId = source;
        }
        else
        {
            if(!source._pixiId)
            {
                source._pixiId = `pixiid_${uid()}`;
            }

            cacheId = source._pixiId;
        }

        let baseTexture = BaseTextureCache[cacheId];

        if (!baseTexture)
        {
            baseTexture = new BaseTexture(source);
            baseTexture.cacheId = cacheId;
            BaseTexture.addToCache(baseTexture, cacheId);
        }

        return baseTexture;
    }

    static fromFloat32Array(width, height, float32Array)
    {
        float32Array = float32Array || new Float32Array(width*height*4);

        var texture = new BaseTexture(new BufferResource(float32Array),
                                  SCALE_MODES.NEAREST,
                                  1,
                                  width,
                                  height,
                                  FORMATS.RGBA,
                                  TYPES.FLOAT);
        return texture;
    }

    static fromUint8Array(width, height, uint8Array)
    {
        uint8Array = uint8Array || new Uint8Array(width*height*4);

        var texture = new BaseTexture(new BufferResource(uint8Array),
                                  SCALE_MODES.NEAREST,
                                  1,
                                  width,
                                  height,
                                  FORMATS.RGBA,
                                  TYPES.UNSIGNED_BYTE);
        return texture;
    }

    /**
     * Adds a BaseTexture to the global BaseTextureCache. This cache is shared across the whole PIXI object.
     *
     * @static
     * @param {PIXI.BaseTexture} baseTexture - The BaseTexture to add to the cache.
     * @param {string} id - The id that the BaseTexture will be stored against.
     */
    static addToCache(baseTexture, id)
    {
        if (id)
        {
            if (baseTexture.textureCacheIds.indexOf(id) === -1)
            {
                baseTexture.textureCacheIds.push(id);
            }

            // @if DEBUG
            /* eslint-disable no-console */
            if (BaseTextureCache[id])
            {
                console.warn(`BaseTexture added to the cache with an id [${id}] that already had an entry`);
            }
            /* eslint-enable no-console */
            // @endif

            BaseTextureCache[id] = baseTexture;
        }
    }

    /**
     * Remove a BaseTexture from the global BaseTextureCache.
     *
     * @static
     * @param {string|PIXI.BaseTexture} baseTexture - id of a BaseTexture to be removed, or a BaseTexture instance itself.
     * @return {PIXI.BaseTexture|null} The BaseTexture that was removed.
     */
    static removeFromCache(baseTexture)
    {
        if (typeof baseTexture === 'string')
        {
            const baseTextureFromCache = BaseTextureCache[baseTexture];

            if (baseTextureFromCache)
            {
                const index = baseTextureFromCache.textureCacheIds.indexOf(baseTexture);

                if (index > -1)
                {
                    baseTextureFromCache.textureCacheIds.splice(index, 1);
                }

                delete BaseTextureCache[baseTexture];

                return baseTextureFromCache;
            }
        }
        else
        {
            for (let i = 0; i < baseTexture.textureCacheIds.length; ++i)
            {
                delete BaseTextureCache[baseTexture.textureCacheIds[i]];
            }

            baseTexture.textureCacheIds.length = 0;

            return baseTexture;
        }

        return null;
    }
}

/**
 * The default scale mode to use when a new texture source is created, and no
 * scale mode is specified.
 *
 * @static
 * @constant
 * @memberof TextureSource
 * @type {number}
 * @default SCALE_MODES.LINEAR
 */
TextureSource.defaultScaleMode = data.SCALE_MODES.LINEAR;

/**
 * The default wrapping mode to use when a new texture source is created, and no
 * wrapping mode is specified.
 *
 * @static
 * @constant
 * @memberof TextureSource
 * @type {number}
 * @default WRAP_MODES.CLAMP_TO_EDGE
 */
TextureSource.defaultWrapMode = data.WRAP_MODES.CLAMP_TO_EDGE;

/**
 * The default format to use when a new texture source is created, and no
 * format is specified.
 *
 * @static
 * @constant
 * @memberof TextureSource
 * @type {number}
 * @default FORMATS.RGBA
 */
TextureSource.defaultFormat = data.FORMATS.RGBA;

/**
 * The default type to use when a new texture source is created, and no
 * type is specified.
 *
 * @static
 * @constant
 * @memberof TextureSource
 * @type {number}
 * @default TYPES.UNSIGNED_BYTE
 */
TextureSource.defaultType = data.TYPES.UNSIGNED_BYTE;

/**
 * The default mipmap mode to use when a new source is created, and no
 * mipmap mode is specified.
 *
 * @static
 * @constant
 * @memberof TextureSource
 * @type {boolean}
 * @default true
 */
TextureSource.defaultMipMap = true;

BaseTexture.fromImage = BaseTexture.from;
BaseTexture.fromSVG = BaseTexture.from;
BaseTexture.fromCanvas = BaseTexture.from;
