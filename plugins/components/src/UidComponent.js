let nextUid = 0;

function _uid()
{
    return ++nextUid;
}

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
            this.uid = _uid();
        }

        /**
         * Generates a new unique identifier.
         *
         * @return {number} The next unique identifier to use.
         */
        static uid()
        {
            return _uid();
        }
    };
}

/**
 * Gets the next unique identifier
 *
 * @static
 * @memberof UniqueIdentifierComponent
 * @return {number} The next unique identifier to use.
 */
UniqueIdentifierComponent.uid = _uid;
