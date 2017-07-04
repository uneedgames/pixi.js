import Renderer from '../Renderer';
import Provider from '../Provider';

// @ifdef DEBUG
import { ASSERT } from '@pixi/debug';
// @endif

/**
 * The Program Provider handles creating, caching, and binding GLPrograms.
 *
 * @class
 * @extends Provider
 */
export default class ProgramProvider extends Provider
{
    /**
     * @param {Renderer} renderer - A reference to the current renderer
     */
    constructor(renderer)
    {
        super(renderer);

        /**
         * The private program cache, keyed by the UID of a Program.
         *
         * @private
         * @member {Object<number,GLProgram>}
         */
        this._programCache = {};

        /**
         * The GLProgram that is currently bound to the renderer context.
         *
         * @private
         * @member {GLProgram}
         */
        this._boundProgram = null;
    }

    /**
     * Changes the current shader to the one given in parameter
     *
     * @param {Program} program The new program to bind.
     * @returns {GLProgram} The GLProgram that was bound.
     */
    bind(program)
    {
        if (this._boundProgram === program)
        {
            return this._boundProgram;
        }

        if (!program)
        {
            this.renderer.context.gl.useProgram(null);

            return null;
        }

        return this.getGLProgram(program).bind();
    }

    /**
     * Gets a GLProgram from the cache, or creates a new one if there is no
     * cached GLProgram.
     *
     * @param {Program} program The new program to bind.
     * @returns {GLProgram} The GLProgram that was retrieved or created.
     */
    getGLProgram(program)
    {
        return this._programCache[program.uid]
            || (this._programCache[program.uid] = program.createGLProgram(this.renderer.context.gl));
    }

    /**
     * Destroys this System and removes all its textures
     */
    destroy()
    {
        super.destroy();

        for (const k in this._programCache)
        {
            this._programCache[k].destroy();
        }

        this._programCache = null;
    }
}

Renderer.addDefaultProvider(ProgramProvider, 'program');
