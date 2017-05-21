import Signal from 'mini-signals';

export default function DestroyComponent(Base = Object)
{
    /**
     * @class DestroyComponent
     * @memberof components
     */
    return class extends Base
    {
        /**
         *
         */
        constructor()
        {
            // components should always call base ctor first.
            super(...arguments);

            /**
             * Dispatched just before the object is destroyed.
             *
             * @member {Signal}
             */
            this.onDestroy = new Signal();
        }

        /**
         * Dispatch the destroy signal.
         *
         */
        destroy()
        {
            this.onDestroy.dispatch(this);

            this.onDestroy.detachAll();
        }
    };
}
