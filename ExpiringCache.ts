import Collection from '@arcticzeroo/collection';

interface ICachedObjectProps<T> {
    expireTime?: number,
    fetch: () => Promise<T>
}

/**
 * A cached object. Don't access this directly.
 */
class CachedObject<T = any> {
    readonly expireTime: number;
    readonly fetch: () => Promise<T>;
    private updated: number;
    private value: T;

    /**
     * Create a new cached object.
     * @param {number} expireTime - Time in ms before this object expires.
     * @param {function} fetch - a function to call when the value needs updating (should probably be async)
     */
    constructor({ expireTime = 1000 * 60 * 60 * 12, fetch = async () => null } : ICachedObjectProps<T>) {
        this.expireTime = expireTime;
        this.fetch = fetch;
        this.updated = 0;
        this.value = null;
    }

    /**
     * Whether or not this object has outlived its existence. How sad.
     * @returns {boolean}
     */
    isValid(): boolean {
        return !!this.value && Date.now() - this.updated <= this.expireTime;
    }

    /**
     * Get a value associated with this object. If the value is still valid,
     * it will be returned. Otherwise, fetch will be called.
     * @returns {Promise.<null|*>}
     */
    async getValue(): Promise<T> {
        if (this.isValid()) {
            return this.value;
        } else {
            let res;
            try {
                res = await this.fetch();
            } catch (e) {
                throw e;
            }

            this.updated = Date.now();
            this.value = res;
            return res;
        }
    }
}

/**
 * An expiring cache.
 */
class ExpiringCache<TKey, TValue> extends Collection<TKey, CachedObject<TValue>> {
    /**
     * Add an entry to the expiring cache.
     * <p>
     * Call this instead of the normal .set,
     * this is more of a formal registration of
     * the key rather than adding it to the
     * collection.
     * @param {string} key - The name of the key.
     * @param {object} opts - See {@link CachedObject.constructor}
     */
    add(key: TKey, opts: ICachedObjectProps<TValue>) {
        this.set(key, new CachedObject(opts));
    }

    /**
     * Get the value of a given key in the collection.
     * @param {string} key - The key for which to get.
     * @returns {Promise.<*>}
     */
    getValue(key: TKey) {
        if (!this.has(key)) {
            return null;
        }

        const cachedObj = this.get(key);

        return cachedObj.getValue();
    }
}

export default ExpiringCache;