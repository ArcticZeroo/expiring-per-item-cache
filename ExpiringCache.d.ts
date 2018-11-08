import Collection from '@arcticzeroo/collection';
interface ICachedObjectProps {
    expireTime?: number;
    fetch: () => Promise<any>;
}
/**
 * A cached object. Don't access this directly.
 */
declare class CachedObject<T = any> {
    readonly expireTime: number;
    readonly fetch: () => Promise<T>;
    private updated;
    private value;
    /**
     * Create a new cached object.
     * @param {number} expireTime - Time in ms before this object expires.
     * @param {function} fetch - a function to call when the value needs updating (should probably be async)
     */
    constructor({ expireTime, fetch }: ICachedObjectProps);
    /**
     * Whether or not this object has outlived its existence. How sad.
     * @returns {boolean}
     */
    isValid(): boolean;
    /**
     * Get a value associated with this object. If the value is still valid,
     * it will be returned. Otherwise, fetch will be called.
     * @returns {Promise.<null|*>}
     */
    getValue(): Promise<T>;
}
/**
 * An expiring cache.
 */
declare class ExpiringCache<TKey, TValue> extends Collection<TKey, CachedObject<TValue>> {
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
    add(key: TKey, opts: ICachedObjectProps): void;
    /**
     * Get the value of a given key in the collection.
     * @param {string} key - The key for which to get.
     * @returns {Promise.<*>}
     */
    getValue(key: TKey): Promise<TValue>;
}
export default ExpiringCache;
