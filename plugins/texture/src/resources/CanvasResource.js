import TextureResource from './TextureResource';

/**
 * @class
 * @memberof texture
 */
export default class CanvasResource extends TextureResource
{
    /**
     * @param {HTMLCanvasElement} data The drawing source.
     */
    constructor(data)
    {
        super(data);

        this.width = data.width;
        this.height = data.height;

        this.onReady.dispatch(this);
    }
}
