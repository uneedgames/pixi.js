import { VERSION } from '../data';

/**
 * General utility functions used in the pixi library.
 *
 * @namespace utils
 */

const DATA_URI = /^\s*data:(?:([\w-]+)\/([\w+.-]+))?(?:;(charset=[\w-]+|base64))?,(.*)/i;
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

/**
 * Typedef for decomposeDataUri return object.
 *
 * @memberof utils
 * @typedef {object} DecomposedDataUri
 * @property {mediaType} Media type, eg. `image`
 * @property {subType} Sub type, eg. `png`
 * @property {encoding} Data encoding, eg. `base64`
 * @property {data} The actual data
 */

/**
 * Split a data URI into components. Returns undefined if
 * parameter `dataUri` is not a valid data URI.
 *
 * @memberof utils
 * @param {string} dataUri The data URI to check
 * @return {utils.DecomposedDataUri} The decomposed data uri or null
 */
export function decomposeDataUri(dataUri)
{
    const dataUriMatch = DATA_URI.exec(dataUri);

    if (dataUriMatch)
    {
        return {
            mediaType: dataUriMatch[1] ? dataUriMatch[1].toLowerCase() : null,
            subType: dataUriMatch[2] ? dataUriMatch[2].toLowerCase() : null,
            encoding: dataUriMatch[3] ? dataUriMatch[3].toLowerCase() : null,
            data: dataUriMatch[4],
        };
    }

    return null;
}

/**
 * Logs out the version and renderer information for this running instance of PIXI.
 * If you don't want to see this message you can run `PIXI.utils.skipHello()` before
 * creating your renderer. Keep in mind that doing that will forever makes you a jerk face.
 *
 * @static
 * @memberof utils
 * @param {string} type The string renderer type to log.
 */
export function sayHello(type)
{
    if (!window.console)
    {
        return;
    }

    const userAgent = navigator.userAgent.toLowerCase();

    if (userAgent.indexOf('chrome') > -1 || userAgent.indexOf('firefox') > -1)
    {
        const args = [
            `\n %c %c %c Pixi.js ${VERSION} - ✰ ${type} ✰  %c  %c  http://www.pixijs.com/  %c %c ♥%c♥%c♥ \n\n`,
            'background: #ff66a5; padding:5px 0;',
            'background: #ff66a5; padding:5px 0;',
            'color: #ff66a5; background: #030307; padding:5px 0;',
            'background: #ff66a5; padding:5px 0;',
            'background: #ffc3dc; padding:5px 0;',
            'background: #ff66a5; padding:5px 0;',
            'color: #ff2424; background: #fff; padding:5px 0;',
            'color: #ff2424; background: #fff; padding:5px 0;',
            'color: #ff2424; background: #fff; padding:5px 0;',
        ];

        window.console.log.apply(console, args);
    }
    else
    {
        window.console.log(`Pixi.js ${VERSION} - ${type} - http://www.pixijs.com/`);
    }
}
