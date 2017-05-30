const PI2 = Math.PI * 2;

/**
 * A standard object to store the Uvs of a texture
 *
 * @class
 * @private
 * @memberof texture
 */
export default class TextureUVs
{
    /**
     *
     */
    constructor()
    {
        this.array = new Uint16Array([0, 0, 1, 0, 1, 1, 0, 1]);
    }

    /**
     * Transforms an array of UV points to be relative to this texture's UV range.
     *
     * For example, if this texture is the rect (0.5, 0.5) -> (1.0, 1.0) and you want to
     * transform the point (0.5, 0.5). The result is (0.75, 0.75).
     *
     * @param {Uint16Array} array The array of UVs to transform.
     */
    transformUVArray(array)
    {
        // TODO (cengler): Implement this, should allow us to support all features within a spritesheet!
        // Doing just axis-aligned texture UVs is easy, but need to ensure this supports non-quad UV arrays
        // and textureUV rotation...
    }

    /**
     * Sets the texture Uvs based on the given frame information.
     *
     * @private
     * @param {PIXI.Rectangle} frame The frame of the texture
     * @param {PIXI.Rectangle} baseFrame The base frame of the texture
     * @param {number} rotation Rotation of frame, in radians.
     */
    set(frame, baseFrame, rotation)
    {
        const tw = baseFrame.width;
        const th = baseFrame.height;

        // calculate the normalized quad points
        this.array[0] = frame.x / tw;
        this.array[1] = frame.y / th;

        this.array[2] = (frame.x + frame.width) / tw;
        this.array[3] = frame.y / th;

        this.array[4] = (frame.x + frame.width) / tw;
        this.array[5] = (frame.y + frame.height) / th;

        this.array[6] = frame.x / tw;
        this.array[7] = (frame.y + frame.height) / th;

        // if we have rotation, then rotate our quad
        if (rotation % PI2 !== 0)
        {
            // coordinates of center
            const cx = (frame.x / tw) + (frame.width / 2 / tw);
            const cy = (frame.y / th) + (frame.height / 2 / th);

            // rotation values
            const sr = Math.sin(rotation);
            const cr = Math.cos(rotation);

            // compiler should unroll this
            for (let i = 0; i < 8; i += 2)
            {
                const x = this.array[i];
                const y = this.array[i + 1];

                /* eslint-disable no-multi-spaces */
                this.array[i]       = cx + (((x - cx) * cr) - ((y - cy) * sr));
                this.array[i + 1]   = cy + (((x - cx) * sr) + ((y - cy) * cr));
                /* eslint-enable no-multi-spaces */
            }
        }
    }
}
