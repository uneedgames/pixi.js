import { GL_SIZE_MAP, GLConstants } from '@pixi/gl';
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
        this.uniforms = null;

        /**
         * We need ot bind the textures used for our texture uniforms when uploading,
         * so we cache which uniforms are textures and bind each when we are syncing.
         *
         * @private
         * @member {UniformData[]}
         */
        this._textureUniforms = [];

        /**
         * The uniforms that have been changed and need their values uploaded to the GPU.
         *
         * @private
         * @member {UniformData[]}
         */
        this._pendingUniformUploads = [];

        // creates the uniform access object and prepares the textureUniforms cache array.
        this._parseUniformData();
    }

    /**
     * Uploads uniforms to the GPU.
     *
     * @param {Renderer} renderer The renderer to upload to.
     */
    syncUniforms(renderer)
    {
        // bind textures
        for (let i = 0; i < this._textureUniforms.length; ++i)
        {
            const uniformData = this._textureUniforms[i];

            // TODO (cengler): Is material supposed to know about the texture manager?
            renderer.texture.bind(uniformData.value, uniformData.textureSlot);
        }

        // upload changed values
        for (let i = 0; i < this._pendingUniformUploads.length; ++i)
        {
            const uniformData = this._pendingUniformUploads[i];

            uniformData.upload(renderer.gl);
        }
    }

    /**
     * Creates an object for accessing and setting uniform values.
     *
     * @private
     * @return {object} uniform access object.
     */
    _parseUniformData()
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

            if (uniformData.isTexture)
            {
                this._textureUniforms.push(uniformData);
            }

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
    const type = uniformData.type;
    const typeSize = GL_SIZE_MAP[type];

    // For textures and array uniforms we don't perform any caching.
    if (uniformData.isTexture || uniformData.size > 1)
    {
        return (value) =>
        {
            // @ifdef DEBUG
            /* eslint-disable max-len */
            ASSERT(typeof value === typeof uniformData.value, 'Attempt to set invalid value to a uniform, types do not match.');
            ASSERT(value.constructor === uniformData.value.constructor, 'Attempt to set invalid value to a uniform, types do not match.');

            if (typeSize > 1 || uniformData.size > 1)
            {
                ASSERT(value.length === uniformData.value.length, 'Attempt to set invalid value to a uniform, array sizes do not match.');
                ASSERT(typeof value[0] === typeof uniformData.value[0], 'Attempt to set invalid value to a uniform, array types do not match.');
            }
            /* eslint-enable max-len */
            // @endif

            uniformData.value = value;

            if (this._pendingUniformUploads.indexOf(uniformData))
            {
                this._pendingUniformUploads.push(uniformData);
            }
        };
    }

    // mat3 gets a special setter, so it can take our Matrix object as a value or any { array: number[] } object.
    if (type === GLConstants.FLOAT_MAT3)
    {
        return (value) =>
        {
            // @ifdef DEBUG
            /* eslint-disable max-len */
            ASSERT((value.array || value) instanceof Float32Array, 'Attempt to set invalid value to a uniform, mat3 must be a Float32Array or Matrix object.');
            /* eslint-enable max-len */
            // @endif

            uniformData.value = value.array || value;

            if (this._pendingUniformUploads.indexOf(uniformData))
            {
                this._pendingUniformUploads.push(uniformData);
            }
        };
    }

    // vec2 gets a special setter, so it can take our Point object as a value or any { x: number, y: number } object.
    if (type === GLConstants.FLOAT_VEC2 || type === GLConstants.INT_VEC2)
    {
        return (value) =>
        {
            // @ifdef DEBUG
            /* eslint-disable max-len */
            ASSERT((value.array || value) instanceof Float32Array, 'Attempt to set invalid value to a uniform, mat3 must be a Float32Array or Matrix object.');
            /* eslint-enable max-len */
            // @endif

            let different = false;

            if (value.x !== undefined)
            {
                if (uniformData.value[0] !== value.x || uniformData.value[1] !== value.y)
                {
                    different = true;
                    uniformData.value[0] = value.x;
                    uniformData.value[1] = value.y;
                }
            }
            else if (uniformData.value[0] !== value[0] || uniformData.value[1] !== value[1])
            {
                different = true;
                uniformData.value[0] = value[0];
                uniformData.value[1] = value[1];
            }

            if (different)
            {
                if (this._pendingUniformUploads.indexOf(uniformData))
                {
                    this._pendingUniformUploads.push(uniformData);
                }
            }
        };
    }

    // For single-value types we just check and set the value (float, int, etc).
    if (typeSize === 1)
    {
        return (value) =>
        {
            // @ifdef DEBUG
            /* eslint-disable max-len */
            ASSERT(typeof value === typeof uniformData.value, 'Attempt to set invalid value to a uniform, types do not match.');
            ASSERT(value.constructor === uniformData.value.constructor, 'Attempt to set invalid value to a uniform, types do not match.');
            /* eslint-enable max-len */
            // @endif

            if (uniformData.value !== value)
            {
                uniformData.value = value;

                if (this._pendingUniformUploads.indexOf(uniformData))
                {
                    this._pendingUniformUploads.push(uniformData);
                }
            }
        };
    }

    // For non-array uniforms with array types we check if the array values are the same,
    // and if not we copy the values in.
    return (value) =>
    {
        // @ifdef DEBUG
        /* eslint-disable max-len */
        ASSERT(typeof value === typeof uniformData.value, 'Attempt to set invalid value to a uniform, types do not match.');
        ASSERT(value.constructor === uniformData.value.constructor, 'Attempt to set invalid value to a uniform, types do not match.');
        ASSERT(value.length === uniformData.value.length, 'Attempt to set invalid value to a uniform, array sizes do not match.');
        ASSERT(typeof value[0] === typeof uniformData.value[0], 'Attempt to set invalid value to a uniform, array types do not match.');
        /* eslint-enable max-len */
        // @endif

        let different = false;

        for (let i = 0; i < uniformData.value.length; ++i)
        {
            if (uniformData.value[i] !== value[i])
            {
                uniformData.value[i] = value[i];
                different = true;
            }
        }

        if (different)
        {
            if (this._pendingUniformUploads.indexOf(uniformData))
            {
                this._pendingUniformUploads.push(uniformData);
            }
        }
    };
}
