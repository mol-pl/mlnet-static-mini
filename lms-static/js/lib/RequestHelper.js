/**
 * Class providing helper functions for parsing request params.
 */
function RequestHelper() {
}

/**
 * Strip URL of all params except given.
 *
 * @param {String} url Url that might contain query string.
 * @param {Array} leaveParams [optional] Paremeters object with values which should be preserved.
 * @returns {String} Stripped down URL.
 */
RequestHelper.stripAllParams = function(url, leaveParams) {
	if (typeof(leaveParams) != 'object') {
		leaveParams = [];
	}
	return url.replace(/([?&])([^=]+)=([^&]*)/g, function(a, separator, name){
		if (leaveParams.indexOf(name)) {
			return (separator == '&') ? '' : separator;
		}
		return a;
	});
};

/**
 * Build parameters object from query string and insert new params.
 *
 * Note! If object `newParams` is given it's contents will be changed!
 *
 * @param {String} url Url that might contain query string.
 * @param {Object} newParams [optional] New paremeters object with values which will be inserted in resulting object.
 * @returns {Object} Paremetrs {'name':'value',...}.
 */
RequestHelper.mergeParams = function(url, newParams) {
	if (typeof(newParams) != 'object') {
		newParams = {};
	}
	url.replace(/[?&]([^=]+)=([^&]*)/g, function(a, name, value){
		if (!(name in newParams)) {
			newParams[name] = value;
		}
	});
	return newParams;
};

/**
 * Build query string from given parameters.
 * @param {Object} params Paremetrs {'name':'value',...}.
 * @returns {String} Query string with all params properly encoded.
 */
RequestHelper.buildQueryString = function(params) {
	var paramsArray = [];
	for (var name in params) {
		var value = params[name];
		paramsArray.push(encodeURIComponent(name) + "=" + encodeURIComponent(value));
	}
	return "?" + paramsArray.join("&");
};