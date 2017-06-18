import { GLData, GLContext, GLProgram, GLConstants } from '@pixi/gl';
import { UidComponent } from '@pixi/components';
import AttributeData from './AttributeData';
import UniformData from './UniformData';

// @ifdef DEBUG
import { ASSERT } from '@pixi/debug';
// @endif

/**
 * Represents a WebGL Shader Program that can be used for drawing geometry.
 *
 * TODO (cengler): Caching on top of this or GLProgram? Should we cache
 * Programs, GLPrograms, or WebGLPrograms?
 *
 * @class
 */
export default class Program extends UidComponent()
{
    /**
     * @param {string} vertexSrc The source of the vertex shader.
     * @param {string} fragmentSrc The source of the fragment shader.
     * @param {object} [options] Optional options
     * @param {Object<string, number>} [options.attributeLocations] A key value pair showing which location
     *  each attribute should sit eg `{ position: 0, uvs: 1 }`.
     * @param {string} [options.vertexPrecision] The precision value to use for the vertex shader when preprocessing (replaces `#pragma precision`).
     * @param {string} [options.fragmentPrecision] The precision value to use for the fragment shader when preprocessing (replaces `#pragma precision`).
     */
    constructor(vertexSrc, fragmentSrc, options)
    {
        super();

        options = options || {};

        /**
         * The vertex shader.
         *
         * @member {string}
         */
        this.vertexSrc = Program.preprocess(vertexSrc, options.vertexPrecision || Program.defaultVertexPrecision);

        /**
         * The fragment shader.
         *
         * @member {string}
         */
        this.fragmentSrc = Program.preprocess(fragmentSrc, options.fragmentPrecision || Program.defaultFragmentPrecision);

        /**
         * Custom attribute locations to use.
         *
         * @member {Object<string, number>}
         */
        this.customAttributeLocations = options.customAttributeLocations || {};

        /**
         * The attribute reflection data.
         *
         * @member {Object}
         */
        this.attributeData = null;

        /**
         * The uniform reflection data.
         *
         * @member {Object}
         */
        this.uniformData = null;

        // initialize
        this._initialize();
    }

    /**
     * This callback is displayed as part of the Requester class.
     *
     * @memberof Program
     * @callback GLSetter
     * @param {WebGLRenderingContext} gl The webgl context to activate on
     * @param {number} location The location to upload to
     * @param {number|number[]} value The value to upload to the uniform
     */

    /**
     * @memberof Program
     * @typedef {object} AttributeData
     */

    /**
     * @memberof Program
     * @typedef {object} UniformData
     * @property {number} type The GL type of the uniform
     * @property {number} size The size of the uniform
     * @property {number} location The uniform location
     * @property {*} value The current value of the uniform
     * @property {GLSetter} sync The setter that will upload the value to the GPU
     */

    /**
     * Initialize our data members.
     *
     * @private
     */
    _initialize()
    {
        // TODO (cengler): Cache this so we don't do this calculation repeatedly for the same sources
        const reflectionProgram = new GLProgram(
            Program.reflectionContext,
            this.vertexSrc,
            this.fragmentSrc,
            this.customAttributeLocations
        );

        this.attributeData = Program.extractAttributeData(reflectionProgram);
        this.uniformData = Program.extractUniformData(reflectionProgram);

        reflectionProgram.destroy();
    }

    /**
     * Extracts the attribute data
     *
     * @param {GLProgram} glProgram The program to extract from
     * @return {AttributeData} attribute data
     */
    static extractAttributeData(glProgram)
    {
        const gl = glProgram.gl;
        const program = glProgram.program;
        const out = {};

        const total = gl.getProgramParameter(program, GLConstants.ACTIVE_ATTRIBUTES);

        for (let i = 0; i < total; ++i)
        {
            const data = gl.getActiveAttrib(program, i);

            out[data.name] = new AttributeData(data, gl.getAttribLocation(program, data.name));
        }

        return out;
    }

    /**
     * Extracts the uniform data
     *
     * @param {GLProgram} glProgram The program to extract from
     * @return {UniformData} uniform data
     */
    static extractUniformData(glProgram)
    {
        const gl = glProgram.gl;
        const program = glProgram.program;
        const out = {};

        const total = gl.getProgramParameter(program, GLConstants.ACTIVE_UNIFORMS);

        for (let i = 0; i < total; ++i)
        {
            const data = gl.getActiveUniform(program, i);

            out[name] = new UniformData(data, gl.getUniformLocation(data, name));
        }

        return out;
    }

    /**
     * Handles the preprocessor commands meant for this lib.
     *
     * @param {string} source The shader source.
     * @param {string} precision Precision value for `#pragma precision`.
     * @returns {string} The processed source
     */
    static preprocess(source, precision)
    {
        return source.replace('#pragma precision', `precision ${precision} float;`);
    }
}

Program.defaultVertexPrecision = 'highp';
Program.defaultFragmentPrecision = 'mediump';

/**
 * The context used to generate reflection data of programs.
 *
 * @static
 * @private
 * @member {WebGLRenderingContext}
 */
Program._reflectionContext = null;

/**
 * The context used to generate reflection data of programs.
 *
 * @static
 * @name reflectionContext
 * @member {WebGLRenderingContext}
 */
Object.defineProperty(Program, 'reflectionContext', {
    get()
    {
        if (!Program._reflectionContext)
        {
            const canvas = document.createElement('canvas');

            canvas.width = 1;
            canvas.height = 1;

            Program._reflectionContext = GLContext.create(canvas);
        }

        return Program._reflectionContext;
    },
    set(v)
    {
        Program._reflectionContext = v;
    },
});
