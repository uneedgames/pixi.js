import DestroyComponent from '../components/DestroyComponent';

/**
 * @class
 */
export default class Manager extends DestroyComponent()
{
    /**
     * @param {Renderer} renderer The renderer this Manager works for.
     */
    constructor(renderer)
    {
        super();

        /**
         * The renderer this manager works for.
         *
         * @readonly
         * @member {Renderer}
         */
        this.renderer = renderer;

        /**
         * The binding for the context change signal.
         *
         * @private
         * @member {SignalBinding}
         */
        this._onContextChangeBinding = this.renderer.onContextChange.add(this._onContextChange, this);
    }

    /**
     * Generic method called when there is a WebGL context change.
     *
     * @protected
     */
    _onContextChange()
    {
        // do some codes init!
    }

    /**
     * Generic destroy methods to be overridden by the subclass
     *
     */
    destroy()
    {
        super.destroy();

        this._onContextChangeBinding.detach();
        this._onContextChangeBinding = null;
    }
}
