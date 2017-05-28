import { TYPES } from '../data';

/**
 * Holds the information for a single attribute structure required to render geometry.
 * This does not conatian the actul data, but instead has a buffer id that maps to a {geometry.Buffer}
 * This can include anything from positions, uvs, normals, colors etc.
 *
 * @class
 * @memberof geometry
 */
export default class Attribute
{
    /**
     * @param {string} buffer The id of the buffer that this attribute will look for
     * @param {number} size The size of the attribute. If you hava 2 floats per vertex (eg position x and y) this would be 2.
     * @param {boolean} [normalized] Should the data be normalized.
     * @param {number} [type] What type of numbe is the attribute. Check {PIXI.TYPES} to see the ones available
     * @param {number} [stride] How far apart (in floats) the start of each value is. (used for interleaving data)
     * @param {number} [start] How far into the array to start reading values (used for interleaving data)
     */
    constructor(buffer, size, normalized = false, type = TYPES.FLOAT, stride, start, instance)
    {
        this.buffer = buffer;
        this.size = size;
        this.normalized = normalized;
        this.type = type;
        this.stride = stride;
        this.start = start;
        this.instance = instance;
    }

    /**
     * Destroys the Attribute.
     */
    destroy()
    {
        this.buffer = null;
    }

    /**
     * Helper function that creates an Attribute based on the information provided
     *
     * @static
     * @param {string} buffer The id of the buffer that this attribute will look for
     * @param {number} size The size of the attribute. If you hava 2 floats per vertex (eg position x and y) this would be 2
     * @param {number} [stride] How far apart (in floats) the start of each value is. (used for interleaving data)
     * @param {number} [start] How far into the array to start reading values (used for interleaving data)
     * @param {boolean} [normalized] Should the data be normalized.
     *
     * @returns {geometry.Attribute} A new {geometry.Attribute} based on the information provided
     */
    static from(buffer, size, stride, start, normalized)
    {
        return new Attribute(buffer, size, stride, start, normalized);
    }
}
