import * as GLConstants from './GLConstants';

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
     * @param {Object<string, number>} [attributeLocations] A key value pair showing which location
     *  each attribute should sit eg `{ position: 0, uvs: 1 }`.
     */
    constructor(gl, vertexSrc, fragmentSrc, attributeLocations)
    {
        // @ifdef DEBUG
        // eslint-disable-next-line max-len
        ASSERT(this.gl && !this.gl.isContextLost(), 'WebGLRenderingContext must exist and not be lost.');
        ASSERT(vertexSrc, 'Vertex Shader source must exist.');
        ASSERT(fragmentSrc, 'Fragment Shader source must exist.');
        // @endif

        /**
         * The current WebGL rendering context
         *
         * @member {WebGLRenderingContext}
         */
        this.gl = gl;

        /**
         * The WebGL shader program
         *
         * @member {WebGLProgram}
         */
        this.program = GLProgram.compileProgram(
            this.gl,
            vertexSrc,
            fragmentSrc,
            attributeLocations
        );
    }

    /**
     * Binds this GLProgram.
     *
     * @return {GLProgram} Returns itself.
     */
    bind()
    {
        // @ifdef DEBUG
        ASSERT(this.gl && !this.gl.isContextLost(), 'Cannot bind program without a context, or with a lost context.');
        // @endif

        this.gl.useProgram(this.program);

        return this;
    }

    /**
     * Deletes the program from the context and cache.
     *
     * @return {GLProgram} Returns itself.
     */
    deleteProgram()
    {
        // @ifdef DEBUG
        ASSERT(this.gl && !this.gl.isContextLost(), 'Cannot delete program without a context, or with a lost context.');
        // @endif

        this.gl.deleteProgram(this.program);

        return this;
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
    static compileProgram(gl, vertexSrc, fragmentSrc, attributeLocations)
    {
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
}
