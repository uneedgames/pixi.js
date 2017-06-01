import { GLData, GLContext, GLProgramCache } from '@pixi/gl';

/**
 * Represents a WebGL Shader Program that can be used for drawing geometry.
 *
 * @class
 */
export default class Program
{
    /**
     * @param {string} [vertexSrc] The source of the vertex shader.
     * @param {string} [fragmentSrc] The source of the fragment shader.
     */
    constructor(vertexSrc, fragmentSrc)
    {
        /**
         * GLProgram used for reflection data.
         *
         * @private
         * @member {GLProgram}
         */
        this._reflectionProgram = new GLProgramCache(Program.reflectionContext, vertexSrc, fragmentSrc);

        this.uniforms = Program.createUniformAccessObject(Program.reflectionContext, this._reflectionProgram.uniformData);
    }

    /**
     * The vertex shader source of the program.
     *
     * @readonly
     * @member {string}
     */
    get vertexSrc()
    {
        return this._reflectionProgram.vertexSrc;
    }

    /**
     * The fragment shader source of the program.
     *
     * @readonly
     * @member {string}
     */
    get fragmentSrc()
    {
        return this._reflectionProgram.fragmentSrc;
    }

    /**
     * The attribute reflection data.
     *
     * @readonly
     * @member {Object}
     */
    get attributeData()
    {
        return this._reflectionProgram.attributeData;
    }

    /**
     * The uniform reflection data.
     *
     * @readonly
     * @member {Object}
     */
    get uniformData()
    {
        return this._reflectionProgram.uniformData;
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
}

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
