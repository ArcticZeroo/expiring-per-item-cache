"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const collection_1 = require("@arcticzeroo/collection");
/**
 * A cached object. Don't access this directly.
 */
class CachedObject {
    /**
     * Create a new cached object.
     * @param {number} expireTime - Time in ms before this object expires.
     * @param {function} fetch - a function to call when the value needs updating (should probably be async)
     */
    constructor({ expireTime = 1000 * 60 * 60 * 12, fetch = () => __awaiter(this, void 0, void 0, function* () { return null; }) }) {
        this.expireTime = expireTime;
        this.fetch = fetch;
        this.updated = 0;
        this.value = null;
    }
    /**
     * Whether or not this object has outlived its existence. How sad.
     * @returns {boolean}
     */
    isValid() {
        return !!this.value && Date.now() - this.updated <= this.expireTime;
    }
    /**
     * Get a value associated with this object. If the value is still valid,
     * it will be returned. Otherwise, fetch will be called.
     * @returns {Promise.<null|*>}
     */
    getValue() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isValid()) {
                return this.value;
            }
            else {
                let res;
                try {
                    res = yield this.fetch();
                }
                catch (e) {
                    throw e;
                }
                this.updated = Date.now();
                this.value = res;
                return res;
            }
        });
    }
}
/**
 * An expiring cache.
 */
class ExpiringCache extends collection_1.default {
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
    add(key, opts) {
        this.set(key, new CachedObject(opts));
    }
    /**
     * Get the value of a given key in the collection.
     * @param {string} key - The key for which to get.
     * @returns {Promise.<*>}
     */
    getValue(key) {
        if (!this.has(key)) {
            return null;
        }
        const cachedObj = this.get(key);
        return cachedObj.getValue();
    }
}
exports.default = ExpiringCache;
//# sourceMappingURL=ExpiringCache.js.map