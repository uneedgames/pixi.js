import { UidComponent, UpdateComponent } from '@pixi/components';

/**
 * A wrapper for data so that it can be used and uploaded by WebGL
 *
 * @class
 * @memberof geometry
 */
export default class Buffer extends UidComponent(UpdateComponent())
{
    /**
     * @param {ArrayBuffer|SharedArrayBuffer|ArrayBufferView} data the data to store in the buffer.
     */
    constructor(data)
    {
        super();

        /**
         * The data in the buffer, as a typed array
         *
         * @type {ArrayBuffer|SharedArrayBuffer|ArrayBufferView} data  the array / typedArray
         */
        this.data = data || new Float32Array(1);

        /**
         * A map of renderer IDs to webgl buffer
         *
         * @private
         * @member {object<number, GLBuffer>}
         */
        this._glBuffers = {};

        this.index = false;

        this.static = true;
    }

    /**
     * Flags this buffer as requiring an upload to the GPU
     *
     * TODO could explore flagging only a partial upload?
     */
    update(data)
    {
        this.data = data || this.data;

        super.update();
    }

    /**
     * Destroys the buffer
     */
    destroy()
    {
        for (let i = 0; i < this._glBuffers.length; i++)
        {
            this._glBuffers[i].destroy();
        }

        this.data = null;
    }

    /**
     * Helper function that creates a buffer based on an array or TypedArray
     *
     * @static
     * @param {TypedArray| Array} data the TypedArray that the buffer will store. If this is a regular Array it will be converted to a Float32Array.
     * @return {PIXI.mesh.Buffer} A new Buffer based on the data provided.
     */
    static from(data)
    {
        if (data instanceof Array)
        {
            data = new Float32Array(data);
        }

        return new Buffer(data);
    }
}

