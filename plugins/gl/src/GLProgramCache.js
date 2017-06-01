import CacheMap from './CacheMap';

const GL_PROGRAM_CACHE = new CacheMap();

/**
 * @namespace GLProgramCache
 * @memberof gl
 */
export default {
    /**
     * Gets a program from the cache.
     *
     * @memberof gl.GLProgramCache
     * @param {WebGLRenderingContext} gl The context to clear the cache for.
     * @param {string} key - The key of the program to get.
     * @return {WebGLProgram} The cached program, or undefined if none found.
     */
    get(gl, key)
    {
        const programCache = GL_PROGRAM_CACHE.get(gl);

        return programCache ? programCache.get(key) : null;
    },

    /**
     * Sets a program in the cache.
     *
     * @memberof gl.GLProgramCache
     * @param {WebGLRenderingContext} gl The context to clear the cache for.
     * @param {string} key - The key of the program to get.
     * @param {WebGLProgram} program - The program to put into the cache.
     */
    set(gl, key, program)
    {
        let programCache = GL_PROGRAM_CACHE.get(gl);

        if (!programCache)
        {
            programCache = new CacheMap();

            GL_PROGRAM_CACHE.set(gl, programCache);
        }

        programCache.set(key, {
            program,
            atributeData: this.extractAttributeData(gl, program),
            uniformData: this.extractUniformData(gl, program),
        });
    },

    /**
     * Generates a cache key for a vertex/fragment source pair.
     *
     * @memberof gl.GLProgramCache
     * @param {string} vsrc - The vertex source of the program that will be stored.
     * @param {string} fsrc - The fragment source of the program that will be stored.
     * @return {string} The cache key.
     */
    key(vsrc, fsrc)
    {
        return vsrc + fsrc;
    },

    /**
     * Clears the GLProgramCache storage.
     *
     * @memberof gl.GLProgramCache
     * @param {WebGLRenderingContext} gl The context to clear the cache for.
     * @param {string} [key] The specific key to clear from the context's cache.
     *  If not specified clears all cached programs from the context.
     * @returns {boolean} True if successful
     */
    delete(gl, key)
    {
        if (key)
        {
            const programCache = GL_PROGRAM_CACHE.get(gl);

            if (!programCache) return false;

            return programCache.delete(key);
        }

        return GL_PROGRAM_CACHE.delete(gl);
    },
};
