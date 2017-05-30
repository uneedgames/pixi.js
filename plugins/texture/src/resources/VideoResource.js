import TextureResource from './TextureResource';
import determineCrossOrigin from '../../utils/determineCrossOrigin';

/**
 * @class
 * @memberof texture
 */
export default class VideoResource extends TextureResource
{
    /**
     * @param {HTMLVideoElement} data The video element to use.
     */
    constructor(data)
    {
        super(data);

        /**
         * Tracks whether we should be automatically update the texture each frame.
         *
         * @private
         * @member {boolean}
         * @default true
         */
        this._autoUpdate = true;

        /**
         * Tracks whether we are currently updating the texture automatically.
         *
         * @private
         * @member {boolean}
         * @default false
         */
        this._isAutoUpdating = false;

        /**
         * When set to true will automatically play videos used by this texture once
         * they are loaded. If false, it will not modify the playing state.
         *
         * @member {boolean}
         * @default true
         */
        this.autoPlay = true;

        this._boundOnPlayStart = () => this._onPlayStart();
        this._boundOnPlayStop = () => this._onPlayStop();
        this._boundOnCanPlay = () => this._onCanPlay();

        data.addEventListener('play', this._boundOnPlayStart);
        data.addEventListener('pause', this._boundOnPlayStop);

        if (!this._isSourceReady())
        {
            data.addEventListener('canplay', this._boundOnCanPlay);
            data.addEventListener('canplaythrough', this._boundOnCanPlay);
        }
        else
        {
            this._onCanPlay();
        }
    }

    /**
     * Should the base texture automatically update itself, set to true by default
     *
     * @member {boolean}
     */
    get autoUpdate()
    {
        return this._autoUpdate;
    }

    set autoUpdate(value) // eslint-disable-line require-jsdoc
    {
        if (value !== this._autoUpdate)
        {
            this._autoUpdate = value;

            if (!this._autoUpdate && this._isAutoUpdating)
            {
                ticker.shared.remove(this.update, this);
                this._isAutoUpdating = false;
            }
            else if (this._autoUpdate && !this._isAutoUpdating)
            {
                ticker.shared.add(this.update, this);
                this._isAutoUpdating = true;
            }
        }
    }

    /**
     * Destroys this texture
     *
     */
    destroy()
    {
        this.data.removeEventListener('play', this._boundOnPlayStart);
        this.data.removeEventListener('pause', this._boundOnPlayStop);
        this.data.removeEventListener('canplay', this._boundOnCanPlay);
        this.data.removeEventListener('canplaythrough', this._boundOnCanPlay);

        super.destroy();

        this._boundOnPlayStart = null;
        this._boundOnPlayStop = null;
        this._boundOnCanPlay = null;
        this._boundOnCanPlay = null;

        if (this._isAutoUpdating)
        {
            ticker.shared.remove(this.update, this);
        }
    }

    /**
     * Returns true if the underlying source is playing.
     *
     * @private
     * @return {boolean} True if playing.
     */
    _isSourcePlaying()
    {
        const source = this.data;

        return (source.currentTime > 0 && source.paused === false && source.ended === false && source.readyState > 2);
    }

    /**
     * Returns true if the underlying source is ready for playing.
     *
     * @private
     * @return {boolean} True if ready.
     */
    _isSourceReady()
    {
        return this.data.readyState === this.data.HAVE_ENOUGH_DATA
            || this.data.readyState === this.data.HAVE_FUTURE_DATA;
    }

    /**
     * Runs the update loop when the video is ready to play
     *
     * @private
     */
    _onPlayStart()
    {
        // Just in case the video has not received its can play even yet..
        if (!this.ready)
        {
            this._onCanPlay();
        }

        if (!this._isAutoUpdating && this.autoUpdate)
        {
            ticker.shared.add(this.update, this);
            this._isAutoUpdating = true;
        }
    }

    /**
     * Fired when a pause event is triggered, stops the update loop
     *
     * @private
     */
    _onPlayStop()
    {
        if (this._isAutoUpdating)
        {
            ticker.shared.remove(this.update, this);
            this._isAutoUpdating = false;
        }
    }

    /**
     * Fired when the video is loaded and ready to play
     *
     * @private
     */
    _onCanPlay()
    {
        if (this.data)
        {
            this.data.removeEventListener('canplay', this._boundOnCanPlay);
            this.data.removeEventListener('canplaythrough', this._boundOnCanPlay);

            const emitReady = !this.ready;

            this.width = this.data.videoWidth;
            this.height = this.data.videoHeight;

            if (emitReady)
            {
                this.onReady.dispatch(this);
            }

            if (this._isSourcePlaying())
            {
                this._onPlayStart();
            }
            else if (this.autoPlay)
            {
                this.data.play();
            }
        }
    }

    /**
     * Helper function that creates a new BaseTexture based on the given video element.
     * This BaseTexture can then be used to create a texture
     *
     * @static
     * @param {string|object|string[]|object[]} videoSrc The URL(s) for the video.
     * @param {string} [videoSrc.src] One of the source urls for the video
     * @param {string} [videoSrc.mime] The mimetype of the video (e.g. 'video/mp4'). If not specified
     *  the url's extension will be used as the second part of the mime type.
     * @param {object} options Options to pass to the ctor
     * @param {string|boolean} crossorigin The crossorigin value to use for the image.
     * @return {PIXI.VideoBaseTexture} Newly created VideoBaseTexture
     */
    static fromUrl(videoSrc, options)
    {
        const video = document.createElement('video');

        if (options.crossorigin)
        {
            video.crossOrigin = typeof options.crossorigin === 'string' ? options.crossorigin : 'anonymous';
        }

        video.setAttribute('webkit-playsinline', '');
        video.setAttribute('playsinline', '');

        // array of objects or strings
        if (Array.isArray(videoSrc))
        {
            for (let i = 0; i < videoSrc.length; ++i)
            {
                const url = videoSrc[i].src || videoSrc[i];

                checkCrossOrigin(video, url);
                video.appendChild(createSource(url, videoSrc[i].mime));
            }
        }
        // single object or string
        else
        {
            const url = videoSrc.src || videoSrc;

            checkCrossOrigin(video, url);
            video.appendChild(createSource(url, videoSrc.mime));
        }

        video.load();

        return new VideoResource(video, options);
    }
}

function checkCrossOrigin(video, url)
{
    // already set, just stop.
    if (video.crossOrigin) return;

    // set it for non-data urls that we determine to be cross origin
    if (url.indexOf('data:') !== 0)
    {
        video.crossOrigin = determineCrossOrigin(url);
    }
}

function createSource(path, type)
{
    if (!type)
    {
        type = `video/${path.substr(path.lastIndexOf('.') + 1)}`;
    }

    const source = document.createElement('source');

    source.src = path;
    source.type = type;

    return source;
}
