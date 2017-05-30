/** @namespace data */

import createContext from '../utils/createContext';

/**
 * Some device detection information.
 *
 * @static
 * @constant
 * @name DEVICE_SUPPORT
 * @memberof data
 * @type {object}
 */
export const DEVICE_SUPPORT = {
    BROWSER:                            window.navigator.userAgent,
    PLATFORM:                           window.navigator.platform,
    WEBGL:                              false,
    WEBGL2:                             false,
    STENCIL:                            false,
    WEBGL_EXTENSIONS: {
        /* eslint-disable camelcase */
        EXT_blend_minmax:               false,
        WEBGL_color_buffer_float:       false,
        EXT_color_buffer_half_float:    false,
        WEBGL_compressed_texture_astc:  false,
        WEBGL_compressed_texture_atc:   false,
        WEBGL_compressed_texture_etc:   false,
        WEBGL_compressed_texture_etc1:  false,
        WEBGL_compressed_texture_pvrtc: false,
        WEBGL_compressed_texture_s3tc:  false,
        WEBGL_debug_renderer_info:      false,
        WEBGL_depth_texture:            false,
        EXT_disjoint_timer_query:       false,
        WEBGL_draw_buffers:             false,
        OES_element_index_uint:         false,
        EXT_frag_depth:                 false,
        ANGLE_instanced_arrays:         false,
        WEBGL_lose_context:             false,
        EXT_sRGB:                       false,
        EXT_shader_texture_lod:         false,
        OES_standard_derivatives:       false,
        EXT_texture_filter_anisotropic: false,
        OES_texture_float:              false,
        OES_texture_float_linear:       false,
        OES_texture_half_float:         false,
        OES_texture_half_float_linear:  false,
        OES_vertex_array_object:        false,
        /* eslint-enable camelcase */
    },
    WEBGL2_EXTENSIONS: {
        /* eslint-disable camelcase */
        EXT_color_buffer_float:         false,
        WEBGL_compressed_texture_astc:  false,
        WEBGL_compressed_texture_atc:   false,
        WEBGL_compressed_texture_etc:   false,
        WEBGL_compressed_texture_etc1:  false,
        WEBGL_compressed_texture_pvrtc: false,
        WEBGL_compressed_texture_s3tc:  false,
        WEBGL_debug_renderer_info:      false,
        EXT_disjoint_timer_query:       false,
        EXT_disjoint_timer_query_webgl2: false,
        WEBGL_lose_context:             false,
        EXT_texture_filter_anisotropic: false,
        OES_texture_float_linear:       false,
        /* eslint-enable camelcase */
    },
    IMAGE_BITMAP: !!window.createImageBitmap && typeof ImageBitmap !== 'undefined',
};

(function _deviceDetection()
{
    try
    {
        const canvas = document.createElement('canvas');
        const options = { stencil: false, failIfMajorPerformanceCaveat: false };
        const gl = createContext(canvas, options);

        DEVICE_SUPPORT.WEBGL = !!gl;
        DEVICE_SUPPORT.WEBGL2 = DEVICE_SUPPORT.WEBGL && !!gl.copyBufferSubData;

        if (!DEVICE_SUPPORT.WEBGL) return;

        if (!DEVICE_SUPPORT.WEBGL2)
        {
            // If we only have WebGL1 support, use the OES_texture_half_float value for HALF_FLOAT
            PIXEL_TYPES.HALF_FLOAT = PIXEL_TYPES.HALF_FLOAT_OES;

            for (const k in DEVICE_SUPPORT.WEBGL_EXTENSIONS)
            {
                DEVICE_SUPPORT.WEBGL_EXTENSIONS[k] = !!gl.getExtension(k);
            }
        }
        else
        {
            for (const k in DEVICE_SUPPORT.WEBGL2_EXTENSIONS)
            {
                DEVICE_SUPPORT.WEBGL2_EXTENSIONS[k] = !!gl.getExtension(k);
            }
        }

        // report analytics
        // new Image().src = `https://analytics.pixijs.com/t?o=${encodeURIComponent(JSON.stringify(DEVICE_SUPPORT))}`;
    }
    catch (e)
    {
        /* eslint-disable no-console */
        console.warn('PIXI device detection failed, expect strange things to happen.');
        /* eslint-enable no-console */
    }
})();
