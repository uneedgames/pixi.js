// @ifdef DEBUG
/**
 * Note that the debug namespace is only exported in "debug" builds.
 * In production builds, this namespace is not included.
 *
 * @namespace debug
 */

/**
 * @memberof debug
 * @param {boolean} bool The condition to ensure is true.
 * @param {string} message The message to display if the first param is not true.
 */
export function ASSERT(bool, message)
{
    if (!bool) throw new Error(`[PIXI ASSERT] ${message}`);
}

/**
 * @memberof debug
 * @param {boolean} bool The condition to ensure is true.
 * @param {string} message The message to display if the first param is not true.
 */
export function VALIDATE(bool, message)
{
    if (!bool) console.warn(`[PIXI VALIDATE] ${message}`); // eslint-disable-line no-console
}
// @endif
