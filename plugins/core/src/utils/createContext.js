/**
 * Helper class to create a webGL Context
 *
 * @class
 * @param canvas {HTMLCanvasElement} the canvas element that we will get the context from
 * @param options {Object} An options object that gets passed in to the canvas element containing the context attributes,
 *                         see https://developer.mozilla.org/en/docs/Web/API/HTMLCanvasElement/getContext for the options available
 * @return {WebGLRenderingContext} the WebGL context
 */
export default function createContext(canvas, options)
{
    const gl = canvas.getContext('webgl2', options)
        || canvas.getContext('experimental-webgl2', options)
        || canvas.getContext('webgl', options)
        || canvas.getContext('experimental-webgl', options)
        || canvas.getContext('moz-webgl', options)
        || canvas.getContext('fake-webgl', options);

    return gl;
}
