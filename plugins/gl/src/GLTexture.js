// @ifdef DEBUG
import { ASSERT } from '../debug';
// @endif

/**
 * Lightweight class to create and manage a WebGL Texture.
 *
 * @class
 * @memberof gl
 */
export default class GLTexture
{
    /**
     * @param {WebGLRenderingContext} gl The WebGL context.
     */
    constructor(gl)
    {
        /**
         * The current WebGL rendering context
         *
         * @member {WebGLRenderingContext}
         */
        this.gl = gl;

        /**
         * The WebGL texture
         *
         * @member {WebGLTexture}
         */
        this.texture = gl.createTexture();
    }

    /**
     * @static
     * @param {WebGLRenderingContext} gl - The current WebGL context
     * @param {HTMLImageElement|ImageData} source - the source image of the texture
     * @return {GLTexture} The new texture.
     */
    static fromSource(gl, source, options)
    {
        const texture = new GLTexture(gl);

        texture.upload(source, options);

        return texture;
    }

    /**
     * @static
     * @param {WebGLRenderingContext} gl - The current WebGL context
     * @param {ArrayBuffer|SharedArrayBuffer|ArrayBufferView} data - the data to upload to the texture
     * @param {number} width - the new width of the texture
     * @param {number} height - the new height of the texture
     * @return {GLTexture} The new texture.
     */
    static fromData(gl, data, width, height)
    {
        const texture = new GLTexture(gl);

        texture.uploadData(data, width, height);

        return texture;
    }

    /**
     * Uploads this texture to the GPU
     *
     * @param {HTMLImageElement|ImageData|HTMLVideoElement} source - the source image of the texture
     * @param {GLTextureUploadOptions} options The options for the upload
     */
    upload(source, options)
    {
        const gl = this.gl;

        // @ifdef DEBUG
        ASSERT(options.target, 'Options `target` property is required for image/video uploads.');
        ASSERT(options.format, 'Options `format` property is required for image/video uploads.');
        ASSERT(options.type, 'Options `format` property is required for image/video uploads.');
        // @endif

        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, options.premultiplyAlpha || false);

        // Always use texImage2D, which seems faster or the same if you are doing the entire texture.
        // - https://jsperf.com/webgl-teximage2d-vs-texsubimage2d/38
        // glTexSubImage2D used to be faster in chrome before this bug fix:
        // - https://bugs.chromium.org/p/angleproject/issues/detail?id=166
        // And this is super important for video textures to work correctly:
        // - http://codeflow.org/issues/slow_video_to_texture/
        //
        // | upload method  | resolution    | frame/s   | upload time (ms)  |
        // | :------------- | :------------ | :-------- | :---------------- |
        // | texImage2D     | 720p          | 60.07     | 0.41              |
        // | texImage2D     | 1080p         | 60.02     | 0.41              |
        // | texSubImage2D  | 720p          | 59.91     | 4.23              |
        // | texSubImage2D  | 1080p         | 59.20     | 10.02             |
        //
        gl.texImage2D(
            options.target,
            options.level || 0,
            options.format,
            options.format,
            options.type,
            source
        );
    }

    /**
     * Use a data source and uploads this texture to the GPU
     *
     * @param {ArrayBuffer|SharedArrayBuffer|ArrayBufferView} data The data to upload to the texture
     * @param {GLTextureUploadOptions} options The options for the upload
     */
    uploadData(data, options)
    {
        const gl = this.gl;

        // @ifdef DEBUG
        ASSERT(options.target, 'Options `target` property is required for data uploads.');
        ASSERT(options.format, 'Options `format` property is required for data uploads.');
        ASSERT(options.type, 'Options `format` property is required for data uploads.');
        ASSERT(typeof options.width === 'number' && options.width > -1, 'Options `width` property is required for data uploads.');
        ASSERT(typeof options.height === 'number' && options.height > -1, 'Options `height` property is required for data uploads.');
        // @endif

        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, options.premultiplyAlpha || false);
        gl.texImage2D(
            options.target,
            options.level || 0,
            options.format,
            options.width,
            options.height,
            0,
            options.format,
            options.type,
            data || null
        );
    }

    /**
     * Binds the texture
     *
     * @param {GLenum} target The target to bind to. Defaults to TEXTURE_2D.
     * @see GLConstants
     * @param {number} location The texture slot to fill. If not set just binds to
     * whatever the currently active location is.
     */
    bind(target, location = -1)
    {
        const gl = this.gl;

        if (location > -1)
        {
            gl.activeTexture(gl.TEXTURE0 + location);
        }

        gl.bindTexture(target || gl.TEXTURE_2D, this.texture);
    }

    /**
     * Binds the texture
     *
     * @param {GLenum} target The target to bind to. Defaults to TEXTURE_2D.
     * @see GLConstants
     * @param {number} location The texture slot to fill. If not set just unbinds from
     * whatever the currently active location is.
     */
    unbind(target, location = -1)
    {
        const gl = this.gl;

        if (location > -1)
        {
            gl.activeTexture(gl.TEXTURE0 + location);
        }

        gl.bindTexture(target || gl.TEXTURE_2D, null);
    }

    /**
     * Setup the texture by setting all the parameters.
     *
     * @param {GLTextureSetupOptions} options The options for the setup.
     */
    setup(options)
    {
        const gl = this.gl;
        const target = (options && options.target) || gl.TEXTURE_2D;

        gl.texParameteri(target, gl.TEXTURE_MIN_FILTER, options.minFilter);
        gl.texParameteri(target, gl.TEXTURE_MAG_FILTER, options.magFilter);
        gl.texParameteri(target, gl.TEXTURE_WRAP_S, options.wrapS);
        gl.texParameteri(target, gl.TEXTURE_WRAP_T, options.wrapT);
    }

    /**
     * Generates mipmaps for this texture.
     *
     * @param {GLenum} target The target to bind to. Defaults to TEXTURE_2D.
     */
    generateMipmap(target)
    {
        target = target || this.gl.TEXTURE_2D;

        this.gl.generateMipmap(target);
    }

    /**
     * Destroys this texture
     */
    destroy()
    {
        if (this.gl.isTexture(this.texture))
        {
            this.gl.deleteTexture(this.texture);
        }

        this.gl = null;
        this.texture = null;
    }
}

// //////////////////////////
// GLTextureUploadOptions interface
// //////////////////////////

/**
 * Upload options for a GLTexture upload.
 *
 * @interface GLTextureUploadOptions
 * @memberof GLTexture
 */

/**
 * The width of the texture to upload.
 *
 * @memberof GLTextureUploadOptions
 * @name width
 * @type {number}
 * @see GLConstants
 */

/**
 * The height of the texture to upload.
 *
 * @memberof GLTextureUploadOptions
 * @name height
 * @type {number}
 * @see GLConstants
 */

/**
 * The pixel format of the texture.
 *
 * @memberof GLTextureUploadOptions
 * @name format
 * @type {GLenum}
 * @see GLConstants
 */

/**
 * The data type of the texture.
 *
 * @memberof GLTextureUploadOptions
 * @name type
 * @type {GLenum}
 * @see GLConstants
 */

/**
 * The texture target type of the texture.
 *
 * @memberof GLTextureUploadOptions
 * @name target
 * @type {GLenum}
 * @see GLConstants
 */

/**
 * Set to true to enable pre-multiplied alpha.
 *
 * @memberof GLTextureUploadOptions
 * @name premultiplyAlpha
 * @type {boolean}
 * @default false
 */

/**
 * The mipmap level to use for this texture. Level 0 is the base image level
 * and level n is the nth mipmap reduction level.
 *
 * @memberof GLTextureUploadOptions
 * @name level
 * @type {number}
 * @default 0
 */

/**
 * Only used in WebGL2 when the internal format can differ from the format.
 * Defaults to `format` and is forced to be the same as `format` in WebGL1.
 *
 * @memberof GLTextureUploadOptions
 * @name internalformat
 * @type {GLenum}
 * @see GLConstants
 */

// //////////////////////////
// GLTextureSetupOptions interface
// //////////////////////////

/**
 * Upload options for a GLTexture upload.
 *
 * @interface GLTextureSetupOptions
 * @memberof GLTexture
 */

/**
 * The texture target type of the texture.
 *
 * @memberof GLTextureSetupOptions
 * @name target
 * @type {GLenum}
 * @see GLConstants
 */

/**
 * Texture minification filter.
 *
 * @memberof GLTextureSetupOptions
 * @name minFilter
 * @type {GLenum}
 * @see GLConstants
 */

/**
 * Texture magnification filter.
 *
 * @memberof GLTextureSetupOptions
 * @name magFilter
 * @type {GLenum}
 * @see GLConstants
 */

/**
 * Wrapping function for texture coordinate `S`.
 *
 * @memberof GLTextureSetupOptions
 * @name wrapS
 * @type {GLenum}
 * @see GLConstants
 */

/**
 * Wrapping function for texture coordinate `T`.
 *
 * @memberof GLTextureSetupOptions
 * @name wrapT
 * @type {GLenum}
 * @see GLConstants
 */
