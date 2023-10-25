/* global localforage */

/**
 * Class providing caching for data objects.
 *
 * It's assumed that the data comes from some remote service (otherwise there is no point in caching).
 *
 * Source: OPAC: \klient\src\js\app\DataCache.js
 *
 * @param {String} dataKey Globally(!) unique key to store data.
 * @param {Storage} storageService Storage service that should have two functions:
 *		storageService.set(key, value)	-- save value which can be any Object!
 *		storageService.get(key)			-- load saved value (returns Object if an Object was passed!)
 *		Will attempt fallback to `localforage` if not specified.
 * @param {bool?} asynchronous If true then storage will be treated as asynchronous.
 *		Promise model will be used for read and write.
 * @class DataCache
 */
function DataCache(dataKey, storageService, asynchronous) {

	// init storage service
	if (typeof (storageService) === "undefined") {
		storageService = localforage;
		asynchronous = true;
	}
	this.asynchronous = (asynchronous ? true : false);
	if (this.asynchronous) {
		this.storage = new DataCache.Async(storageService);
	} else {
		this.storage = new DataCache.Sync(storageService);
	}
		
	/**
	 * Load limit in seconds.
	 *
	 * After that many seconds we will attempt to refresh data (to be available next time).
	 */
	this.loadLimit = 10 * 60;

	/**
	 * Forced data reload limit in seconds.
	 *
	 * After that many seconds we will wait for new data even if we have them saved in storage.
	 *
	 * Set to `0` to ignore this limit.
	 * By setting `forcedReloadLimit = 0` you allow to always use cache.
	 * Data might still be refreshed after `loadLimit` passes (but cache will be used up front).
	 */
	this.forcedReloadLimit = 30 * 24 * 60 * 60;

	/**
	 * Storage key for data.
	 * @private
	 */
	this.dataStorageKey = 'DataCache.data.' + dataKey;
	/**
	 * Storage key for time.
	 * @private
	 */
	this.timeStorageKey = 'DataCache.time.' + dataKey;

	/**
	 * Data state information.
	 */
	this.dataState = {
		available: false,
		needRefresh: true,
		needReload: true
	};

	/**
	 * The data.
	 */
	this.data;
}

/**
 * Synchrouns storage helper.
 *
 * @param {Object} storage jStorage like service.
 * Note that it differes from localStorage in that it should handle JSON encoding and decoding.
 */
DataCache.Sync = function (storage) {
	this.storage = storage;
}
DataCache.Sync.prototype.set = function(key, value, callback) {
	this.storage.set(key, value);
	if (typeof callback === 'function') {
		callback(true);
	}
};
DataCache.Sync.prototype.get = function(key, callback) {
	var value = this.storage.get(key);
	if (typeof callback === 'function') {
		callback(value);
	}
};
/**
 * Asynchrouns storage helper.
 *
 * @param {Object} storage localForage like service.
 */
DataCache.Async = function (storage) {
	this.storage = storage;
}
DataCache.Async.prototype.set = function(key, value, callback) {
	this.storage.setItem(key, value).then(function () {
		if (typeof callback === 'function') {
			callback(true);
		}
	// IE8 compat.
	})["catch"](function (err) {
		console.warn('[DataCache.Async] set failed with error: ', err);
		if (typeof callback === 'function') {
			callback(false);
		}
	});
};
DataCache.Async.prototype.get = function(key, callback) {
	this.storage.getItem(key).then(function (value) {
		if (typeof callback === 'function') {
			callback(value);
		}
	})["catch"](function (err) {
		console.warn('[DataCache.Async] get failed with error: ', err);
		if (typeof callback === 'function') {
			callback(null);
		}
	});
};

/**
 * Initial check to be done before loading anything.
 *
 * Note! Until callback is called you MUST NOT use `dataState`.
 * 
 * @param {Function} callback Function that should be run after checking/loading cache.
 */
DataCache.prototype.check = function(callback) {
	var me = this;
	this.dataState = {
		available: false,
		needRefresh: true,
		needReload: true
	};
	//console.log('[DataCache.check] ', me.dataStorageKey);
	me.storage.get(me.timeStorageKey, function(lastLoadTime){
		if (lastLoadTime === null) {
			callback(false);
			return;
		}

		var timeDiffSeconds = Math.abs((new Date()).getTime() - lastLoadTime) / 1000;

		// should data be refreshed (to be availble for next time)
		if (timeDiffSeconds < me.loadLimit) {
			//console.log('[DataCache.check] no need for refresh yet; seconds left: ', me.loadLimit-timeDiffSeconds);
			me.dataState.needRefresh = false;
		} else {
			//console.log('[DataCache.check] should refresh; seconds after timeout: ', timeDiffSeconds-me.loadLimit);
		}

		// check if cached data is not too old to be used
		if (!me.forcedReloadLimit || timeDiffSeconds < me.forcedReloadLimit) {
			//console.log('[DataCache.check] data seem not to be too old to use');
			me.storage.get(me.dataStorageKey, function(value){
				me.data = value;
				me.dataState.available = true;
				me.dataState.needReload = false;
				callback(me.dataState.available);
			});
		} else {
			callback(me.dataState.available);
		}
	});
};

/**
 * Save data to cache.
 * 
 * Warning! If the `data` is modifed before `callback` then the cached data might have unexpected value.
 * 
 * If `data` is an object (i.e. not a simple string or number) then you should either:
 * 1. **(recomended)** Pass the `callback` and do modifications afterwards.
 * 2. Clone data before passing it to `save` function. Not recomended (you will do cloning twice and deep cloning is not very performant for large objects).
 * 
 * Note. IndexedDB is doing a structured clone[1] of the saved data. localStorage should be fine too (because it needs to stringify anyway)
 * So it should be safe to modify data in the callback.
 * [1] = https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm
 * 
 * Cloning performance discussion:
 * https://stackoverflow.com/questions/122102/what-is-the-most-efficient-way-to-deep-clone-an-object-in-javascript/5344074#5344074
 * https://developers.google.com/web/fundamentals/instant-and-offline/web-storage/indexeddb-best-practices#keeping_your_app_performant
 * 
 * Test for unexpected behaviour:
 * https://jsfiddle.net/eccenux/d19tb2ns/11/
 *
 * @param {Any} data Data to be saved. Any data that can be stringified is OK.
 * @param {Function?} callback Optional function to be run after saving data.
 */
DataCache.prototype.save = function(data, callback) {
	var me = this;
	me.storage.set(me.timeStorageKey, (new Date()).getTime(), function(){
		me.storage.set(me.dataStorageKey, data, function(){
			if (typeof callback === 'function') {
				callback();
			}
		});
	});
};

/**
 * Clear cached data.
 *
 * @param {Function?} callback Optional function to be run after clearing data.
 */
DataCache.prototype.clear = function(callback) {
	var me = this;
	me.storage.set(me.timeStorageKey, null, function(){
		me.storage.set(me.dataStorageKey, null, function(){
			if (typeof callback === 'function') {
				callback();
			}
		});
	});
};