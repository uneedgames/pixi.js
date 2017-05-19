import { components /* @ifdef DEBUG */, debug /* @endif */ } from '@pixi/core';
import TextureSource from './TextureSource';
import VideoBaseTexture from './VideoBaseTexture';
import TextureResource from './resources/TextureResource';
import ImageResource from './resources/ImageResource';
import CanvasResource from './resources/CanvasResource';
import TextureUvs from './TextureUvs';
import settings from '../settings';
import { Rectangle } from '../math';
import { TextureCache, getResolutionOfUrl } from '../utils';

/**
 * A Texture is a wrapper around a TextureSource. It represents the frame of the
 * source to actually draw.
 *
 * You can directly create a texture from an image and then reuse it multiple times like this :
 *
 * ```js
 * let texture = PIXI.Texture.fromImage('assets/image.png');
 * let sprite1 = new PIXI.Sprite(texture);
 * let sprite2 = new PIXI.Sprite(texture);
 * ```
 *
 * Textures made from SVGs, loaded or not, cannot be used before the file finishes processing.
 * You can check for this by checking the sprite's _textureID property.
 *
 * ```js
 * var texture = PIXI.Texture.fromImage('assets/image.svg');
 * var sprite1 = new PIXI.Sprite(texture);
 * //sprite1._textureID should not be undefined if the texture has finished processing the SVG file
 * ```
 * You can use a ticker or rAF to ensure your sprites load the finished textures after processing. See issue #3068.
 *
 * @class
 * @mixes DispatchesUpdateComponent
 * @memberof texture
 */
export default class Texture extends components.DispatchesUpdateComponent(Object)
{
    /**
     * @param {TextureSource|CanvasImageSource|Texture} source - The base texture source to create the texture from
     * @param {Rectangle} [frame] - The rectangle frame of the texture to show
     * @param {Rectangle} [orig] - The area of original texture
     * @param {Rectangle} [trim] - Trimmed rectangle of original texture
     * @param {number} [rotation] - The rotation of the frame (in radians), after it was put in an atlas (if it was).
     *  This rotation is counteracted to draw an "unrotated" version of the frame.
     */
    constructor(source, frame, orig, trim, rotation = 0)
    {
        // massage source into a TextureSource instance.
        if (source instanceof Texture)
        {
            source = source.source;
        }
        else if (!(source instanceof TextureResource))
        {
            source = new TextureResource(source);
        }

        // @ifdef DEBUG
        debug.ASSERT(source instanceof TextureResource, 'Resource passed to Texture is not a TextureResource.');
        // @endif

        /**
         * The source for this texture to represent.
         *
         * @member {TextureResource}
         */
        this.source = source;

        /**
         * This is the trimmed area of original texture, before it was put in atlas
         *
         * @member {Rectangle}
         */
        this.trim = trim;

        /**
         * This is the area of original texture, before it was put in atlas
         *
         * @member {Rectangle}
         */
        this.orig = orig || frame;

        /**
         * This will let the renderer know if the texture is valid. If it's not then it cannot be rendered.
         *
         * @member {boolean}
         */
        this.valid = false;

        /**
         * Extra field for extra plugins. May contain clamp settings and some matrices.
         *
         * @type {Object}
         */
        this.transform = null;

        /**
         * The ids under which this Texture has been added to the texture cache. This is
         * automatically set as long as Texture.addToCache is used, but may not be set if a
         * Texture is added directly to the TextureCache array.
         *
         * @member {string[]}
         */
        this.textureCacheIds = [];

        /**
         * Does this texture have an explicit frame, or do we use the whole image?
         *
         * @private
         * @member {boolean}
         */
        this._explicitFrame = !!frame;

        /**
         * The frame of the source to represent.
         *
         * @private
         * @member {Rectangle}
         */
        this._frame = null;

        /**
         * The uvs to draw with.
         *
         * @member {UVs}
         */
        this._uvs = new TextureUVs();

        /**
         * The rotation of the texture, after it was packed into an atlas (if it was).
         *
         * @member {number}
         */
        this._rotation = rotation === true ? -Math.PI / 2 : rotation;

        // setup frame
        if (source.ready)
        {
            if (!this._explicitFrame)
            {
                frame = new Rectangle(0, 0, source.width, source.height);

                this._onSourceUpdateBinding = source.onUpdate.add(this._onSourceUpdate, this);
            }

            this.frame = frame;
        }
        else
        {
            this._onSourceReadyBinding = source.onReady.once(this._onSourceReady, this);
        }

        this._updateID = 0;
    }

    /**
     * Updates this texture on the gpu.
     *
     */
    update()
    {
        this.baseTexture.update();
    }

    /**
     * Called when the base texture is updated
     *
     * @private
     * @param {PIXI.BaseTexture} baseTexture - The base texture.
     */
    onBaseTextureUpdated(baseTexture)
    {
        this._updateID++;

        // TODO this code looks confusing.. boo to abusing getters and setters!
        if (this.noFrame)
        {
            this.frame = new Rectangle(0, 0, baseTexture.width, baseTexture.height);
        }
        else
        {
            this.frame = this._frame;
            // TODO maybe watch out for the no frame option
            // updating the texture will should update the frame if it was set to no frame..
        }

        this.emit('update', this);
    }

    /**
     * Destroys this texture
     *
     * @param {boolean} [destroyBase=false] Whether to destroy the base texture as well
     */
    destroy(destroyBase)
    {
        if (this.baseTexture)
        {
            if (destroyBase)
            {
                // delete the texture if it exists in the texture cache..
                // this only needs to be removed if the base texture is actually destroyed too..
                if (TextureCache[this.baseTexture.imageUrl])
                {
                    Texture.removeFromCache(this.baseTexture.imageUrl);
                }

                this.baseTexture.destroy();
            }

            this.baseTexture.off('update', this.onBaseTextureUpdated, this);

            this.baseTexture = null;
        }

        this._frame = null;
        this._uvs = null;
        this.trim = null;
        this.orig = null;

        this.valid = false;

        Texture.removeFromCache(this);
        this.textureCacheIds = null;
    }

    /**
     * Creates a new texture object that acts the same as this one.
     *
     * @return {PIXI.Texture} The new texture
     */
    clone()
    {
        return new Texture(this.baseTexture, this.frame, this.orig, this.trim, this.rotate);
    }

    /**
     * Updates the internal WebGL UV cache.
     *
     * @protected
     */
    _updateUvs()
    {
        if (!this._uvs)
        {
            this._uvs = new TextureUvs();
        }

        this._uvs.set(this._frame, this.baseTexture, this.rotate);

        this._updateID++;
    }

    /**
     * Helper function that creates a Texture object from the given image url.
     * If the image is not in the texture cache it will be  created and loaded.
     *
     * @static
     * @param {string} imageUrl - The image url of the texture
     * @param {boolean} [crossorigin] - Whether requests should be treated as crossorigin
     * @param {number} [scaleMode=PIXI.settings.SCALE_MODE] - See {@link PIXI.SCALE_MODES} for possible values
     * @param {number} [sourceScale=(auto)] - Scale for the original image, used with SVG images.
     * @return {PIXI.Texture} The newly created texture
     */
    static fromImage(imageUrl, crossorigin, scaleMode, sourceScale)
    {
        let texture = TextureCache[imageUrl];

        if (!texture)
        {
            texture = new Texture(BaseTexture.fromImage(imageUrl, crossorigin, scaleMode, sourceScale));
            Texture.addToCache(texture, imageUrl);
        }

        return texture;
    }

    /**
     * Helper function that creates a sprite that will contain a texture from the TextureCache based on the frameId
     * The frame ids are created when a Texture packer file has been loaded
     *
     * @static
     * @param {string} frameId - The frame Id of the texture in the cache
     * @return {PIXI.Texture} The newly created texture
     */
    static fromFrame(frameId)
    {
        const texture = TextureCache[frameId];

        if (!texture)
        {
            throw new Error(`The frameId "${frameId}" does not exist in the texture cache`);
        }

        return texture;
    }

    /**
     * Helper function that creates a new Texture based on the given canvas element.
     *
     * @static
     * @param {HTMLCanvasElement} canvas - The canvas element source of the texture
     * @param {number} [scaleMode=PIXI.settings.SCALE_MODE] - See {@link PIXI.SCALE_MODES} for possible values
     * @param {string} [origin='canvas'] - A string origin of who created the base texture
     * @return {PIXI.Texture} The newly created texture
     */
    static fromCanvas(canvas, scaleMode, origin = 'canvas')
    {
        return new Texture(BaseTexture.fromCanvas(canvas, scaleMode, origin));
    }

    /**
     * Helper function that creates a new Texture based on the given video element.
     *
     * @static
     * @param {HTMLVideoElement|string} video - The URL or actual element of the video
     * @param {number} [scaleMode=PIXI.settings.SCALE_MODE] - See {@link PIXI.SCALE_MODES} for possible values
     * @return {PIXI.Texture} The newly created texture
     */
    static fromVideo(video, scaleMode)
    {
        if (typeof video === 'string')
        {
            return Texture.fromVideoUrl(video, scaleMode);
        }

        return new Texture(VideoBaseTexture.fromVideo(video, scaleMode));
    }

    /**
     * Helper function that creates a new Texture based on the video url.
     *
     * @static
     * @param {string} videoUrl - URL of the video
     * @param {number} [scaleMode=PIXI.settings.SCALE_MODE] - See {@link PIXI.SCALE_MODES} for possible values
     * @return {PIXI.Texture} The newly created texture
     */
    static fromVideoUrl(videoUrl, scaleMode)
    {
        return new Texture(VideoBaseTexture.fromUrl(videoUrl, scaleMode));
    }

    /**
     * Helper function that creates a new Texture based on the source you provide.
     * The source can be - frame id, image url, video url, canvas element, video element, base texture
     *
     * @static
     * @param {number|string|HTMLImageElement|HTMLCanvasElement|HTMLVideoElement|PIXI.BaseTexture}
     *        source - Source to create texture from
     * @return {PIXI.Texture} The newly created texture
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

        let texture = TextureCache[cacheId];

        if (!texture)
        {
            texture = new Texture(new BaseTexture(source));
            texture.baseTexture.cacheId = cacheId;
            TextureCache[cacheId] = texture;
            BaseTextureCache[cacheId] = texture.baseTexture;
        }
        else
        {
          //  console.log(texture.baseTexture.width)
        }
        // lets assume its a base texture!
        return texture;
    }

    /**
     * Create a texture from a source and add to the cache.
     *
     * @static
     * @param {HTMLImageElement|HTMLCanvasElement} source - The input source.
     * @param {String} imageUrl - File name of texture, for cache and resolving resolution.
     * @param {String} [name] - Human readible name for the texture cache. If no name is
     *        specified, only `imageUrl` will be used as the cache ID.
     * @return {PIXI.Texture} Output texture
     */
    static fromLoader(source, imageUrl, name)
    {
        // console.log('added from loader...')
        const resource = new ImageResource(source);//.from(imageUrl, crossorigin);// document.createElement('img');

        //  console.log('base resource ' + resource.width);
        const baseTexture = new BaseTexture(resource,
                                            settings.SCALE_MODE,
                                            getResolutionOfUrl(imageUrl));

        const texture = new Texture(baseTexture);

        // No name, use imageUrl instead
        if (!name)
        {
            name = imageUrl;
        }

        // lets also add the frame to pixi's global cache for fromFrame and fromImage fucntions
        BaseTexture.addToCache(texture.baseTexture, name);
        Texture.addToCache(texture, name);

        // also add references by url if they are different.
        if (name !== imageUrl)
        {
            BaseTexture.addToCache(texture.baseTexture, imageUrl);
            Texture.addToCache(texture, imageUrl);
        }

        return texture;
    }

    /**
     * Adds a Texture to the global TextureCache. This cache is shared across the whole PIXI object.
     *
     * @static
     * @param {PIXI.Texture} texture - The Texture to add to the cache.
     * @param {string} id - The id that the Texture will be stored against.
     */
    static addToCache(texture, id)
    {
        if (id)
        {
            if (texture.textureCacheIds.indexOf(id) === -1)
            {
                texture.textureCacheIds.push(id);
            }

            // @if DEBUG
            /* eslint-disable no-console */
            if (TextureCache[id])
            {
                console.warn(`Texture added to the cache with an id [${id}] that already had an entry`);
            }
            /* eslint-enable no-console */
            // @endif

            TextureCache[id] = texture;
        }
    }

    /**
     * Remove a Texture from the global TextureCache.
     *
     * @static
     * @param {string|PIXI.Texture} texture - id of a Texture to be removed, or a Texture instance itself
     * @return {PIXI.Texture|null} The Texture that was removed
     */
    static removeFromCache(texture)
    {
        if (typeof texture === 'string')
        {
            const textureFromCache = TextureCache[texture];

            if (textureFromCache)
            {
                const index = textureFromCache.textureCacheIds.indexOf(texture);

                if (index > -1)
                {
                    textureFromCache.textureCacheIds.splice(index, 1);
                }

                delete TextureCache[texture];

                return textureFromCache;
            }
        }
        else
        {
            for (let i = 0; i < texture.textureCacheIds.length; ++i)
            {
                delete TextureCache[texture.textureCacheIds[i]];
            }

            texture.textureCacheIds.length = 0;

            return texture;
        }

        return null;
    }

    /**
     * The frame specifies the region of the base texture that this texture uses.
     *
     * @member {PIXI.Rectangle}
     */
    get frame()
    {
        return this._frame;
    }

    set frame(frame) // eslint-disable-line require-jsdoc
    {
        this._frame = frame;

        this.noFrame = false;

        if (frame.x + frame.width > this.baseTexture.width || frame.y + frame.height > this.baseTexture.height)
        {
            throw new Error('Texture Error: frame does not fit inside the base Texture dimensions: '
                + `X: ${frame.x} + ${frame.width} > ${this.baseTexture.width} `
                + `Y: ${frame.y} + ${frame.height} > ${this.baseTexture.height}`);
        }

        // this.valid = frame && frame.width && frame.height && this.baseTexture.source && this.baseTexture.hasLoaded;
        this.valid = frame && frame.width && frame.height && this.baseTexture.valid;

        if (!this.trim && !this.rotate)
        {
            this.orig = frame;
        }

        if (this.valid)
        {
            this._updateUvs();
        }
    }

    /**
     * Indicates whether the texture is rotated inside the atlas
     * set to 2 to compensate for texture packer rotation
     * set to 6 to compensate for spine packer rotation
     * can be used to rotate or mirror sprites
     * See {@link PIXI.GroupD8} for explanation
     *
     * @member {number}
     */
    get rotate()
    {
        return this._rotate;
    }

    set rotate(rotate) // eslint-disable-line require-jsdoc
    {
        this._rotate = rotate;
        if (this.valid)
        {
            this._updateUvs();
        }
    }

    /**
     * The width of the Texture in pixels.
     *
     * @member {number}
     */
    get width()
    {
        return this.orig.width;
    }

    /**
     * The height of the Texture in pixels.
     *
     * @member {number}
     */
    get height()
    {
        return this.orig.height;
    }
}

Texture.fromImage = Texture.from;
Texture.fromSVG = Texture.from;
Texture.fromCanvas = Texture.from;
Texture.fromVideo = Texture.from;
Texture.fromFrame = Texture.from;

function createWhiteTexture()
{
    const canvas = document.createElement('canvas');

    canvas.width = 10;
    canvas.height = 10;

    const context = canvas.getContext('2d');

    context.fillStyle = 'white';
    context.fillRect(0, 0, 10, 10);

    return new Texture(new BaseTexture(new CanvasResource(canvas)));
}

function removeAllHandlers(tex)
{
    tex.destroy = function _emptyDestroy() { /* empty */ };
    tex.on = function _emptyOn() { /* empty */ };
    tex.once = function _emptyOnce() { /* empty */ };
    tex.emit = function _emptyEmit() { /* empty */ };
}

/**
 * An empty texture, used often to not have to create multiple empty textures.
 * Can not be destroyed.
 *
 * @static
 * @constant
 */
Texture.EMPTY = new Texture(new BaseTexture());
removeAllHandlers(Texture.EMPTY);
removeAllHandlers(Texture.EMPTY.baseTexture);

/**
 * A white texture of 10x10 size, used for graphics and other things
 * Can not be destroyed.
 *
 * @static
 * @constant
 */
Texture.WHITE = createWhiteTexture();
removeAllHandlers(Texture.WHITE);
removeAllHandlers(Texture.WHITE.baseTexture);
