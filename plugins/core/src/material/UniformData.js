import { GLData } from '@pixi/gl';

/**
 * @class
 */
export default class UniformData
{
    /**
     * @param {WebGLActiveInfo} data The result of a `getActiveUniform` call
     * @param {number} location The result of a `getAttribLocation` call
     */
    constructor(data, location)
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
         * The size of the uniform's type (FLOAT = 1, FLOAT_VEC2 = 2, etc.)
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
