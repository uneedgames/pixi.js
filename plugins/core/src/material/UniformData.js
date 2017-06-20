import { GLConstants, GLData } from '@pixi/gl';

/**
 * @class
 */
export default class UniformData
{
    /**
     * @param {WebGLActiveInfo} data The result of a `getActiveUniform` call
     * @param {number} location The result of a `getAttribLocation` call
     * @param {number} textureSlot The texture slot this uniform occupies (if any)
     */
    constructor(data, location, textureSlot = 0)
    {
        /**
         * The GL type of the uniform (FLOAT, FLOAT_VEC2, etc.)
         *
         * @member {number}
         */
        this.type = data.type;

        /**
         * The string name of the uniform
         *
         * @member {string}
         */
        this.name = data.name.replace(/\[.*?\]/, '');

        /**
         * The size of the uniform. All non-array values are size `1`.
         *
         * @member {number}
         */
        this.size = data.size;

        /**
         * The uniform location in the owning program
         *
         * @member {number}
         */
        this.location = location;

        /**
         * The current value of the uniform, on the CPU.
         *
         * Note: This value may not reflect the value actively on the
         * GPU as it is not immediately uploaded when changed.
         *
         * @member {number}
         */
        this.value = GLData.getUniformDefault(data);

        /**
         * If true then this uniform is a texture of some kind.
         *
         * @member {boolean}
         */
        this.isTexture = this.type === GLConstants.SAMPLER_2D
                        || this.type === GLConstants.SAMPLER_CUBE
                        || this.type === GLConstants.SAMPLER_2D_ARRAY;

        /**
         * The texture slot this uniform uses, only really useful if `isTexture` is true.
         *
         * @member {number}
         */
        this.textureSlot = textureSlot;

        /**
         * The function used to upload the uniform to the GPU.
         *
         * @private
         * @member {GLData.GLSetter}
         */
        this._setter = this.size === 1 ? GLData.GL_SETTER[this.type] : GLData.GL_ARRAY_SETTER[this.type];
    }

    /**
     * Uploads the value to the GPU at the stored location in the active program.
     *
     * @param {WebGLRenderingContext} gl The webgl context to activate on
     */
    upload(gl)
    {
        this._setter(gl, this.location, this.value);
    }
}
