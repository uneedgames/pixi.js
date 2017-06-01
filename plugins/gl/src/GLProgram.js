import * as GLConstants from './GLConstants';
import * as GLData from './GLData';
import GLProgramCache from './GLProgramCache';

// @ifdef DEBUG
import { ASSERT } from '@pixi/debug';
// @endif

/**
 * Helper class to create a webGL Shader
 *
 * @class
 * @memberof gl
 */
export default class GLProgram
{
    /**
     * @param {WebGLRenderingContext} gl The rendering context.
     * @param {string|string[]} vertexSrc The vertex shader source as an array of strings.
     * @param {string|string[]} fragmentSrc The fragment shader source as an array of strings.
     * @param {object} [options] Options for this program
     * @param {Object<string, number>} [options.attributeLocations] A key value pair showing which location
     *  each attribute should sit eg `{ position: 0, uvs: 1 }`.
     * @param {object} [options.vertexPrecision] The precision to use when preprocessing the vertex shader.
     * @param {object} [options.fragmentPrecision] The precision to use when preprocessing the fragment shader.
     */
    constructor(gl, vertexSrc, fragmentSrc, options = {})
    {
        const vprec = options.vertexPrecision || GLProgram.defaultVertexPrecision;
        const fprec = options.fragmentPrecision || GLProgram.defaultFragmentPrecision;

        /**
         * The current WebGL rendering context
         *
         * @member {WebGLRenderingContext}
         */
        this.gl = gl;

        /**
         * The vertex shader source of the program.
         *
         * @member {string}
         */
        this.vertexSrc = GLProgram.preprocess(vertexSrc, vprec);

        /**
         * The fragment shader source of the program.
         *
         * @member {string}
         */
        this.fragmentSrc = GLProgram.preprocess(fragmentSrc, fprec);

        /**
         * The WebGL shader program
         *
         * @member {WebGLProgram}
         */
        this.program = null;

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

        /**
         * A map of attribute names to location indices.
         *
         * @member {Object}
         */
        this.customAttributeLocations = options.attributeLocations;

        // initialize
        this.recompile();
    }

    /**
     * Compiles source into a program.
     *
     * @static
     * @param {WebGLRenderingContext} gl The rendering context.
     * @param {string} vertexSrc The vertex shader source as an array of strings.
     * @param {string} fragmentSrc The fragment shader source as an array of strings.
     * @param {Object<number,string>} attributeLocations Map of attribute names ot locations.
     * @param {boolean} forceCompile When set to true this will always compile,
     *  skipping the cache checks
     * @return {WebGLProgram} the shader program
     */
    static compileProgram(gl, vertexSrc, fragmentSrc, attributeLocations, forceCompile = false)
    {
        const cacheKey = GLProgramCache.key(vertexSrc, fragmentSrc);

        if (!forceCompile)
        {
            const cachedProgram = GLProgramCache.get(gl, cacheKey);

            if (cachedProgram)
            {
                return cachedProgram;
            }
        }

        const glVertShader = GLProgram.compileShader(gl, GLConstants.VERTEX_SHADER, vertexSrc);
        const glFragShader = GLProgram.compileShader(gl, GLConstants.FRAGMENT_SHADER, fragmentSrc);

        let program = gl.createProgram();

        gl.attachShader(program, glVertShader);
        gl.attachShader(program, glFragShader);

        // optionally, set the attributes manually for the program rather than letting WebGL decide..
        if (attributeLocations)
        {
            for (const i in attributeLocations)
            {
                gl.bindAttribLocation(program, attributeLocations[i], i);
            }
        }

        gl.linkProgram(program);

        // @ifdef DEBUG

        // if linking fails, then log and cleanup
        if (!gl.getProgramParameter(program, GLConstants.LINK_STATUS))
        {
            ASSERT(false, `Could not initialize shader.
gl.VALIDATE_STATUS: ${gl.getProgramParameter(program, GLConstants.VALIDATE_STATUS)}
gl.getError(): ${gl.getError()}
gl.getProgramInfoLog(): ${gl.getProgramInfoLog(program)}
            `);

            gl.deleteProgram(program);

            program = null;
        }

        // @endif

        // clean up some shaders
        gl.deleteShader(glVertShader);
        gl.deleteShader(glFragShader);

        if (program)
        {
            GLProgramCache.set(cacheKey, program);
        }

        return program;
    }

    /**
     * Compiles source into a program.
     *
     * @static
     * @param {WebGLRenderingContext} gl The rendering context.
     * @param {number} type The type, can be either gl.VERTEX_SHADER or gl.FRAGMENT_SHADER.
     * @param {string} source The fragment shader source as an array of strings.
     * @return {WebGLShader} the shader
     */
    static compileShader(gl, type, source)
    {
        const shader = gl.createShader(type);

        gl.shaderSource(shader, source);
        gl.compileShader(shader);

        // @ifdef DEBUG

        if (!gl.getShaderParameter(shader, GLConstants.COMPILE_STATUS))
        {
            ASSERT(false, `Failed to compile shader.
gl.COMPILE_STATUS: ${gl.getShaderParameter(shader, GLConstants.COMPILE_STATUS)}
gl.getShaderInfoLog(): ${gl.getShaderInfoLog(shader)}
            `);

            return null;
        }

        // @endif

        return shader;
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

    /**
     * Extracts the attributes
     *
     * @static
     * @param {WebGLRenderingContext} gl The rendering context.
     * @param {WebGLProgram} program The shader program to get the attributes from
     * @return {object} attributes
     */
    static extractAttributeData(gl, program)
    {
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
     * Extracts the uniforms
     *
     * @static
     * @param {WebGLRenderingContext} gl The rendering context.
     * @param {WebGLProgram} program The shader program to get the uniforms from
     * @return {object} uniforms
     */
    static extractUniformData(gl, program)
    {
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
     * Recompiles the shader program.
     *
     * @param {boolean} forceCompile - When set to true this will always compile,
     *  skipping the cache checks.
     */
    recompile(forceCompile = false)
    {
        if (!this.vertexSrc || !this.fragmentSrc) return;

        // @ifdef DEBUG
        // eslint-disable-next-line max-len
        ASSERT(this.gl && !this.gl.isContextLost(), 'Cannot compile GLProgram without a context, or with a lost context.');
        // @endif

        this.program = GLProgram.compileProgram(
            this.gl,
            this.vertexSrc,
            this.fragmentSrc,
            this.customAttributeLocations,
            forceCompile
        );

        this.attributeData = GLProgram.extractAttributeData(this.gl, this.program);
        this.uniformData = GLProgram.extractUniformData(this.gl, this.program);
    }

    /**
     * Uses this shader
     */
    bind()
    {
        // @ifdef DEBUG
        ASSERT(this.gl && !this.gl.isContextLost(), 'Cannot bind program without a context, or with a lost context.');
        // @endif

        this.gl.useProgram(this.program);
    }

    /**
     * Deletes the program from the context and cache.
     *
     */
    deleteProgram()
    {
        // @ifdef DEBUG
        ASSERT(this.gl && !this.gl.isContextLost(), 'Cannot delete program without a context, or with a lost context.');
        // @endif

        GLProgramCache.delete(this.gl, GLProgramCache.key(this.vertexSrc, this.fragmentSrc));

        this.gl.deleteProgram(this.program);
    }

    /**
     * Destroys this program
     *
     */
    destroy()
    {
        this.deleteProgram();

        this.gl = null;
        this.program = null;
        this.attributes = null;
        this.uniformData = null;
        this.uniforms = null;
    }
}

GLProgram.defaultVertexPrecision = 'highp';
GLProgram.defaultFragmentPrecision = 'highp';

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
