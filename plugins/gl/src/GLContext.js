/**
 * @namespace GLContext
 * @memberof gl
 */
export default {
    defaultOptions: {
        alpha: true,
        antialias: false,
        premultipliedAlpha: true,
    },
    /**
     * Helper function to create a webGL Context.
     *
     * @memberof glutil.GLContext
     * @param {HTMLCanvasElement} canvas - The canvas element that we will get the context from.
     * @param {object} options - An options object that gets passed in to the canvas element containing
     *  the context attributes, see https://developer.mozilla.org/en/docs/Web/API/HTMLCanvasElement/getContext
     *  for the options available
     * @return {WebGLRenderingContext} the WebGL context
     */
    create(canvas, options)
    {
        options = Object.assign({}, this.defaultOptions, options);

        const gl = canvas.getContext('webgl2', options)
            || canvas.getContext('experimental-webgl2', options)
            || canvas.getContext('webgl', options)
            || canvas.getContext('experimental-webgl', options)
            || canvas.getContext('moz-webgl', options)
            || canvas.getContext('fake-webgl', options);

        if (!gl)
        {
            throw new Error('This browser does not support WebGL.');
        }

        return gl;
    },
};
