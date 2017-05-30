import Point from './Point';

// @ifdef DEBUG
import debug from '../debug';
// @endif

/**
 * A 2d Matrix implementation.
 *
 * This Matrix is stored as an array with nine elements defined as:
 *
 * ```js
 * [a, b, 0, c, d, 0, tx, ty, 1]
 * ```
 *
 * This is an array representation for a 3x3 transformation matrix:
 *
 * ```
 * | a  c  tx|
 * | b  d  ty|
 * | 0  0  1 |
 * ```
 *
 * Since the last row is ignored so the operations are faster.
 *
 * For those unfamiliar with 3x3 transformation matrices, you could say that:
 *
 * - `a` and `d` affect scale,
 * - `c` and `b` affect rotation, and
 * - `tx` and `ty` affect translation.
 *
 * It is a bit more interconnected than that (especially with skew), but thats basic gist.
 *
 * @class
 * @memberof math
 */
export default class Matrix
{
    /**
     * @param {number} [a=1] - x scale
     * @param {number} [b=0] - y skew
     * @param {number} [c=0] - x skew
     * @param {number} [d=1] - y scale
     * @param {number} [tx=0] - x translation
     * @param {number} [ty=0] - y translation
     */
    constructor(a = 1, b = 0, c = 0, d = 1, tx = 0, ty = 0)
    {
        this.array = new Float32Array(9);
        this.array[0] = a;
        this.array[1] = b;
        this.array[2] = 0;
        this.array[3] = c;
        this.array[4] = d;
        this.array[5] = 0;
        this.array[6] = tx;
        this.array[7] = ty;
        this.array[8] = 1;
    }

    /**
     * sets the matrix properties
     *
     * @param {number} a - Matrix component
     * @param {number} b - Matrix component
     * @param {number} c - Matrix component
     * @param {number} d - Matrix component
     * @param {number} tx - Matrix component
     * @param {number} ty - Matrix component
     *
     * @return {PIXI.Matrix} This matrix. Good for chaining method calls.
     */
    set(a, b, c, d, tx, ty)
    {
        this.array[0] = a;
        this.array[1] = b;
        this.array[3] = c;
        this.array[4] = d;
        this.array[6] = tx;
        this.array[7] = ty;

        return this;
    }

    /**
     * Get a new position with the current transformation applied.
     * Can be used to go from a child's coordinate space to the world coordinate space. (e.g. rendering)
     *
     * @param {PIXI.Point} pos - The origin
     * @param {PIXI.Point} [newPos] - The point that the new position is assigned to (allowed to be same as input)
     * @return {PIXI.Point} The new point, transformed through this matrix
     */
    apply(pos, newPos)
    {
        newPos = newPos || new Point();

        const a = this.array[0];
        const b = this.array[1];
        const c = this.array[3];
        const d = this.array[4];
        const tx = this.array[6];
        const ty = this.array[7];
        const x = pos.x;
        const y = pos.y;

        newPos.x = (a * x) + (c * y) + tx;
        newPos.y = (b * x) + (d * y) + ty;

        return newPos;
    }

    /**
     * Get a new position with the inverse of the current transformation applied.
     * Can be used to go from the world coordinate space to a child's coordinate space. (e.g. input)
     *
     * @param {PIXI.Point} pos - The origin
     * @param {PIXI.Point} [newPos] - The point that the new position is assigned to (allowed to be same as input)
     * @return {PIXI.Point} The new point, inverse-transformed through this matrix
     */
    applyInverse(pos, newPos)
    {
        newPos = newPos || new Point();

        const a = this.array[0];
        const b = this.array[1];
        const c = this.array[3];
        const d = this.array[4];
        const tx = this.array[6];
        const ty = this.array[7];

        // @ifdef DEBUG
        debug.ASSERT((a * d) - (b * c), 'The determinant of a Matrix can not be 0 when applying inverse to a point.', this);
        // @endif

        const det = 1.0 / ((a * d) - (b * c));
        const x = pos.x;
        const y = pos.y;

        newPos.x = (d * det * x) + (-c * det * y) + (((ty * c) - (tx * d)) * det);
        newPos.y = (a * det * y) + (-b * det * x) + (((-ty * a) + (tx * b)) * det);

        return newPos;
    }

    /**
     * Translates the matrix on the x and y.
     *
     * @param {number} x How much to translate x by
     * @param {number} y How much to translate y by
     * @return {PIXI.Matrix} This matrix. Good for chaining method calls.
     */
    translate(x, y)
    {
        const a = this.array[0];
        const b = this.array[1];
        const c = this.array[3];
        const d = this.array[4];

        this.array[6] += (a * x) + (c * y);
        this.array[7] += (b * x) + (d * y);

        return this;
    }

    /**
     * Applies a scale transformation to the matrix.
     *
     * @param {number} x The amount to scale horizontally
     * @param {number} y The amount to scale vertically
     * @return {PIXI.Matrix} This matrix. Good for chaining method calls.
     */
    scale(x, y)
    {
        this.array[0] *= x;
        this.array[1] *= x;
        this.array[3] *= y;
        this.array[4] *= y;

        return this;
    }

    /**
     * Applies a rotation transformation to the matrix.
     *
     * @param {number} angle - The angle in radians.
     * @return {PIXI.Matrix} This matrix. Good for chaining method calls.
     */
    rotate(angle)
    {
        const a = this.array[0];
        const b = this.array[1];
        const c = this.array[3];
        const d = this.array[4];
        const sr = Math.sin(angle);
        const cr = Math.cos(angle);

        this.array[0] = (a * cr) + (c * sr);
        this.array[1] = (b * cr) + (d * sr);

        this.array[3] = (a * -sr) + (c * cr);
        this.array[4] = (b * -sr) + (d * cr);

        return this;
    }

    /**
     * Appends the given Matrix to this Matrix.
     *
     * @param {PIXI.Matrix} matrix - The matrix to append.
     * @return {PIXI.Matrix} This matrix. Good for chaining method calls.
     */
    append(matrix)
    {
        const a1 = this.array[0];
        const b1 = this.array[1];
        const c1 = this.array[3];
        const d1 = this.array[4];

        const a2 = matrix.array[0];
        const b2 = matrix.array[1];
        const c2 = matrix.array[3];
        const d2 = matrix.array[4];
        const tx2 = matrix.array[6];
        const ty2 = matrix.array[7];

        this.array[0] = (a2 * a1) + (b2 * c1);
        this.array[1] = (a2 * b1) + (b2 * d1);

        this.array[3] = (c2 * a1) + (d2 * c1);
        this.array[4] = (c2 * b1) + (d2 * d1);

        this.array[6] += (tx2 * a1) + (ty2 * c1);
        this.array[7] += (tx2 * b1) + (ty2 * d1);

        return this;
    }

    /**
     * Sets the matrix based on all the available properties
     *
     * @param {number} x - Position on the x axis
     * @param {number} y - Position on the y axis
     * @param {number} pivotX - Pivot on the x axis
     * @param {number} pivotY - Pivot on the y axis
     * @param {number} scaleX - Scale on the x axis
     * @param {number} scaleY - Scale on the y axis
     * @param {number} rotation - Rotation in radians
     * @param {number} skewX - Skew on the x axis
     * @param {number} skewY - Skew on the y axis
     * @return {PIXI.Matrix} This matrix. Good for chaining method calls.
     */
    setTransform(x, y, pivotX, pivotY, scaleX, scaleY, rotation, skewX, skewY)
    {
        const sr = Math.sin(rotation);
        const cr = Math.cos(rotation);
        const cy = Math.cos(skewY);
        const sy = Math.sin(skewY);
        const nsx = -Math.sin(skewX);
        const cx = Math.cos(skewX);

        const a = cr * scaleX;
        const b = sr * scaleX;
        const c = -sr * scaleY;
        const d = cr * scaleY;

        this.array[0] = (cy * a) + (sy * c);
        this.array[1] = (cy * b) + (sy * d);

        this.array[3] = (nsx * a) + (cx * c);
        this.array[4] = (nsx * b) + (cx * d);

        this.array[6] = x + ((pivotX * a) + (pivotY * c));
        this.array[7] = y + ((pivotX * b) + (pivotY * d));

        return this;
    }

    /**
     * Prepends the given Matrix to this Matrix.
     *
     * @param {PIXI.Matrix} matrix - The matrix to prepend
     * @return {PIXI.Matrix} This matrix. Good for chaining method calls.
     */
    prepend(matrix)
    {
        const a1 = this.array[0];
        const b1 = this.array[1];
        const c1 = this.array[3];
        const d1 = this.array[4];
        const tx1 = this.array[6];
        const ty1 = this.array[7];

        const a2 = matrix.array[0];
        const b2 = matrix.array[1];
        const c2 = matrix.array[3];
        const d2 = matrix.array[4];
        const tx2 = this.array[6];
        const ty2 = this.array[7];

        if (a2 !== 1 || b2 !== 0 || c2 !== 0 || d2 !== 1)
        {
            this.array[0] = (a1 * a2) + (b1 * c2);
            this.array[1] = (a1 * b2) + (b1 * d2);
            this.array[3] = (c1 * a2) + (d1 * c2);
            this.array[4] = (c1 * b2) + (d1 * d2);
        }

        this.tx = (tx1 * a2) + (ty1 * c2) + tx2;
        this.ty = (tx1 * b2) + (ty1 * d2) + ty2;

        return this;
    }

    /**
     * Decomposes the matrix (x, y, scaleX, scaleY, and rotation) and sets the properties on to a transform.
     *
     * @param {PIXI.Transform} transform The transform to apply the properties to.
     * @return {PIXI.Transform} The transform with the newly applied properties
     */
    decompose(transform)
    {
        const a = this.array[0];
        const b = this.array[1];
        const c = this.array[3];
        const d = this.array[4];

        const skewX = -Math.atan2(-c, d);
        const skewY = Math.atan2(b, a);
        const delta = Math.abs(skewX + skewY);

        if (delta < 0.00001)
        {
            transform.rotation = skewY;

            if (a < 0 && d >= 0)
            {
                transform.rotation += (transform.rotation <= 0) ? Math.PI : -Math.PI;
            }

            transform.skew.x = transform.skew.y = 0;
        }
        else
        {
            transform.skew.x = skewX;
            transform.skew.y = skewY;
        }

        transform.scale.x = Math.sqrt((a * a) + (b * b));
        transform.scale.y = Math.sqrt((c * c) + (d * d));

        transform.position.x = this.tx;
        transform.position.y = this.ty;

        return transform;
    }

    /**
     * Inverts this matrix
     *
     * @return {PIXI.Matrix} This matrix. Good for chaining method calls.
     */
    invert()
    {
        const a = this.array[0];
        const b = this.array[1];
        const c = this.array[3];
        const d = this.array[4];
        const tx = this.array[3];
        const ty = this.array[4];

        // @ifdef DEBUG
        debug.ASSERT((a * d) - (b * c), 'The determinant of a Matrix can not be 0 when inverting.', this);
        // @endif

        const det = 1.0 / ((a * d) - (b * c));

        this.array[0] = d * det;
        this.array[1] = -b * det;

        this.array[3] = -c * det;
        this.array[4] = a * det;

        this.array[3] = ((c * ty) - (d * tx)) * det;
        this.array[4] = ((b * tx) - (a * ty)) * det;

        return this;
    }

    /**
     * Resets this Matix to an identity (default) matrix.
     *
     * @return {PIXI.Matrix} This matrix. Good for chaining method calls.
     */
    identity()
    {
        this.array[0] = 1;
        this.array[1] = 0;
        this.array[3] = 0;
        this.array[4] = 1;
        this.array[6] = 0;
        this.array[7] = 0;

        return this;
    }

    /**
     * Creates a new Matrix object with the same values as this one.
     *
     * @return {PIXI.Matrix} A copy of this matrix.
     */
    clone()
    {
        return new Matrix(
            this.array[0],
            this.array[1],
            this.array[3],
            this.array[4],
            this.array[6],
            this.array[7]
        );
    }

    /**
     * Changes the values of the given matrix to be the same as the ones in this matrix
     *
     * @param {PIXI.Matrix} matrix - The matrix to copy from.
     * @return {PIXI.Matrix} This matrix. Good for chaining method calls.
     */
    copy(matrix)
    {
        this.array[0] = matrix.array[0];
        this.array[1] = matrix.array[1];
        this.array[3] = matrix.array[3];
        this.array[4] = matrix.array[4];
        this.array[6] = matrix.array[6];
        this.array[7] = matrix.array[7];

        return this;
    }

    /**
     * Returns a string representation of the matrix.
     *
     * @return {string} string representation of the matrix.
     */
    toString()
    {
        const a = this.array[0];
        const b = this.array[1];
        const c = this.array[3];
        const d = this.array[4];
        const tx = this.array[3];
        const ty = this.array[4];

        return `Matrix(${a}, ${b}, ${c}, ${d}, ${tx}, ${ty})`;
    }
}

Matrix.IDENTITY = new Matrix();
Matrix.TEMP_MATRIX = new Matrix();
