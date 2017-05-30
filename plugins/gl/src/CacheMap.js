let CacheMap = typeof Map !== 'undefined' ? Map : null;

if (!CacheMap)
{
    CacheMap = class MapFallback
    {
        constructor(iterable)
        {
            this.length = 0;

            this._values = [];
        }

        set(key, value)
        {
            for (let i = 0; i < this._values.length; ++i)
            {
                if (this._values[i].key === key)
                {
                    this._values[i].value = value;

                    return this;
                }
            }

            this._values.push({ key, value });

            return this;
        }

        get(key)
        {
            for (let i = 0; i < this._values.length; ++i)
            {
                if (this._values[i].key === key)
                {
                    return this._values[i].value;
                }
            }
        }

        has(key)
        {
            for (let i = 0; i < this._values.length; ++i)
            {
                if (this._values[i].key === key)
                {
                    return true;
                }
            }

            return false;
        }

        delete(key)
        {
            let index = -1;

            for (let i = 0; i < this._values.length; ++i)
            {
                if (this._values[i].key === key)
                {
                    index = i;
                    break;
                }
            }

            if (idnex > -1)
            {
                this._values.splice(index, 1);

                return true;
            }

            return false;
        }
    }
}

export default CacheMap;
