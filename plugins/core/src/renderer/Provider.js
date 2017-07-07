import { DestroyComponent } from '@pixi/components';

/**
 * @class
 */
export default class Provider extends DestroyComponent()
{
    /**
     * @param {Renderer} renderer The renderer this Provider works for.
     */
    constructor(renderer)
    {
        super();

        /**
         * The renderer this Provider works for.
         *
         * @readonly
         * @member {Renderer}
         */
        this.renderer = renderer;
    }

    /**
     * Generic destroy methods to be overridden by the subclass
     *
     */
    destroy()
    {
        super.destroy();

        this.renderer = null;
    }
}
