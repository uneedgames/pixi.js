import { GLConstants } from '@pixi/gl';

// @ifdef DEBUG
import { ASSERT } from '@pixi/debug';
// @endif

/**
 * @class
 * @memberof util
 */
export default class BlendMode
{
    /**
     * @param {number[]} pmaFuncParams The params for glBlendFuncSeparate, when the texture has
     *  premultiplied alpha.
     * @param {number[]} pmaEquationParams The params for glBlendEquationSeparate, when the texture has
     *  premultiplied alpha.
     * @param {number[]} npmaFuncParams The params for glBlendFuncSeparate, when the texture does not
     *  have premultiplied alpha.
     * @param {number[]} npmaEquationParams The params for glBlendEquationSeparate, when the texture does not
     *  have premultiplied alpha.
     */
    constructor(pmaFuncParams, pmaEquationParams, npmaFuncParams, npmaEquationParams)
    {
        // @ifdef DEBUG
        /* eslint-disable max-len */
        ASSERT(Array.isArray(pmaFuncParams) && typeof pmaFuncParams[0] === 'number' && (pmaFuncParams.length === 2 || pmaFuncParams.length === 4), 'Blend func params must be an array of length 2 or 4.');
        ASSERT(Array.isArray(pmaEquationParams) && typeof pmaEquationParams[0] === 'number' && (pmaEquationParams.length === 1 || pmaEquationParams.length === 2), 'Blend equation params must be an array of length 1 or 2.');
        ASSERT(!npmaFuncParams || (Array.isArray(npmaFuncParams) && typeof npmaFuncParams[0] === 'number' && (npmaFuncParams.length === 2 || npmaFuncParams.length === 4)), 'Blend func params must be an array of length 2 or 4.');
        ASSERT(!npmaEquationParams || (Array.isArray(npmaEquationParams) && typeof npmaEquationParams[0] === 'number' && (npmaEquationParams.length === 1 || npmaEquationParams.length === 2)), 'Blend equation params must be an array of length 1 or 2.');
        /* eslint-enable max-len */
        // @endif

        // If no NPMA params given, use PMA params.
        if (!npmaFuncParams) npmaFuncParams = pmaFuncParams.slice();
        if (!npmaEquationParams) npmaEquationParams = pmaEquationParams.slice();

        // Ensure our arrays are the proper length for the glBlend*Separate calls.
        if (pmaFuncParams.length === 2) pmaFuncParams.push.apply(pmaFuncParams, pmaFuncParams);
        if (pmaEquationParams.length === 1) pmaEquationParams.push.apply(pmaEquationParams, pmaEquationParams);
        if (npmaFuncParams.length === 2) npmaFuncParams.push.apply(npmaFuncParams, npmaFuncParams);
        if (npmaEquationParams.length === 1) npmaEquationParams.push.apply(npmaEquationParams, npmaEquationParams);

        // Store them for later use
        this.pmaFuncParams = pmaFuncParams;
        this.pmaEquationParams = pmaEquationParams;
        this.npmaFuncParams = npmaFuncParams;
        this.npmaEquationParams = npmaEquationParams;
    }

    /**
     * Enables the blend mode on a context.
     *
     * @param {WebGLRenderingContext} gl The rendering context to set on.
     * @param {boolean} pma Should this blend mode use the premultiplied alpha or npma version.
     */
    enable(gl, pma)
    {
        if (pma)
        {
            gl.blendFuncSeparate(
                this.pmaFuncParams[0], this.pmaFuncParams[1],
                this.pmaFuncParams[2], this.pmaFuncParams[3]
            );
            gl.blendEquationSeparate(this.pmaEquationParams[0], this.pmaEquationParams[1]);
        }
        else
        {
            gl.blendFuncSeparate(
                this.npmaFuncParams[0], this.npmaFuncParams[1],
                this.npmaFuncParams[2], this.npmaFuncParams[3]
            );
            gl.blendEquationSeparate(this.npmaEquationParams[0], this.npmaEquationParams[1]);
        }
    }

    /**
     * Checks for equality with another blend mode.
     *
     * @param {BlendMode} mode - The mode to check equality against.
     * @return {boolean} True if they are equal.
     */
    equals(mode)
    {
        return !!mode
            && this.pmaFuncParams[0] === mode.pmaFuncParams[0]
            && this.pmaFuncParams[1] === mode.pmaFuncParams[1]
            && this.pmaFuncParams[2] === mode.pmaFuncParams[2]
            && this.pmaFuncParams[3] === mode.pmaFuncParams[3]
            && this.pmaEquationParams[0] === mode.pmaEquationParams[0]
            && this.pmaEquationParams[1] === mode.pmaEquationParams[1]
            && this.npmaFuncParams[0] === mode.npmaFuncParams[0]
            && this.npmaFuncParams[1] === mode.npmaFuncParams[1]
            && this.npmaFuncParams[2] === mode.npmaFuncParams[2]
            && this.npmaFuncParams[3] === mode.npmaFuncParams[3]
            && this.npmaEquationParams[0] === mode.npmaEquationParams[0]
            && this.npmaEquationParams[1] === mode.npmaEquationParams[1];
    }
}

// short name, I'm lazy.
const c = GLConstants;

BlendMode.NORMAL = new BlendMode(
    // PMA
    [c.ONE, c.ONE_MINUS_SRC_ALPHA],
    [c.FUNC_ADD],
    // NPMA
    [c.SRC_ALPHA, c.ONE_MINUS_SRC_ALPHA, c.ONE, c.ONE_MINUS_SRC_ALPHA],
    [c.FUNC_ADD]
);

BlendMode.ADD = BlendMode.LINEAR_DODGE = new BlendMode(
    // PMA
    [c.ONE, c.DST_ALPHA],
    [c.FUNC_ADD],
    // NPMA
    [c.SRC_ALPHA, c.DST_ALPHA, c.ONE, c.DST_ALPHA],
    [c.FUNC_ADD]
);

BlendMode.SUBTRACT = new BlendMode(
    // PMA
    [c.DST_COLOR, c.ONE],
    [c.FUNC_REVERSE_SUBTRACT],
    // NPMA - TODO: Not sure about this, needs testing.
    [c.DST_COLOR, c.ONE],
    [c.FUNC_REVERSE_SUBTRACT]
);

BlendMode.MULTIPLY = new BlendMode(
    // PMA
    [c.DST_COLOR, c.ONE_MINUS_SRC_ALPHA],
    [c.FUNC_ADD],
    // NPMA - TODO: Not sure about this, needs testing.
    [c.DST_COLOR, c.ONE_MINUS_SRC_ALPHA],
    [c.FUNC_ADD]
);

BlendMode.SCREEN = new BlendMode(
    // PMA
    [c.ONE_MINUS_DST_COLOR, c.ONE],
    [c.FUNC_ADD],
    // NPMA
    [c.SRC_ALPHA, c.ONE_MINUS_SRC_COLOR, c.ONE, c.ONE_MINUS_SRC_COLOR],
    [c.FUNC_ADD]
);

BlendMode.EXCLUSION = new BlendMode(
    // PMA
    [c.ONE_MINUS_DST_COLOR, c.ONE_MINUS_SRC_COLOR],
    [c.FUNC_ADD],
    // NPMA - TODO: Not sure about this, needs testing.
    [c.SRC_ALPHA, c.ONE_MINUS_SRC_COLOR, c.ONE_MINUS_DST_COLOR, c.ONE_MINUS_SRC_COLOR],
    [c.FUNC_ADD]
);
