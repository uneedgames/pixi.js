import * as GLConstants from './GLConstants';

// @ifdef DEBUG
import { ASSERT } from '@pixi/debug';
// @endif

const EMPTY_ARRAY_BUFFER = new ArrayBuffer(0);

/**
 * Helper class to create a WebGL buffer.
 *
 * @class
 * @memberof glutil
 */
export default class GLBuffer
{
    /**
     * Creates a new GLBuffer.
     *
     * @param {WebGLRenderingContext} gl The current WebGL rendering context
     * @param {GLConstants.ARRAY_BUFFER|GLConstants.ELEMENT_ARRAY_BUFFER} type Array type
     * @param {ArrayBuffer|SharedArrayBuffer|ArrayBufferView} data An array of data
     * @param {GLConstants.STATIC_DRAW|GLConstants.DYNAMIC_DRAW|GLConstants.STREAM_DRAW} drawType Type of draw
     */
    constructor(gl, type = GLConstants.ARRAY_BUFFER, data = EMPTY_ARRAY_BUFFER, drawType = GLConstants.STATIC_DRAW)
    {
        // @ifdef DEBUG
        ASSERT(type === GLConstants.ARRAY_BUFFER || type === GLConstants.ELEMENT_ARRAY_BUFFER, 'Buffer type must be ARRAY_BUFFER or ELEMENT_ARRAY_BUFFER.');
        ASSERT(type === GLConstants.STATIC_DRAW || drawType === GLConstants.DYNAMIC_DRAW || drawType === GLConstants.STREAM_DRAW, 'Buffer draw type must be STATIC_DRAW, DYNAMIC_DRAW, or STREAM_DRAW.');
        ASSERT(data instanceof ArrayBuffer || data.buffer instanceof ArrayBuffer, 'Unknown type passed as data, should be an ArrayBuffer or ArrayBufferView.');
        // @endif

        /**
         * The current WebGL rendering context
         *
         * @member {WebGLRenderingContext}
         */
        this.gl = gl;

        /**
         * The WebGL buffer, created upon instantiation
         *
         * @member {WebGLBuffer}
         */
        this.buffer = gl.createBuffer();

        /**
         * The type of the buffer
         *
         * @member {GLConstants.ARRAY_BUFFER|GLConstants.ELEMENT_ARRAY_BUFFER}
         */
        this.type = type;

        /**
         * The draw type of the buffer
         *
         * @member {GLConstants.STATIC_DRAW|GLConstants.DYNAMIC_DRAW|GLConstants.STREAM_DRAW}
         */
        this.drawType = drawType;

        /**
         * The data in the buffer, as a typed array
         *
         * @member {ArrayBuffer|SharedArrayBuffer|ArrayBufferView}
         */
        this.data = EMPTY_ARRAY_BUFFER;

        // uplaod data if there is some
        if (data && data !== EMPTY_ARRAY_BUFFER)
        {
            this.upload(data);
        }
    }

    /**
     * Creates a new GLBuffer, using `gl.ARRAY_BUFFER` as the type.
     *
     * @static
     * @param {WebGLRenderingContext} gl - The current WebGL rendering context
     * @param {ArrayBuffer|SharedArrayBuffer|ArrayBufferView} data - an array of data
     * @param {gl.STATIC_DRAW|gl.DYNAMIC_DRAW|gl.STREAM_DRAW} drawType - Type of draw
     * @return {GLBuffer} New buffer, using `gl.ARRAY_BUFFER` as the type
     */
    static createVertexBuffer(gl, data, drawType)
    {
        return new GLBuffer(gl, gl.ARRAY_BUFFER, data, drawType);
    }

    /**
     * Creates a new GLBuffer, using `gl.ELEMENT_ARRAY_BUFFER` as the type.
     *
     * @static
     * @param {WebGLRenderingContext} gl - The current WebGL rendering context
     * @param {ArrayBuffer|SharedArrayBuffer|ArrayBufferView} data - an array of data
     * @param {gl.STATIC_DRAW|gl.DYNAMIC_DRAW|gl.STREAM_DRAW} drawType - Type of draw
     * @return {GLBuffer} New buffer, using `gl.ELEMENT_ARRAY_BUFFER` as the type
     */
    static createIndexBuffer(gl, data, drawType)
    {
        return new GLBuffer(gl, gl.ELEMENT_ARRAY_BUFFER, data, drawType);
    }

    /**
     * Uploads the buffer to the GPU
     *
     * @param {ArrayBuffer|SharedArrayBuffer|ArrayBufferView} data - an array of data to upload
     * @param {number} offset - if only a subset of the data should be uploaded, this is the amount of data to subtract
     * @param {boolean} dontBind - whether to bind the buffer before uploading it
     */
    upload(data = this.data, offset = 0, skipBind = false)
    {
        if (!skipBind) this.bind();

        const gl = this.gl;

        if (this.data.byteLength >= data.byteLength)
        {
            gl.bufferSubData(this.type, offset, data);
        }
        else
        {
            gl.bufferData(this.type, data, this.drawType);
        }

        this.data = data;
    }

    /**
     * Binds the buffer
     *
     */
    bind()
    {
        this.gl.bindBuffer(this.type, this.buffer);
    }

    /**
     * Destroys the buffer
     *
     */
    destroy()
    {
        if (this.gl.isBuffer(this.buffer))
        {
            this.gl.deleteBuffer(this.buffer);
        }

        this.gl = null;
        this.buffer = null;
        this.data = null;
    }
}
