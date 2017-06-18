import { GL_SIZE_MAP } from '@pixi/gl';
import { UidComponent } from '@pixi/components';

// @ifdef DEBUG
import { ASSERT } from '@pixi/debug';
// @endif

/**
 * A material is an object which can be combined with a geometry object to render
 * something. The material defines the "look" of the rendered object by detailing
 * the shader program and resources necessary to draw the geometry.
 *
 * @class
 */
export default class Material extends UidComponent()
{
    /**
     * @param {Program} program The program to use for this material.
     */
    constructor(program)
    {
        super();

        /**
         * This can hint to the renderer if it is able to batch this material
         * with other adjacent materials.
         */
        // this.canBeBatched = false;

        /**
         * The underlying shader program.
         *
         * @member {Program}
         */
        this.program = program;

        /**
         * The uniforms of this program, the properties on here are built
         * dynamically based on the data reflected from the given shaders.
         *
         * @member {Object}
         */
        this.uniforms = this._createUniformAccessObject();

        /**
         * The functions that need to run to sync the uniform values to the GPU.
         *
         * @private
         * @member {Program.UniformData[]}
         */
        this._pendingUniformUploads = [];
    }

    /**
     * Uploads uniforms to the GPU.
     *
     * @param {WebGLRenderingContext} gl The rendering context to use.
     */
    uploadUniforms(gl)
    {
        for (let i = 0; i < this._pendingUniformUploads.length; ++i)
        {
            const uniformData = this._pendingUniformUploads[i];

            uniformData.upload(gl, uniformData.location, uniformData.value);
        }
    }

    /**
     * Creates an object for accessing and setting uniform values.
     *
     * @private
     * @return {object} uniform access object.
     */
    _createUniformAccessObject()
    {
        // this is the object we will be sending back.
        // an object hierachy will be created for structs
        const uniforms = {};
        const uniformKeys = Object.keys(this.program.uniformData);

        for (let i = 0; i < uniformKeys.length; ++i)
        {
            const fullName = uniformKeys[i];

            const nameTokens = fullName.split('.');
            const name = nameTokens[nameTokens.length - 1];

            const uniformGroup = getUniformGroup(nameTokens, uniforms);
            const uniformData = this.program.uniformData[fullName];

            Reflect.defineProperty(uniformGroup, name, {
                enumerable: true,
                get: () => uniformData.value,
                set: getUniformSetter(uniformData),
            });
        }

        return uniforms;
    }
}

function getUniformGroup(nameTokens, uniform)
{
    let cur = uniform;

    for (let i = 0; i < nameTokens.length - 1; ++i)
    {
        const o = cur[nameTokens[i]] || {};

        cur[nameTokens[i]] = o;
        cur = o;
    }

    return cur;
}

function getUniformSetter(uniformData)
{
     GL_SIZE_MAP[uniformData.type] === 1
    ? (value) =>
    {
        if (uniformData.value !== value)
        {
            uniformData.value = value;

            if (this._pendingUniformUploads.indexOf(uniformData))
            {
                this._pendingUniformUploads.push(uniformData);
            }
        }
    }
    : (value) =>
    {
        // @ifdef DEBUG
        ASSERT(uniformData.value.length === value.length, 'Attempt to set invalid value to a uniform, array sizes do not match.');
        // @endif

        let different = false;

        for (let i = 0; i < uniformData.value.length; ++i)
        {
            if (uniformData.value[i] !== value[i])
            {
                different = true;
                break;
            }
        }

        if (different)
        {
            uniformData.value = value;

            if (this._pendingUniformUploads.indexOf(uniformData))
            {
                this._pendingUniformUploads.push(uniformData);
            }
        }
    },
}
