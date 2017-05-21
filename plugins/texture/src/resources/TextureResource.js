import { components /* @ifdef DEBUG */, debug /* @endif */ } from '@pixi/core';

/**
 * @class
 * @memberof texture
 */
export default class TextureResource extends
    components.UpdateComponent(
    components.DestroyComponent(
    components.UidComponent(
    )))
{
    /**
     * @param {*} data The underlying data of this resource
     */
    constructor(data)
    {
        super();

        // @ifdef DEBUG
        debug.ASSERT(!!data, `Data is required to create a TextureResource.`, data);
        // @endif

        /**
         * The underlying data of this resource
         *
         * @member {*}
         */
        this.data = data;

        /**
         * The width of this resource.
         *
         * @member {number}
         */
        this.width = -1;

        /**
         * The height of this resource.
         *
         * @member {number}
         */
        this.height = -1;

        this.uploadable = true;

        this.resourceUpdated = new Runner('resourceUpdated');

        // create a prommise..
        this.load = null;
    }

    /**
     * Is this texture valid (does it have a valid width/height)
     *
     * @member {boolean}
     */
    get valid() { return this.width !== -1 && this.height !== -1; }
}
