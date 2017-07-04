import Signal from 'mini-signals';
import Renderer from '../Renderer';
import Provider from '../Provider';
import { hex2string, hex2rgb } from '../../utils';
import { Rectangle } from '../../math';

/**
 * @class
 */
export default class ViewProvider extends Provider
{
    /**
     * @param {Renderer} renderer The renderer this Provider works for.
     */
    constructor(renderer)
    {
        super(renderer);

        /**
         * Measurements of the screen. (0, 0, screenWidth, screenHeight)
         *
         * Its safe to use as filterArea or hitArea for whole stage
         *
         * @readonly
         * @member {PIXI.Rectangle}
         */
        this.screen = new Rectangle(0, 0, renderer.options.width, renderer.options.height);

        /**
         * The canvas element that everything is drawn to
         *
         * @readonly
         * @member {HTMLCanvasElement}
         */
        this.canvas = renderer.options.canvas;

        /**
         * The background color as a number.
         *
         * @private
         * @member {number}
         */
        this._backgroundColor = 0x000000;

        /**
         * The background color as an [R, G, B] array.
         *
         * @private
         * @member {number[]}
         */
        this._backgroundColorRgba = [0, 0, 0, 0];

        /**
         * The background color as a string.
         *
         * @private
         * @member {string}
         */
        this._backgroundColorString = '#000000';

        /**
         * Dispatched after the view is resized.
         *
         * @private
         * @member {string}
         */
        this.onResize = new Signal();

        // run bg color setter
        this.backgroundColor = renderer.options.backgroundColor || this._backgroundColor;

        // setup the width/height properties and gl viewport
        this.resize(this.screen.width, this.screen.height);
    }

    /**
     * Same as view.width, actual number of pixels in the canvas by horizontal
     *
     * @readonly
     * @member {number}
     */
    get width()
    {
        return this.view.width;
    }

    /**
     * Same as view.height, actual number of pixels in the canvas by vertical
     *
     * @readonly
     * @member {number}
     */
    get height()
    {
        return this.view.height;
    }

    /**
     * The background color to fill.
     *
     * @member {number}
     */
    get backgroundColor()
    {
        return this._backgroundColor;
    }

    set backgroundColor(value) // eslint-disable-line require-jsdoc
    {
        this._backgroundColor = value;
        this._backgroundColorString = hex2string(value);

        hex2rgb(value, this._backgroundColorRgba);

        this._backgroundColorRgba[3] = this.options.transparent ? 0 : this._backgroundColorRgba[3];
    }

    /**
     * Resizes the screen and canvas to the specified width and height
     * Canvas dimensions are multiplied by resolution
     *
     * @param {number} screenWidth - the new width of the screen
     * @param {number} screenHeight - the new height of the screen
     */
    resize(screenWidth, screenHeight)
    {
        this.screen.width = screenWidth;
        this.screen.height = screenHeight;

        this.canvas.width = screenWidth * this.options.resolution;
        this.canvas.height = screenHeight * this.options.resolution;

        if (this.options.setCanvasStyleOnResize)
        {
            this.canvas.style.width = `${screenWidth}px`;
            this.canvas.style.height = `${screenHeight}px`;
        }

        this.onResize.dispatch();
    }

    /**
     * Removes everything from the renderer and optionally removes the Canvas DOM element.
     *
     * @param {boolean} [removeView=false] - Removes the Canvas element from the DOM.
     */
    destroy(removeView)
    {
        super.destroy();

        if (removeView && this.view.parentNode)
        {
            this.view.parentNode.removeChild(this.view);
        }

        this.renderer = null;
        this.screen = null;
        this.canvas = null;

        this._backgroundColor = 0;
        this._backgroundColorRgba = null;
        this._backgroundColorString = null;
    }
}

Renderer.addDefaultProvider(ViewProvider, 'view');
