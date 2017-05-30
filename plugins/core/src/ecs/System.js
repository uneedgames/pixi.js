import ECS from '@fae/ecs';

/**
 * @class
 * @memberof ecs
 */
export default class System extends ECS.System {
    /**
     *
     * @param {Renderer} renderer - The renderer this sytem belongs to.
     * @param {number} priority - The priority of the system, higher means earlier.
     * @param {number} frequency - How often to run the update loop. `1` means every
     *  time, `2` is every other time, etc.
     */
    constructor(renderer, priority = System.PRIORITY.USER, frequency = 1)
    {
        super(frequency);

        /**
         * The renderer to use.
         *
         * @member {Renderer}
         */
        this.renderer = renderer;

        /**
         * The priority of the system. A lower number makes it run earlier.
         *
         * See {@link System.PRIORITY} for some common ranges. The default is {@link System.PRIORITY.USER}.
         *
         * If you change this value at all after adding the system to the renderer you will
         * need to call {@link Renderer#sortSystems} for the change to affect the sort.
         *
         * @member {number}
         */
        this.priority = priority;
    }

    /**
     * Destroys the system.
     *
     */
    destroy()
    {
        this.renderer = null;
    }
}

/**
 * Some common priority ranges. Lower priority numbers run first.
 * You can use any number you want for priority of your systems, these just serve as a guideline for
 * what the core and official plugins will try to follow.
 *
 * If you use these values directly it will run in the order:
 *
 * 1. USER
 * 2. PLUGIN
 * 3. PRERENDER
 * 4. RENDER
 * 5. POSTRENDER
 *
 * @static
 * @constant
 * @property {number} USER The user-land or application priority, runs first.
 * @property {number} PLUGIN The plugin priority, runs after user priority but before render steps.
 * @property {number} PRERENDER Runs just before rendering.
 * @property {number} RENDER The render priority is used as the core rendering loop.
 * @property {number} POSTRENDER The postrender priority runs after rendering.
 */
System.PRIORITY = {
    USER:       1000,
    PLUGIN:     2000,
    PRERENDER:  3000,
    RENDER:     4000,
    POSTRENDER: 5000,
};
