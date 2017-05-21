import Signal from 'mini-signals';

export default function UpdateComponent(Base = Object)
{
    /**
     * @class UpdateComponent
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
             * Dispatched when the object is updated.
             *
             * @member {Signal}
             */
            this.onUpdate = new Signal();

            /**
             * When this object is updated, this ID is incremented. This can be useful for delayed
             * updates. For example, you want to check if something is updated but only after another
             * event. You can store the last ID you saw, then when your event happens check if there
             * has since been a new update ID.
             *
             * @member {number}
             * @readonly
             */
            this.updateID = 0;
        }

        /**
         * Updates the updateID and dispatches a signal.
         *
         */
        update()
        {
            this.updateID++;
            this.onUpdate.dispatch(this);
        }
    };
}
