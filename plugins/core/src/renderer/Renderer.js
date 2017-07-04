import ECS from '@fae/ecs';
import Signal from 'mini-signals';
import removeItems from 'remove-array-items';
import { DestroyComponent, UidComponent } from '@pixi/components';
import { sayHello } from '../utils';
import { Matrix } from '../math';



import MaskSystem from './systems/MaskSystem';
import StencilSystem from './systems/StencilSystem';
import FilterSystem from './systems/FilterSystem';
import FramebufferSystem from './systems/FramebufferSystem';
import RenderTextureSystem from './systems/RenderTextureSystem';
import TextureSystem from './systems/textures/TextureSystem';
import ProjectionSystem from './systems/ProjectionSystem';
import StateSystem from './systems/StateSystem';
import GeometrySystem from './systems/geometry/GeometrySystem';
import ShaderSystem from './systems/shader/ShaderSystem';
import BatchSystem from './systems/BatchSystem';
import TextureGCSystem from './systems/textures/TextureGCSystem';
import VertexArrayObject from './systems/geometry/VertexArrayObject';
import { RENDERER_TYPE } from '../../const';
import UniformGroup from '../../shader/UniformGroup';
import { Rectangle, Matrix } from '../../math';

const tempMatrix = new Matrix();

/**
 * The WebGLRenderer draws the scene and all its content onto a webGL enabled canvas. This renderer
 * should be used for browsers that support webGL. This Render works by automatically managing webGLBatchs.
 * So no need for Sprite Batches or Sprite Clouds.
 * Don't forget to add the view to your DOM or you will not see anything :)
 *
 * @class
 */
export default class Renderer extends DestroyComponent(UidComponent(ECS))
{
    /**
     * @param {RendererOptions} [options] The optional renderer parameters
     */
    constructor(options)
    {
        super();

        // Add the default render options
        options = Object.assign({}, Renderer.defaultOptions, options);
        options.canvas = options.canvas || document.createElement('canvas');

        if (options.sayHello)
        {
            // unless the user says otherwise, only say it once.
            Renderer.defaultOptions.sayHello = false;

            sayHello('WebGL');
        }

        /**
         * The supplied constructor options.
         *
         * The `width`, `height`, `view`, and `backgroundColor` properties should be read from the
         * renderer object's properties of the same names. The values of those properties here may
         * not actually be what is being used.
         *
         * @readonly
         * @member {BaseRendererOptions}
         */
        this.options = options;

        /**
         * This temporary display object used as the parent of the currently being rendered item
         *
         * TODO (cengler): Try to remove the need for this...
         *
         * @private
         * @member {PIXI.DisplayObject}
         */
        this._tempDisplayObjectParent = new Container();

        // signals, TODO: Docs
        this.onContextChange = new Signal();
        this.onReset = new Signal();
        this.onBeforeRender = new Signal();
        this.onAfterRender = new Signal();

        // Replace with managers
        this.addSystem(MaskSystem, 'mask')
            // .addSystem(ContextSystem, 'context')
            .addSystem(StateSystem, 'state')
            .addSystem(ShaderSystem, 'shader')
            .addSystem(TextureSystem, 'texture')
            .addSystem(GeometrySystem, 'geometry')
            .addSystem(FramebufferSystem, 'framebuffer')
            .addSystem(StencilSystem, 'stencil')
            .addSystem(ProjectionSystem, 'projection')
            .addSystem(TextureGCSystem)
            .addSystem(FilterSystem, 'filter')
            .addSystem(RenderTextureSystem, 'renderTexture')
            .addSystem(BatchSystem,'batch')

        // Bindings for our private events
        this._onContextChangeBinding = this.onContextChange.add(this._initContext, this);

        // create and add the default providers
        for (const k in Renderer._defaultProviders)
        {
            this[k] = new (Renderer._defaultProviders[k])(this);
        }

        // create and add the default systems
        for (let i = 0; i < Renderer._defaultSystems.length; ++i)
        {
            const system = new Renderer._defaultSystems[i](this);

            this.addSystem(system);
        }

        // initialize the context
        this._initContext();
    }

    /**
     * Adds a provider that will be created automatically when a renderer instance is created.
     *
     * Note: Calling this function registers a provider to be automatically added in renderers
     * that you create *after* calling this. If you call this after creating a renderer, the
     * already created renderer will *not* create this provider automatically.
     *
     * @param {Provider} Provider The provider class to add (**not** an instance, but the class itself)
     * @param {string} [name] The name of the provider to use as the property name on the Renderer. If not
     *  specified, falls back to Provider._name, and then falls back to Provider.name.
     */
    static addDefaultProvider(Provider, name)
    {
        name = name || Provider._name || Provider.name;

        // @ifdef DEBUG
        if (Renderer._defaultProviders[name])
        {
            console.warn(`Overwriting existing provider using name: ${name}.`); // eslint-disable-line no-console
        }
        // @endif

        Renderer._defaultProviders[name] = Provider;
    }

    /**
     * Removes a provider so that it will no longer be created automatically when a renderer
     * instance is created.
     *
     * Note: Calling this function unregisters a provider from being automatically added in renderers
     * that you create *after* calling this. If you call this after creating a renderer, the
     * already created renderer may contain this provider already.
     *
     * @param {string} name The name of the provider class to remove
     */
    static removeDefaultProvider(name)
    {
        delete Renderer._defaultProviders[name];
    }

    /**
     * Adds a system that will be created automatically when a renderer instance is created.
     *
     * Note: Calling this function registers a system to be automatically added in renderers
     * that you create *after* calling this. If you call this after creating a renderer, the
     * already created renderer will *not* contain this system automatically.
     *
     * @param {System} System - The system class to add (**not** an instance, but the class
     * itself)
     */
    static addDefaultSystem(System)
    {
        defaultSystems.push(System);
    }

    /**
     * Removes a system so that it will no longer be created automatically when a renderer
     * instance is created.
     *
     * Note: Calling this function unregisters a system to be automatically added in renderers
     * that you create *after* calling this. If you call this after creating a renderer, the
     * already created renderer may contain this system automatically.
     *
     * @param {System} System - The system class to add (**not** an instance, but the class
     * itself)
     */
    static removeDefaultSystem(System)
    {
        const idx = defaultSystems.indexOf(System);

        if (idx !== -1)
        {
            removeItems(defaultSystems, idx, 1);
        }
    }

    /**
     * Add a system to the renderer.
     *
     * @param {System} system - The system to add.
     * @param {boolean} skipSort - If true, will not sort the systems automatically.
     *  Setting this to true requires you call {@link Renderer#sortSystems} manually. This
     *  can be useful if you are adding a large batch of systems in a single frame and want
     *  to delay the sorting until after they are all added.
     */
    addSystem(system, skipSort = false)
    {
        super.addSystem(system);

        if (!skipSort) this.sortSystems();
    }

    /**
     * Sorts the systems each entity has assigned to it by priority. If you change a system's priority
     * after adding it to the renderer then you will need to call this for it to be properly sorted.
     *
     * Warning: This call can be expensive with large numbers of entities and/or systems.
     * Try not to call it very often. This method is `O(mn log n)`, where `n` is the
     * number of entities and `m` is the number of systems in the ECS world.
     *
     * @return {Renderer} Returns itself.
     */
    sortSystems()
    {
        for (let i = 0; i < this.entities.length; ++i)
        {
            const entity = this.entities[i];

            entity.systems.sort(compareSystemsPriority);
        }

        return this;
    }

    /**
     * Sorts the entities by render priority and their group hint. If you change an
     * entity's priority after adding it to the renderer then you will need to call
     * this for it to take effect.
     *
     * Warning: This call can be expensive with large numbers of entities.
     * Try not to call it very often. This method is `O(n log n)`, where `n` is the
     * number of entities.
     *
     * @return {Renderer} Returns itself.
     */
    sortEntities()
    {
        this.entities.sort(compareRenderPriority);

        return this;
    }

    /**
     * Renders the entities to the render target.
     *
     * @param {GLFramebuffer} framebuffer The framebuffer to render to, `null` means to render to screen.
     * @param {boolean} clear Should we clear the screen before rendering?
     * @return {Renderer} Returns itself.
     */
    render(framebuffer, clear = this.clearBeforeRender)
    {
        // no point rendering if our context has been blown up!
        if (this.context.isLost)
        {
            return;
        }

        // tell everyone we are about to render
        this.onBeforeRender.dispatch(framebuffer, clear);

        // iterate all the entities and have each of their systems process them
        this.update();

        // tell everyone we finished
        this.onAfterRender.dispatch(framebuffer);

        return this;
    }

    /**
     * Resets the WebGL state so you can render things however you fancy!
     *
     * @return {Renderer} Returns itself.
     */
    reset()
    {
        this.onReset.dispatch(this);

        return this;
    }

    /**
     * Useful function that returns a texture of the display object that can then be used to create sprites
     * This can be quite useful if your displayObject is complicated and needs to be reused multiple times.
     *
     * @param {PIXI.DisplayObject} displayObject - The displayObject the object will be generated from
     * @param {number} scaleMode - Should be one of the scaleMode consts
     * @param {number} resolution - The resolution / device pixel ratio of the texture being generated
     * @return {PIXI.Texture} a texture of the graphics object
     */
    generateTexture(displayObject, scaleMode, resolution)
    {
        const bounds = displayObject.getLocalBounds();

        const renderTexture = RenderTexture.create(bounds.width | 0, bounds.height | 0, scaleMode, resolution);

        tempMatrix.tx = -bounds.x;
        tempMatrix.ty = -bounds.y;

        this.render(displayObject, renderTexture, false, tempMatrix, true);

        return renderTexture;
    }

    /**
     * Removes everything from the renderer (event listeners, spritebatch, etc...)
     *
     * @param {boolean} [removeView=false] - Removes the Canvas element from the DOM.
     *  See: https://github.com/pixijs/pixi.js/issues/2233
     */
    destroy(removeView)
    {
        // call base destroy
        super.destroy();

        this._onContextChangeBinding.detach();
        this._onContextChangeBinding = null;

        // TODO nullify all the
        this.gl = null;
        this.options = null;
        this.blendModes = null;

        this._tempDisplayObjectParent = null;
    }

    /**
     * Creates the WebGL context
     *
     * @private
     */
    _initContext()
    {
        const gl = this.context.gl;
        const maxTextures = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS);

        this.boundTextures = new Array(maxTextures);
        this.emptyTextures = new Array(maxTextures);

        const tempObj = { _glTextures: {} };

        for (let i = 0; i < maxTextures; i++)
        {
            this.boundTextures[i] = tempObj;
        }
    }
}

/**
 * The interface for options used by the BaseRenderer
 *
 * @memberof Renderer
 * @typedef {object} RendererOptions
 * @property {number} [width] The width of the screen
 * @property {number} [height] The height of the screen
 * @property {HTMLCanvasElement} [canvas] The canvas to use as a view, optional
 * @property {boolean} [alpha] If the render view is transparent, default false. When set to true
 *  the browser will composit the canvas with dom elements behind.
 * @property {boolean} [setCanvasStyleOnResize] If set the style of the canvas is adjusted to have a size that matches the viewport.
 * @property {boolean} [antialias] sets antialias. If not available natively then FXAA
 *  antialiasing is used
 * @property {boolean} [forceFXAA] Forces FXAA antialiasing to be used over native.
 *  FXAA is faster, but may not always look as great
 * @property {boolean} [stencil] Should the context have the stencil buffer active?
 * @property {number} [resolution] The resolution / device pixel ratio of the renderer.
 *  The resolution of the renderer retina would be 2.
 * @property {boolean} [clearBeforeRender] Disable this by setting this to false. For example if
 * your game has a canvas filling background image you often don't need this set.
 * @property {boolean} [preserveDrawingBuffer] Enables drawing buffer preservation,
 *  enable this if you need to call toDataUrl on the webgl context.
 * @property {number} [backgroundColor] This sets if the CanvasRenderer will clear the canvas or
 *  not before the new render pass.
 * @property {boolean} [roundPixels] If true Pixi will Math.floor() x/y values when
 *  rendering, stopping pixel interpolation.
 * @property {boolean} [legacy] If true Pixi will aim to ensure compatibility
 *  with older / less advanced devices. If you experiance unexplained flickering try setting this to true.
 * @property {boolean} [sayHello] Should this renderer log hello? Only happens once if not set explicitly. WARNING: If
 *  you set this to `false` there is a small chance that you may be a poophead.
 * @property {string} [options.powerPreference] - Parameter passed to webgl context, set to "high-performance"
 *  for devices with dual graphics card
 */

/**
 * The default render options supplied to the {@link Renderer}.
 *
 * @static
 * @constant
 * @memberof Renderer
 * @type {Renderer.RendererOptions}
 */
Renderer.defaultOptions = {
    width: 800,
    height: 600,
    canvas: null,
    transparent: false,
    setCanvasStyleOnResize: false,
    antialias: false,
    forceFXAA: false,
    stencil: false,
    resolution: 1.0,
    clearBeforeRender: true,
    preserveDrawingBuffer: false,
    backgroundColor: 0x000000,
    roundPixels: false,
    legacy: false,
    sayHello: true,
};

/**
 * The default providers that will be added to each instance of the a Renderer that is created.
 *
 * @private
 * @static
 * @memberof Renderer
 */
Renderer._defaultProviders = {};

/**
 * The default systems that will be added to each instance of the a Renderer that is created.
 *
 * @private
 * @static
 * @memberof Renderer
 */
Renderer._defaultSystems = [];

/**
 * Lower is placed first
 *
 * @param {System} a The first system
 * @param {System} b The second system
 * @return {number} The sort number
 */
function compareSystemsPriority(a, b)
{
    return a.priority - b.priority;
}

/**
 * Lower is placed first, and within renderPriority they are grouped by the renderGroupHint
 *
 * @param {Entity} a The first entity
 * @param {Entity} b The second entity
 * @return {number} The sort number
 */
function compareRenderPriority(a, b)
{
    if (a.renderPriority === b.renderPriority)
    {
        return a.renderGroupHint === b.renderGroupHint ? 0 : 1;
    }

    return a.renderPriority - b.renderPriority;
}
