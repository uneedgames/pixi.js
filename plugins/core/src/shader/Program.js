import { GLData, GLContext, GLProgram, GLConstants } from '@pixi/gl';
import { UidComponent } from '@pixi/components';

// @ifdef DEBUG
import { ASSERT } from '@pixi/debug';
// @endif

/**
 * Represents a WebGL Shader Program that can be used for drawing geometry.
 *
 * TODO (cengler): Caching on top of this or GLProgram?
 *
 * @class
 */
export default class Program extends UidComponent()
{
    /**
     * @param {string} [vertexSrc] The source of the vertex shader.
     * @param {string} [fragmentSrc] The source of the fragment shader.
     * @param {object} [options] Optional options
     * @param {Object<string, number>} [options.attributeLocations] A key value pair showing which location
     *  each attribute should sit eg `{ position: 0, uvs: 1 }`.
     * @param {string} [options.vertexPrecision] The precision value to use for the vertex shader when preprocessing (replaces `#pragma precision`).
     * @param {string} [options.fragmentPrecision] The precision value to use for the fragment shader when preprocessing (replaces `#pragma precision`).
     */
    constructor(vertexSrc, fragmentSrc, options = {})
    {
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
     * @return {object} attribute data
     */
    static extractAttributeData(glProgram)
    {
        const gl = glProgram.gl;
        const program = glProgram.program;
        const attributes = {};

        const totalAttributes = gl.getProgramParameter(program, GLConstants.ACTIVE_ATTRIBUTES);

        for (let i = 0; i < totalAttributes; ++i)
        {
            const attribData = gl.getActiveAttrib(program, i);

            // @ifdef DEBUG
            ASSERT(GLData.GL_SIZE_MAP[attribData.type], 'Unknown attribute type, unable to determine size.');
            // @endif

            attributes[attribData.name] = {
                type: attribData.type,
                name: attribData.name,
                size: GLData.GL_SIZE_MAP[attribData.type],
                location: gl.getAttribLocation(program, attribData.name),
                setup: attributeSetupFunction,
            };
        }

        return attributes;
    }

    /**
     * Extracts the uniform data
     *
     * @param {GLProgram} glProgram The program to extract from
     * @return {object} uniform data
     */
    static extractUniformData(glProgram)
    {
        const gl = glProgram.gl;
        const program = glProgram.program;
        const uniforms = {};

        const totalUniforms = gl.getProgramParameter(program, GLConstants.ACTIVE_UNIFORMS);

        for (let i = 0; i < totalUniforms; ++i)
        {
            const uniformData = gl.getActiveUniform(program, i);
            const name = uniformData.name.replace(/\[.*?\]/, '');

            uniforms[name] = {
                type: uniformData.type,
                size: uniformData.size,
                location: gl.getUniformLocation(program, name),
                value: GLData.getUniformDefault(uniformData),
            };
        }

        return uniforms;
    }

    /**
     * Creates an object for accessing and setting uniform values.
     *
     * @static
     * @param {WebGLRenderingContext} gl - The rendering context.
     * @param {object} uniformData - The uniform data to create an access object for.
     * @return {object} uniform access object.
     */
    static createUniformAccessObject(gl, uniformData)
    {
        // this is the object we will be sending back.
        // an object hierachy will be created for structs
        const uniforms = {
            __data: {},
        };

        const uniformKeys = Object.keys(uniformData);

        for (let i = 0; i < uniformKeys.length; ++i)
        {
            const fullName = uniformKeys[i];

            const nameTokens = fullName.split('.');
            const name = nameTokens[nameTokens.length - 1];

            const uniformGroup = getUniformGroup(nameTokens, uniforms);
            const uniform = uniformData[fullName];

            uniformGroup.__data[name] = uniform;

            Reflect.defineProperty(uniformGroup, name, {
                enumerable: true,
                get: () => uniform.value,
                set: (value) =>
                {
                    uniform.value = value;

                    const loc = uniform.location;

                    if (uniform.size === 1)
                    {
                        GLData.GL_SETTER[uniform.type](gl, loc, value);
                    }
                    else
                    {
                        GLData.GL_ARRAY_SETTER[uniform.type](gl, loc, value);
                    }
                },
            });
        }

        return uniforms;
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

function getUniformGroup(nameTokens, uniform)
{
    let cur = uniform;

    for (let i = 0; i < nameTokens.length - 1; ++i)
    {
        const o = cur[nameTokens[i]] || { __data: {} };

        cur[nameTokens[i]] = o;
        cur = o;
    }

    return cur;
}

function attributeSetupFunction(gl, type, normalized, stride, start)
{
    return gl.vertexAttribPointer(
        this.location,
        this.size,
        type || this.type,
        normalized || false,
        stride || 0,
        start || 0
    );
}
