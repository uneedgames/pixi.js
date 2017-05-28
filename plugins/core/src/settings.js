import maxRecommendedTextures from './utils/maxRecommendedTextures';
import canUploadSameBuffer from './utils/canUploadSameBuffer';

/**
 * Global user settings used accross the library by multiple systems.
 *
 * @example
 * // Use the native window resolution as the default resolution
 * // will support high-density displays when rendering
 * PIXI.settings.RESOLUTION = window.devicePixelRatio.
 *
 * // Disable interpolation when scaling, will make texture be pixelated
 * PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
 * @namespace PIXI.settings
 */
export default {
    /**
     * Target frames per millisecond.
     *
     * @static
     * @memberof PIXI.settings
     * @type {number}
     * @default 0.06
     */
    TARGET_FPMS: 0.06,

    /**
     * Default filter resolution.
     *
     * @static
     * @memberof PIXI.settings
     * @type {number}
     * @default 1
     */
    FILTER_RESOLUTION: 1,

    /**
     * The maximum textures that this device supports.
     *
     * @static
     * @memberof PIXI.settings
     * @type {number}
     * @default 32
     */
    SPRITE_MAX_TEXTURES: maxRecommendedTextures(32),

    // TODO: maybe change to SPRITE.BATCH_SIZE: 2000
    // TODO: maybe add PARTICLE.BATCH_SIZE: 15000

    /**
     * The default sprite batch size.
     *
     * The default aims to balance desktop and mobile devices.
     *
     * @static
     * @memberof PIXI.settings
     * @type {number}
     * @default 4096
     */
    SPRITE_BATCH_SIZE: 4096,

    /**
     * The prefix that denotes a URL is for a retina asset.
     *
     * @static
     * @memberof PIXI.settings
     * @type {RegExp}
     * @example `@2x`
     * @default /@([0-9\.]+)x/
     */
    RETINA_PREFIX: /@([0-9\.]+)x/,


    /**
     * Default transform type.
     *
     * @static
     * @memberof PIXI.settings
     * @type {PIXI.TRANSFORM_MODE}
     * @default PIXI.TRANSFORM_MODE.STATIC
     */
    TRANSFORM_MODE: 0,

    /**
     * Default Garbage Collection mode.
     *
     * @static
     * @memberof PIXI.settings
     * @type {PIXI.GC_MODES}
     * @default PIXI.GC_MODES.AUTO
     */
    GC_MODE: 0,

    /**
     * Default Garbage Collection max idle.
     *
     * @static
     * @memberof PIXI.settings
     * @type {number}
     * @default 3600
     */
    GC_MAX_IDLE: 60 * 60,

    /**
     * Default Garbage Collection maximum check count.
     *
     * @static
     * @memberof PIXI.settings
     * @type {number}
     * @default 600
     */
    GC_MAX_CHECK_COUNT: 60 * 10,

    /**
     * Default wrap modes that are supported by pixi.
     *
     * @static
     * @memberof PIXI.settings
     * @type {PIXI.WRAP_MODES}
     * @default PIXI.WRAP_MODES.CLAMP
     */
    WRAP_MODE: 33071,

    /**
     * The scale modes that are supported by pixi.
     *
     * @static
     * @memberof PIXI.settings
     * @type {PIXI.SCALE_MODES}
     * @default PIXI.SCALE_MODES.LINEAR
     */
    SCALE_MODE: 1,

    /**
     * Default specify float precision in vertex shader.
     *
     * @static
     * @memberof PIXI.settings
     * @type {PIXI.PRECISION}
     * @default PIXI.PRECISION.HIGH
     */
    PRECISION_VERTEX: 'highp',

    /**
     * Default specify float precision in fragment shader.
     *
     * @static
     * @memberof PIXI.settings
     * @type {PIXI.PRECISION}
     * @default PIXI.PRECISION.MEDIUM
     */
    PRECISION_FRAGMENT: 'mediump',

    /**
     * Can we upload the same buffer in a single frame?
     *
     * @static
     * @constant
     * @memberof PIXI
     * @type {boolean}
     */
    CAN_UPLOAD_SAME_BUFFER: canUploadSameBuffer(),
};
