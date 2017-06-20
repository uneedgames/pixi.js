import TextureSource from './TextureSource';
import TextureUVs from './TextureUVs';
import BufferResource from './resources/BufferResource';
import createResource from './resources/createResource';
import { UpdateComponent, DestroyComponent, UidComponent } from '@pixi/components';
import { Rectangle } from '../math';

// @ifdef DEBUG
import { ASSERT } from '@pixi/debug';
// @endif

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
 * You can use a ticker or rAF to ensure your sprites load the finished textures after processing. See issue #3068.
 *
 * @class
 * @mixes UpdateComponent
 * @mixes DestroyComponent
 * @mixes UidComponent
 * @memberof texture
 */
export default class Texture extends
    UpdateComponent(
    DestroyComponent(
    UidComponent(
    )))
{
    /**
     * @param {TextureSource} source - The base texture source to create the texture from
     * @param {Rectangle} [frame] - The rectangle frame of the texture to show
     * @param {Rectangle} [orig] - The area of original texture
     * @param {Rectangle} [trim] - Trimmed rectangle of original texture
     * @param {number} [rotation] - The rotation of the frame (in radians), after it was put in an atlas (if it was).
     *  This rotation is counteracted to draw an "unrotated" version of the frame.
     */
    constructor(source, frame, orig, trim, rotation = 0)
    {
        // make sure our components get initialized
        super();

        // massage source into a TextureSource instance.
        if (source instanceof Texture)
        {
            source = source.source;
        }
        else if (!(source instanceof TextureSource))
        {
            source = new TextureSource(source);
        }

        // @ifdef DEBUG
        ASSERT(source instanceof TextureSource, 'Source passed to Texture is not a TextureSource.', source);
        // @endif

        /**
         * The source for this texture to represent.
         *
         * @readonly
         * @member {TextureSource}
         */
        this.source = source;

        /**
         * This is the trimmed area of original texture, before it was put in atlas
         *
         * @member {Rectangle}
         */
        this.trim = trim || null;

        /**
         * This is the area of original texture, before it was put in atlas
         *
         * @member {Rectangle}
         */
        this.orig = orig || frame;

        /**
         * Does this texture have an explicit frame, or do we use the whole image?
         *
         * @private
         * @member {boolean}
         */
        this._explicitFrame = frame || null;

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
        if (source.valid)
        {
            this._onSourceReady();
        }
        else
        {
            this._onSourceReadyBinding = source.onReady.once(this._onSourceReady, this);
        }
    }

    /**
     * Is this texture source ready to be used (does it have a valid frame/source)
     *
     * @member {boolean}
     */
    get ready()
    {
        return this._frame && this._frame.width && this._frame.height && this.source.ready;
    }

    /**
     * The frame specifies the region of the texture source that this texture uses.
     *
     * @member {Rectangle}
     */
    get frame()
    {
        return this._frame;
    }

    set frame(frame) // eslint-disable-line require-jsdoc
    {
        this._frame = frame;
        this._explicitFrame = frame;

        this.updateUVs();
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

    /**
     * Creates a new texture object that acts the same as this one.
     *
     * @return {Texture} The new texture
     */
    clone()
    {
        return new Texture(this.source, this._frame, this.orig, this.trim, this.rotate);
    }

    /**
     * Updates this texture on the gpu.
     *
     */
    update()
    {
        super.update();

        this.source.update();
    }

    /**
     * Updates the UVs of this texture. If you change the frame dimensions, without
     * reassigning the {@link Texture#frame} property you will need to call this function.
     *
     * Calling this function will also call {@link Texture#update} and dispatch the update signal.
     *
     */
    updateUVs()
    {
        // @ifdef DEBUG
        const v = this._frame;

        ASSERT(
            v.x >= 0 && v.y >= 0 && v.x + v.width <= this.source.width && v.y + v.height <= this.source.height,
            'Frame for texture doesn\'t fit within the source size.',
            v
        );
        // @endif

        if (!this.trim && this.rotate % (Math.PI * 2) === 0)
        {
            this.orig = this._frame;
        }

        if (this.ready)
        {
            this._uvs.set(this._frame, this.source, this.rotate);
            this.update();
        }
    }

    /**
     * Destroys this texture
     *
     * @param {boolean} destroySource Whether to destroy the texture source as well
     */
    destroy(destroySource)
    {
        super.destroy();

        if (destroySource)
        {
            this.source.destroy();
        }

        if (this._onSourceReadyBinding)
        {
            this._onSourceReadyBinding.detach();
            this._onSourceReadyBinding = null;
        }

        if (this._onSourceUpdateBinding)
        {
            this._onSourceUpdateBinding.detach();
            this._onSourceUpdateBinding = null;
        }

        this.source = null;
        this.trim = null;
        this.orig = null;

        this._frame = null;
        this._uvs = null;
    }

    /**
     * Called when the base texture is updated
     *
     * @private
     */
    _onSourceReady()
    {
        if (!this._explicitFrame)
        {
            this._frame = new Rectangle(0, 0, this.source.width, this.source.height);

            this._onSourceUpdateBinding = this.source.onUpdate.add(this._onSourceUpdate, this);
        }
        else
        {
            this._frame = this._explicitFrame;
        }

        this.updateUVs();
    }

    /**
     * Helper function that creates a Texture object from the given image url.
     * If the image is not in the texture cache it will be  created and loaded.
     *
     * TODO (cengler): Create jsdoc interface to use as type of sourceOptions and resourceOptions.
     *
     * @static
     * @param {string} imageUrl The image url of the texture
     * @param {*} sourceOptions TODO
     * @param {*} resourceOptions TODO
     * @return {Texture} The newly created texture
     */
    static from(imageUrl, sourceOptions, resourceOptions)
    {
        return new Texture(
            new TextureSource(
                createResource(imageUrl, resourceOptions),
                sourceOptions
            )
        );
    }
}

/**
 * An empty texture.
 *
 * @static
 * @constant
 */
Texture.EMPTY = new Texture(new TextureSource(new BufferResource(new Uint8Array(0))));
Texture.EMPTY.destroy = function _emptyDestroy() { /* empty */ };
Texture.EMPTY.source.destroy = function _emptyDestroy() { /* empty */ };
