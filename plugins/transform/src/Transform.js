import { math } from '@pixi/core';
import { UpdateComponent } from '@pixi/components';

/* @ifdef DEBUG */
import { ASSERT } from '@pixi/debug';
/* @endif */

/**
 * Generic class to deal with traditional 2D matrix transforms.
 *
 * @class
 * @memberof transform
 */
export default class Transform extends UpdateComponent()
{
    /**
     * Constructs a new Transform object.
     *
     */
    constructor()
    {
        super();

        /**
         * The parent transform to update against.
         *
         * @member {Transform}
         * @default null
         */
        this.parent = null;

        /**
         * The global matrix transform, it is written to the passed in output buffer.
         *
         * @private
         * @member {Matrix2d}
         */
        this._wt = new math.Matrix();

        /**
         * The local matrix transform.
         *
         * @private
         * @member {Matrix2d}
         */
        this._lt = new math.Matrix();

        /**
         * Position component of transform.
         *
         * @private
         * @member {Vector2d}
         */
        this._position = new math.Point();

        /**
         * Scale component of transform.
         *
         * @private
         * @member {Vector2d}
         */
        this._scale = new math.Point(1, 1);

        /**
         * Skew component of transform.
         *
         * @private
         * @member {Vector2d}
         */
        this._skew = new math.Point();

        /**
         * Pivot component of transform.
         *
         * @private
         * @member {Vector2d}
         */
        this._pivot = new math.Point();

        /**
         * Rotation component of transform.
         *
         * @private
         * @member {number}
         */
        this._rotation = 0;

        // Track the last update ID we had, and what we saw from the parent transform.
        this._lastUpdateID = 0;
        this._lastParentUpdateID = 0;

        // cache vars for expensive trig functions
        this._sr = Math.sin(0);
        this._cr = Math.cos(0);
        this._sx = Math.sin(0); // skewX
        this._cx = Math.cos(0); // skewX
        this._cy = Math.cos(0); // skewY
        this._sy = Math.sin(0); // skewY
    }

    /**
     * The local transformation matrix.
     *
     * @member {Matrix2d}
     */
    get localTransform()
    {
        return this._lt;
    }

    /**
     * The world transformation matrix.
     *
     * @member {Matrix2d}
     */
    get worldTransform()
    {
        return this._wt;
    }

    /**
     * The X position.
     *
     * @member {number}
     */
    get x()
    {
        return this._position.x;
    }

    /**
     * Sets X position of the transform.
     *
     * @param {number} v - The value to set to.
     */
    set x(v)
    {
        this._position.x = v;
        this.update();
    }

    /**
     * The Y position.
     *
     * @member {number}
     */
    get y()
    {
        return this._position.y;
    }

    /**
     * Sets Y position of the transform.
     *
     * @param {number} v - The value to set to.
     */
    set y(v)
    {
        this._position.y = v;
        this.update();
    }

    /**
     * The X scale.
     *
     * @member {number}
     */
    get scaleX()
    {
        return this._scale.x;
    }

    /**
     * Sets X scale of the transform.
     *
     * @param {number} v - The value to set to.
     */
    set scaleX(v)
    {
        this._scale.x = v;
        this.update();
    }

    /**
     * The Y scale.
     *
     * @member {number}
     */
    get scaleY()
    {
        return this._scale.y;
    }

    /**
     * Sets Y scale of the transform.
     *
     * @param {number} v - The value to set to.
     */
    set scaleY(v)
    {
        this._scale.y = v;
        this.update();
    }

    /**
     * The X skew.
     *
     * @member {number}
     */
    get skewX()
    {
        return this._skew.x;
    }

    /**
     * Sets X skew of the transform.
     *
     * @param {number} v - The value to set to.
     */
    set skewX(v)
    {
        this._skew.x = v;
        this._sx = Math.sin(v);
        this._cx = Math.cos(v);
        this.update();
    }

    /**
     * The Y skew.
     *
     * @member {number}
     */
    get skewY()
    {
        return this._skew.y;
    }

    /**
     * Sets Y skew of the transform.
     *
     * @param {number} v - The value to set to.
     */
    set skewY(v)
    {
        this._skew.y = v;
        this._cy = Math.cos(v);
        this._sy = Math.sin(v);
        this.update();
    }

    /**
     * The X pivot.
     *
     * @member {number}
     */
    get pivotX()
    {
        return this._pivot.x;
    }

    /**
     * Sets X pivot of the transform.
     *
     * @param {number} v - The value to set to.
     */
    set pivotX(v)
    {
        this._pivot.x = v;
        this.update();
    }

    /**
     * The Y pivot.
     *
     * @member {number}
     */
    get pivotY()
    {
        return this._pivot.y;
    }

    /**
     * Sets Y pivot of the transform.
     *
     * @param {number} v - The value to set to.
     */
    set pivotY(v)
    {
        this._pivot.y = v;
        this.update();
    }

    /**
     * The rotation.
     *
     * @member {number}
     */
    get rotation()
    {
        return this._rotation;
    }

    /**
     * Sets rotation of the transform.
     *
     * @param {number} v - The value to set to.
     */
    set rotation(v)
    {
        this._rotation = v;
        this._sr = Math.sin(v);
        this._cr = Math.cos(v);
        this.update();
    }

    /**
     * Invalidates the cached parent transform which forces an update next time.
     *
     */
    invalidate()
    {
        this._lastUpdateID = 0;
        this._lastParentUpdateID = 0;
    }

    /**
     * Updates the world transform based on the passed transform.
     *
     */
    update()
    {
        this.dirty = true;

        const wt = this._wt;
        const lt = this._lt;

        if (this._lastUpdateID !== this.updateID)
        {
            const a =  this._cr * this._scale.x;
            const b =  this._sr * this._scale.x;
            const c = -this._sr * this._scale.y;
            const d =  this._cr * this._scale.y;

            // skew
            lt[0] = (this._cy * a) + (this._sy * c);
            lt[1] = (this._cy * b) + (this._sy * d);
            lt[3] = (this._sx * a) + (this._cx * c);
            lt[4] = (this._sx * b) + (this._cx * d);

            // translation
            lt[6] = this._position.x - ((this._pivot.x * lt[0]) + (this._pivot.y * lt[3]));
            lt[7] = this._position.y - ((this._pivot.x * lt[1]) + (this._pivot.y * lt[4]));

            this._lastUpdateID = this.updateID;
            this._lastParentUpdateID = 0;

            if (!this.parent)
            {
                wt.copy(lt);
            }
        }

        // @ifdef DEBUG
        ASSERT(lt.valid(), 'Invalid local transform, property is set incorrectly somewhere...');
        // @endif

        if (this.parent && this._lastParentUpdateID !== this.parent.updateID)
        {
            const pt = this.parent._wt;

            // multiply the parent matrix with the objects transform.
            wt[0] = (lt[0] * pt[0]) + (lt[1] * pt[3]);
            wt[1] = (lt[0] * pt[1]) + (lt[1] * pt[4]);
            wt[3] = (lt[3] * pt[0]) + (lt[4] * pt[3]);
            wt[4] = (lt[3] * pt[1]) + (lt[4] * pt[4]);
            wt[6] = (lt[6] * pt[0]) + (lt[7] * pt[3]) + pt[6];
            wt[7] = (lt[6] * pt[1]) + (lt[7] * pt[4]) + pt[7];

            this._lastParentUpdateID = this.parent.updateID;
        }

        // @ifdef DEBUG
        ASSERT(wt.valid(), 'Invalid world transform, property is set incorrectly somewhere...');
        // @endif
    }

    /**
     * Destroys this transform object.
     */
    destroy()
    {
        this._wt = null;
        this._lt = null;
        this._position = null;
        this._scale = null;
        this._skew = null;
        this._pivot = null;
    }
}

/**
 * The identity transform.
 *
 * @static
 * @constant
 * @type {Transform}
 */
Transform.IDENTITY = new Transform();
