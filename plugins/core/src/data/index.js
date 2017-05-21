/** @namespace data */

/**
 * String of the current PIXI version.
 *
 * @static
 * @constant
 * @memberof data
 * @name VERSION
 * @type {string}
 */
export const VERSION = __VERSION__;

/**
 * Two Pi.
 *
 * @static
 * @constant
 * @memberof data
 * @type {number}
 */
export const PI_2 = Math.PI * 2;

/**
 * Conversion factor for converting radians to degrees.
 *
 * @static
 * @constant
 * @memberof data
 * @type {number}
 */
export const RAD_TO_DEG = 180 / Math.PI;

/**
 * Conversion factor for converting degrees to radians.
 *
 * @static
 * @constant
 * @memberof data
 * @type {number}
 */
export const DEG_TO_RAD = Math.PI / 180;

/**
 * Constant to identify the Renderer Type.
 *
 * @static
 * @constant
 * @memberof data
 * @name RENDERER_TYPE
 * @type {object}
 * @property {number} UNKNOWN - Unknown render type.
 * @property {number} WEBGL - WebGL render type.
 * @property {number} CANVAS - Canvas render type.
 */
export const RENDERER_TYPE = {
    UNKNOWN:    0,
    WEBGL:      1,
    CANVAS:     2,
};

/**
 * Various blend modes supported by PIXI.
 *
 * IMPORTANT - The WebGL renderer only supports the NORMAL, ADD, MULTIPLY and SCREEN blend modes.
 * Anything else will silently act like NORMAL.
 *
 * @static
 * @constant
 * @memberof data
 * @name BLEND_MODES
 * @type {object}
 * @property {number} NORMAL
 * @property {number} ADD
 * @property {number} MULTIPLY
 * @property {number} SCREEN
 * @property {number} OVERLAY
 * @property {number} DARKEN
 * @property {number} LIGHTEN
 * @property {number} COLOR_DODGE
 * @property {number} COLOR_BURN
 * @property {number} HARD_LIGHT
 * @property {number} SOFT_LIGHT
 * @property {number} DIFFERENCE
 * @property {number} EXCLUSION
 * @property {number} HUE
 * @property {number} SATURATION
 * @property {number} COLOR
 * @property {number} LUMINOSITY
 */
export const BLEND_MODES = {
    NORMAL:         0,
    ADD:            1,
    MULTIPLY:       2,
    SCREEN:         3,
    OVERLAY:        4,
    DARKEN:         5,
    LIGHTEN:        6,
    COLOR_DODGE:    7,
    COLOR_BURN:     8,
    HARD_LIGHT:     9,
    SOFT_LIGHT:     10,
    DIFFERENCE:     11,
    EXCLUSION:      12,
    HUE:            13,
    SATURATION:     14,
    COLOR:          15,
    LUMINOSITY:     16,
    NONE:           17,
};

/**
 * Various webgl draw modes. These can be used to specify which GL drawMode to use
 * under certain situations and renderers.
 *
 * @static
 * @constant
 * @memberof data
 * @name DRAW_MODES
 * @type {object}
 * @property {number} POINTS
 * @property {number} LINES
 * @property {number} LINE_LOOP
 * @property {number} LINE_STRIP
 * @property {number} TRIANGLES
 * @property {number} TRIANGLE_STRIP
 * @property {number} TRIANGLE_FAN
 */
export const DRAW_MODES = {
    POINTS:         0,
    LINES:          1,
    LINE_LOOP:      2,
    LINE_STRIP:     3,
    TRIANGLES:      4,
    TRIANGLE_STRIP: 5,
    TRIANGLE_FAN:   6,
};

/**
 * The scale modes that are supported by pixi.
 *
 * @static
 * @constant
 * @memberof data
 * @name SCALE_MODES
 * @type {object}
 * @property {number} LINEAR Smooth scaling, linear interpolation
 * @property {number} NEAREST Pixelating scaling, nearest-neighbor
 */
export const SCALE_MODES = {
    LINEAR:     1,
    NEAREST:    0,
};

/**
 * The wrap modes that are supported by pixi.
 *
 * The {@link PIXI.settings.WRAP_MODE} wrap mode affects the default wraping mode of future operations.
 * It can be re-assigned to either CLAMP or REPEAT, depending upon suitability.
 * If the texture is non power of two then clamp will be used regardless as webGL can
 * only use REPEAT if the texture is po2.
 *
 * This property only affects WebGL.
 *
 * @static
 * @constant
 * @name WRAP_MODES
 * @memberof data
 * @type {object}
 * @property {number} CLAMP The textures uvs are clamped
 * @property {number} REPEAT The texture uvs tile and repeat
 * @property {number} MIRRORED_REPEAT The texture uvs tile and repeat with mirroring
 */
export const WRAP_MODES = {
    CLAMP:           33071,
    REPEAT:          10497,
    MIRRORED_REPEAT: 33648,
};

/**
 * @static
 * @constant
 * @memberof data
 * @name FORMATS
 * @type {object}
 */
export const FORMATS = {
    // WebGL 1
    RGBA:             6408,
    RGB:              6407,
    ALPHA:            6406,
    LUMINANCE:        6409,
    LUMINANCE_ALPHA:  6410,

    // WEBGL_depth_texture
    DEPTH_COMPONENT:  6402,
    DEPTH_STENCIL:    34041,
};

/**
 * @static
 * @constant
 * @memberof data
 * @name TYPES
 * @type {object}
 */
export const TYPES = {
    // WebGL 1
    UNSIGNED_BYTE:                  5121,
    UNSIGNED_SHORT_5_6_5:           33635,
    UNSIGNED_SHORT_4_4_4_4:         32819,
    UNSIGNED_SHORT_5_5_5_1:         32820,

    // WEBGL_depth_texture (and WebGL 2)
    UNSIGNED_SHORT:                 5123,
    UNSIGNED_INT:                   5125,
    UNSIGNED_INT_24_8:              34042,

    // OES_texture_float (and WebGL 2)
    FLOAT:                          5126,

    // OES_texture_half_float
    HALF_FLOAT_OES:                 36193,

    // WebGL 2
    BYTE:                           5120,
    SHORT:                          5122,
    INT:                            5124,
    HALF_FLOAT:                     5131,
    UNSIGNED_INT_2_10_10_10_REV:    33640,
    UNSIGNED_INT_10F_11F_11F_REV:   35899,
    UNSIGNED_INT_5_9_9_9_REV:       35902,
    FLOAT_32_UNSIGNED_INT_24_8_REV: 36269,
};

/**
 * @static
 * @constant
 * @memberof data
 * @name TARGETS
 * @type {object}
 */
export const TARGETS = {
    TEXTURE_2D:                     3553,
    TEXTURE_CUBE_MAP:               34067,
    TEXTURE_2D_ARRAY:               35866,
    TEXTURE_CUBE_MAP_POSITIVE_X:    34069,
    TEXTURE_CUBE_MAP_NEGATIVE_X:    34070,
    TEXTURE_CUBE_MAP_POSITIVE_Y:    34071,
    TEXTURE_CUBE_MAP_NEGATIVE_Y:    34072,
    TEXTURE_CUBE_MAP_POSITIVE_Z:    34073,
    TEXTURE_CUBE_MAP_NEGATIVE_Z:    34074,
};

/**
 * The gc modes that are supported by pixi.
 *
 * The {@link PIXI.settings.GC_MODE} Garbage Collection mode for pixi textures is AUTO
 * If set to GC_MODE, the renderer will occasionally check textures usage. If they are not
 * used for a specified period of time they will be removed from the GPU. They will of course
 * be uploaded again when they are required. This is a silent behind the scenes process that
 * should ensure that the GPU does not  get filled up.
 *
 * Handy for mobile devices!
 * This property only affects WebGL.
 *
 * @static
 * @constant
 * @name GC_MODES
 * @memberof data
 * @type {object}
 * @property {number} AUTO Garbage collection will happen periodically automatically
 * @property {number} MANUAL Garbage collection will need to be called manually
 */
export const GC_MODES = {
    AUTO:           0,
    MANUAL:         1,
};

/**
 * Regexp for image type by extension.
 *
 * @static
 * @constant
 * @memberof data
 * @type {RegExp|string}
 * @example `image.png`
 */
export const URL_FILE_EXTENSION = /\.(\w{3,4})(?:$|\?|#)/i;

/**
 * Regexp for data URI.
 * Based on: {@link https://github.com/ragingwind/data-uri-regex}
 *
 * @static
 * @constant
 * @name DATA_URI
 * @memberof data
 * @type {RegExp|string}
 * @example data:image/png;base64
 */
export const DATA_URI = /^\s*data:(?:([\w-]+)\/([\w+.-]+))?(?:;(charset=[\w-]+|base64))?,(.*)/i;

/**
 * Regexp for SVG size.
 *
 * @static
 * @constant
 * @name SVG_SIZE
 * @memberof data
 * @type {RegExp|string}
 * @example &lt;svg width="100" height="100"&gt;&lt;/svg&gt;
 */
export const SVG_SIZE = /<svg[^>]*(?:\s(width|height)=('|")(\d*(?:\.\d+)?)(?:px)?('|"))[^>]*(?:\s(width|height)=('|")(\d*(?:\.\d+)?)(?:px)?('|"))[^>]*>/i; // eslint-disable-line max-len

/**
 * Constants that identify shapes, mainly to prevent `instanceof` calls.
 *
 * @static
 * @constant
 * @name SHAPES
 * @memberof data
 * @type {object}
 * @property {number} POLY Polygon
 * @property {number} RECT Rectangle
 * @property {number} CIRC Circle
 * @property {number} ELIP Ellipse
 * @property {number} RREC Rounded Rectangle
 */
export const SHAPES = {
    POLY: 0,
    RECT: 1,
    CIRC: 2,
    ELIP: 3,
    RREC: 4,
};

/**
 * Constants that specify float precision in shaders.
 *
 * @static
 * @constant
 * @name PRECISION
 * @memberof data
 * @type {object}
 * @property {string} LOW='lowp'
 * @property {string} MEDIUM='mediump'
 * @property {string} HIGH='highp'
 */
export const PRECISION = {
    LOW: 'lowp',
    MEDIUM: 'mediump',
    HIGH: 'highp',
};

/**
 * Constants that specify the transform type.
 *
 * @static
 * @constant
 * @name TRANSFORM_MODE
 * @memberof data
 * @type {object}
 * @property {number} STATIC
 * @property {number} DYNAMIC
 */
export const TRANSFORM_MODE = {
    STATIC:     0,
    DYNAMIC:    1,
};

/**
 * Constants that define the type of gradient on text.
 *
 * @static
 * @constant
 * @name TEXT_GRADIENT
 * @memberof data
 * @type {object}
 * @property {number} LINEAR_VERTICAL Vertical gradient
 * @property {number} LINEAR_HORIZONTAL Linear gradient
 */
export const TEXT_GRADIENT = {
    LINEAR_VERTICAL: 0,
    LINEAR_HORIZONTAL: 1,
};

/**
 * Represents the update priorities used by internal PIXI classes when registered with
 * the {@link PIXI.ticker.Ticker} object. Higher priority items are updated first and lower
 * priority items, such as render, should go later.
 *
 * @static
 * @constant
 * @name UPDATE_PRIORITY
 * @memberof data
 * @type {object}
 * @property {number} INTERACTION=50 Highest priority, used for {@link PIXI.interaction.InteractionManager}
 * @property {number} HIGH=25 High priority updating, {@link PIXI.VideoBaseTexture} and {@link PIXI.extras.AnimatedSprite}
 * @property {number} NORMAL=0 Default priority for ticker events, see {@link PIXI.ticker.Ticker#add}.
 * @property {number} LOW=-25 Low priority used for {@link PIXI.Application} rendering.
 * @property {number} UTILITY=-50 Lowest priority used for {@link PIXI.prepare.BasePrepare} utility.
 */
export const UPDATE_PRIORITY = {
    INTERACTION: 50,
    HIGH: 25,
    NORMAL: 0,
    LOW: -25,
    UTILITY: -50,
};

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
    WEBGL: false,
    WEBGL2: false,
    STENCIL: false,
    WEBGL_EXTENSIONS: {
        /* eslint-disable camelcase */
        WEBGL_lose_context: false,
        WEBGL_depth_texture: false,
        OES_texture_float: false,
        OES_texture_half_float: false,
        /* eslint-enable camelcase */
    },
    WEBGL2_EXTENSIONS: {
        /* eslint-disable camelcase */
        WEBGL_lose_context: false,
        /* eslint-enable camelcase */
    },
};

(function _deviceDetection()
{
    try
    {
        const canvas = document.createElement('canvas');
        const options = { stencil: false, failIfMajorPerformanceCaveat: false };
        const gl = canvas.getContext('webgl2', options)
            || canvas.getContext('experimental-webgl2', options)
            || canvas.getContext('webgl', options)
            || canvas.getContext('experimental-webgl', options)
            || canvas.getContext('moz-webgl', options)
            || canvas.getContext('fake-webgl', options);

        DEVICE_SUPPORT.WEBGL = !!gl;
        DEVICE_SUPPORT.WEBGL2 = DEVICE_SUPPORT.WEBGL && !!gl.copyBufferSubData;

        if (!DEVICE_SUPPORT.WEBGL) return;

        if (!DEVICE_SUPPORT.WEBGL2)
        {
            // If we only have WebGL1 support, use the OES_texture_half_float value for HALF_FLOAT
            TYPES.HALF_FLOAT = TYPES.HALF_FLOAT_OES;

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
    }
    catch (e)
    {
        /* eslint-disable no-console */
        console.warn('PIXI device detection failed, expect strange things to happen.');
        /* eslint-enable no-console */
    }
})();
