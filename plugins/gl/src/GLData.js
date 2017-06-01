import * as GLConstants from './GLConstants';

// @ifdef DEBUG
import { ASSERT } from '@pixi/debug';
// @endif

/**
 * @namespace GLData
 * @memberof gl
 */

/**
 * Map of WebGL types to their respective byte sizes.
 *
 * @memberof gl.GLData
 */
export const GL_SIZE_MAP = {
    [GLConstants.FLOAT]:        1,
    [GLConstants.FLOAT_VEC2]:   2,
    [GLConstants.FLOAT_VEC3]:   3,
    [GLConstants.FLOAT_VEC4]:   4,

    [GLConstants.INT]:          1,
    [GLConstants.INT_VEC2]:     2,
    [GLConstants.INT_VEC3]:     3,
    [GLConstants.INT_VEC4]:     4,

    [GLConstants.BOOL]:         1,
    [GLConstants.BOOL_VEC2]:    2,
    [GLConstants.BOOL_VEC3]:    3,
    [GLConstants.BOOL_VEC4]:    4,

    [GLConstants.FLOAT_MAT2]:   4,
    [GLConstants.FLOAT_MAT3]:   9,
    [GLConstants.FLOAT_MAT4]:   16,

    [GLConstants.SAMPLER_2D]:   1,
};

/**
 * Map of WebGL types to setter functions to upload the values of that type.
 * This map is for single values of the types.
 *
 * @memberof gl.GLData
 */
export const GL_SETTER = {
    [GLConstants.FLOAT]:        (gl, loc, value) => gl.uniform1f(loc, value),
    [GLConstants.FLOAT_VEC2]:   (gl, loc, value) => gl.uniform2f(loc, value[0], value[1]),
    [GLConstants.FLOAT_VEC3]:   (gl, loc, value) => gl.uniform3f(loc, value[0], value[1], value[2]),
    [GLConstants.FLOAT_VEC4]:   (gl, loc, value) => gl.uniform4f(loc, value[0], value[1], value[2], value[3]),

    [GLConstants.INT]:          (gl, loc, value) => gl.uniform1i(loc, value),
    [GLConstants.INT_VEC2]:     (gl, loc, value) => gl.uniform2i(loc, value[0], value[1]),
    [GLConstants.INT_VEC3]:     (gl, loc, value) => gl.uniform3i(loc, value[0], value[1], value[2]),
    [GLConstants.INT_VEC4]:     (gl, loc, value) => gl.uniform4i(loc, value[0], value[1], value[2], value[3]),

    [GLConstants.BOOL]:         (gl, loc, value) => gl.uniform1i(loc, value),
    [GLConstants.BOOL_VEC2]:    (gl, loc, value) => gl.uniform2i(loc, value[0], value[1]),
    [GLConstants.BOOL_VEC3]:    (gl, loc, value) => gl.uniform3i(loc, value[0], value[1], value[2]),
    [GLConstants.BOOL_VEC4]:    (gl, loc, value) => gl.uniform4i(loc, value[0], value[1], value[2], value[3]),

    [GLConstants.FLOAT_MAT2]:   (gl, loc, value) => gl.uniformMatrix2fv(loc, false, value),
    [GLConstants.FLOAT_MAT3]:   (gl, loc, value) => gl.uniformMatrix3fv(loc, false, value),
    [GLConstants.FLOAT_MAT4]:   (gl, loc, value) => gl.uniformMatrix4fv(loc, false, value),

    [GLConstants.SAMPLER_2D]:   (gl, loc, value) => gl.uniform1i(loc, value),
};

/**
 * Map of WebGL types to setter functions to upload the values of that type.
 * This map is for arrays of the types.
 *
 * @memberof gl.GLData
 */
export const GL_ARRAY_SETTER = {
    [GLConstants.FLOAT]:        (gl, loc, value) => gl.uniform1fv(loc, value),
    [GLConstants.FLOAT_VEC2]:   (gl, loc, value) => gl.uniform2fv(loc, value[0], value[1]),
    [GLConstants.FLOAT_VEC3]:   (gl, loc, value) => gl.uniform3fv(loc, value[0], value[1], value[2]),
    [GLConstants.FLOAT_VEC4]:   (gl, loc, value) => gl.uniform4fv(loc, value[0], value[1], value[2], value[3]),

    [GLConstants.INT]:          (gl, loc, value) => gl.uniform1iv(loc, value),
    [GLConstants.INT_VEC2]:     (gl, loc, value) => gl.uniform2iv(loc, value[0], value[1]),
    [GLConstants.INT_VEC3]:     (gl, loc, value) => gl.uniform3iv(loc, value[0], value[1], value[2]),
    [GLConstants.INT_VEC4]:     (gl, loc, value) => gl.uniform4iv(loc, value[0], value[1], value[2], value[3]),

    [GLConstants.BOOL]:         (gl, loc, value) => gl.uniform1iv(loc, value),
    [GLConstants.BOOL_VEC2]:    (gl, loc, value) => gl.uniform2iv(loc, value[0], value[1]),
    [GLConstants.BOOL_VEC3]:    (gl, loc, value) => gl.uniform3iv(loc, value[0], value[1], value[2]),
    [GLConstants.BOOL_VEC4]:    (gl, loc, value) => gl.uniform4iv(loc, value[0], value[1], value[2], value[3]),

    [GLConstants.FLOAT_MAT2]:   (gl, loc, value) => gl.uniformMatrix2fv(loc, false, value),
    [GLConstants.FLOAT_MAT3]:   (gl, loc, value) => gl.uniformMatrix3fv(loc, false, value),
    [GLConstants.FLOAT_MAT4]:   (gl, loc, value) => gl.uniformMatrix4fv(loc, false, value),

    [GLConstants.SAMPLER_2D]:   (gl, loc, value) => gl.uniform1iv(loc, value),
};

/**
 * Maps a uniform data type and size to an instance of the default value.
 *
 * @memberof gl.GLData
 * @param {object} uniformData - The data to use to determine the default value.
 * @return {*} The default value.
 */
export function getUniformDefault(uniformData)
{
    const size = uniformData.size;

    switch (uniformData.type)
    {
        case GLConstants.FLOAT:
            return 0;

        case GLConstants.FLOAT_VEC2:
            return new Float32Array(2 * size);

        case GLConstants.FLOAT_VEC3:
            return new Float32Array(3 * size);

        case GLConstants.FLOAT_VEC4:
            return new Float32Array(4 * size);

        case GLConstants.INT:
        case GLConstants.SAMPLER_2D:
        case GLConstants.SAMPLER_2D_ARRAY:
            return 0;

        case GLConstants.INT_VEC2:
            return new Int32Array(2 * size);

        case GLConstants.INT_VEC3:
            return new Int32Array(3 * size);

        case GLConstants.INT_VEC4:
            return new Int32Array(4 * size);

        case GLConstants.BOOL:
            return false;

        case GLConstants.BOOL_VEC2:
            return booleanArray(2 * size);

        case GLConstants.BOOL_VEC3:
            return booleanArray(3 * size);

        case GLConstants.BOOL_VEC4:
            return booleanArray(4 * size);

        case GLConstants.FLOAT_MAT2:
            return new Float32Array([1, 0,
                                     0, 1]);

        case GLConstants.FLOAT_MAT3:
            return new Float32Array([1, 0, 0,
                                     0, 1, 0,
                                     0, 0, 1]);

        case GLConstants.FLOAT_MAT4:
            return new Float32Array([1, 0, 0, 0,
                                     0, 1, 0, 0,
                                     0, 0, 1, 0,
                                     0, 0, 0, 1]);
    }

    // @ifdef DEBUG
    ASSERT(false, 'Unknown uniform type, unable to determine default value.');
    // @endif

    return 0;
}

function booleanArray(size)
{
    const array = new Array(size);

    for (let i = 0; i < array.length; ++i)
    {
        array[i] = false;
    }

    return array;
}
