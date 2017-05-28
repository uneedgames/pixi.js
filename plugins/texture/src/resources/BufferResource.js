import TextureResource from './TextureResource';

/**
 * @class
 * @memberof texture
 */
export default class BufferResource extends TextureResource
{
    /**
     * @param {ArrayBufferView} data The drawing source.
     */
    constructor(data)
    {
        super(data);

        this.onReady.dispatch(this);
    }
}
