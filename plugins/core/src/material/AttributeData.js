import { GLData } from '@pixi/gl';

/**
 * @class
 */
export default class AttributeData
{
    /**
     * @param {WebGLActiveInfo} data The result of a `getActiveUniform` call
     * @param {number} location The result of a `getAttribLocation` call
     */
    constructor(data, location)
    {
        /**
         * The GL type of the attribute (FLOAT, FLOAT_VEC2, etc.)
         *
         * @member {number}
         */
        this.type = data.type;

        /**
         * The string name of the attribute
         *
         * @member {string}
         */
        this.name = data.name;

        /**
         * The size of the attribute's type (FLOAT = 1, FLOAT_VEC2 = 2, etc.)
         *
         * @member {number}
         */
        this.size = data.size;

        /**
         * The attribute location in the owning program
         *
         * @member {number}
         */
        this.location = location;
    }

    /**
     * Sets the vertex attribute pointer on the context.
     *
     * @param {WebGLRenderingContext} gl The webgl context to activate on
     * @param {number} [type] The type of the attribute to activate
     * @param {boolean} [normalized] Is the attribute normalized
     * @param {number} [stride] The stride of the attribute
     * @param {number} [start] The offset of the attribute
     */
    setup(gl, type = this.type, normalized = false, stride = 0, start = 0)
    {
        gl.vertexAttribPointer(
            this.location,
            this.size,
            type,
            normalized,
            stride,
            start
        );
    }
}
