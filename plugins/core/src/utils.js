/**
 * General utility functions used in the pixi library.
 *
 * @namespace utils
 */
let nextUid = 0;

/**
 * Gets the next unique identifier
 *
 * @memberof utils
 * @return {number} The next unique identifier to use.
 */
export function uid()
{
    return ++nextUid;
}
