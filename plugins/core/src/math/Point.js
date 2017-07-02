import UpdateComponent from '../components/UpdateComponent';

/**
 * The Point object represents a location in a two-dimensional coordinate system, where x represents
 * the horizontal axis and y represents the vertical axis.
 *
 * @class
 * @memberof math
 */
export default class Point extends UpdateComponent()
{
    /**
     * @param {number} [x=0] - position of the point on the x axis
     * @param {number} [y=0] - position of the point on the y axis
     */
    constructor(x = 0, y = 0)
    {
        super();

        if ((x.buffer || x) instanceof ArrayBuffer)
        {
            this.array = new Float64Array((x.buffer || x), y, 2);
            this.array[0] = 0;
            this.array[1] = 0;
        }
        else
        {
            this.array = new Float64Array(2);
            this.array[0] = x;
            this.array[1] = y;
        }
    }

    /**
     * The position of the displayObject on the x axis relative to the local coordinates of the parent.
     *
     * @member {number}
     */
    get x()
    {
        return this.array[0];
    }

    set x(value) // eslint-disable-line require-jsdoc
    {
        if (this.array[0] !== value)
        {
            this.array[0] = value;
            this.update();
        }
    }

    /**
     * The position of the displayObject on the x axis relative to the local coordinates of the parent.
     *
     * @member {number}
     */
    get y()
    {
        return this.array[1];
    }

    set y(value) // eslint-disable-line require-jsdoc
    {
        if (this.array[1] !== value)
        {
            this.array[1] = value;
            this.update();
        }
    }

    /**
     * Creates a clone of this point
     *
     * @return {PIXI.Point} a copy of the point
     */
    clone()
    {
        return new Point(this.array[0], this.array[1]);
    }

    /**
     * Copies x and y from the given point
     *
     * @param {PIXI.Point} p - The point to copy.
     */
    copy(p)
    {
        this.set(p.array[0], p.array[1]);
    }

    /**
     * Returns true if the given point is equal to this point
     *
     * @param {PIXI.Point} p - The point to check
     * @returns {boolean} Whether the given point equal to this point
     */
    equals(p)
    {
        return (this.array[0] === p.array[0]) && (this.array[1] === p.array[1]);
    }

    /**
     * Sets the point to a new x and y position.
     * If y is omitted, both x and y will be set to x.
     *
     * @param {number} [x=0] - position of the point on the x axis
     * @param {number} [y=0] - position of the point on the y axis
     */
    set(x, y)
    {
        const _x = x || 0;
        const _y = y || ((y !== 0) ? _x : 0);

        if (this.array[0] !== _x || this.array[1] !== _y)
        {
            this.array[0] = _x;
            this.array[1] = _y;
            this.update();
        }
    }
}
