import { uid } from '../utils';

export default function UniqueIdentifierComponent(Base = Object)
{
    /**
     * @class UniqueIdentifierComponent
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
             * The unique identifier of this object.
             *
             * @readonly
             * @member {number}
             */
            this.uid = uid();
        }
    };
}
