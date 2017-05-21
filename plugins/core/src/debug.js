// @ifdef DEBUG

/* eslint-disable no-console */

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
 * @param {*} data Extra data to log.
 */
export function ASSERT(bool, message, data)
{
    if (!bool)
    {
        if (arguments.length > 2)
        {
            console.error(`[PIXI ASSERT] ${message} - (${typeof data})`, data);
        }
        else
        {
            console.error(`[PIXI ASSERT] ${message}`);
        }
    }
}

/**
 * @memberof debug
 * @param {boolean} bool The condition to ensure is true.
 * @param {string} message The message to display if the first param is not true.
 * @param {*} data Extra data to log.
 */
export function VALIDATE(bool, message, data)
{
    if (!bool)
    {
        if (arguments.length > 2)
        {
            console.warn(`[PIXI VALIDATE] ${message} - (${typeof data})`, data);
        }
        else
        {
            console.warn(`[PIXI VALIDATE] ${message}`);
        }
    }
}
// @endif
