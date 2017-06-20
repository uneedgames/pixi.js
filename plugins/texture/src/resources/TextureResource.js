import Signal from 'mini-signals';
import { UpdateComponent, DestroyComponent, UidComponent } from '@pixi/components';

/**
 * @class
 * @abstract
 * @memberof texture
 */
export default class TextureResource extends
    UpdateComponent(
    DestroyComponent(
    UidComponent(
    )))
{
    /**
     * @param {*} data The underlying data of this resource
     */
    constructor(data)
    {
        super();

        /**
         * The underlying data of this resource. It is read only and should not be assigned to, though
         * accessing the object stored on this property and modifying it is OK.
         *
         * @readonly
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

        /**
         * When true this resource is an ArrayBufferView.
         *
         * @member {boolean}
         */
        this.isDataResource = !data || (data.buffer && data.buffer instanceof ArrayBuffer);

        /**
         * Dispatched when the texture resource is ready for use.
         *
         * @member {Signal}
         */
        this.onReady = new Signal();

        /**
         * Dispatched when there is an error trying to prepare or load the texture resource.
         *
         * @member {Signal}
         */
        this.onError = new Signal();
    }

    /**
     * Is this texture valid (does it have a valid width/height)
     *
     * @member {boolean}
     */
    get ready()
    {
        return this.width !== -1 && this.height !== -1;
    }

    /**
     * Destroys this texture resource.
     *
     */
    destroy()
    {
        super.destroy();

        this.data = null;

        this.width = -1;
        this.height = -1;
    }
}
