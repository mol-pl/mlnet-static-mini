/**
 * Simple logger class.
 * 
 * Assuming Firebug style console object is avaiable: http://getfirebug.com/logging
 * BUT it abstracts you from `console` avilabilty and implementation
 * as it will simply not run if the functions are not available.
 * 
 * How it works:
 * ```
 * var LOG = new Logger('function or class name or any other tag');
 * LOG.info('some debug/notice information');
 * LOG.warn('some warning (usually non-critical) information');
 * LOG.error('some error (usually critical) information');
 * ```
 *
 * Note that you can pass any number of arguments and they will be stringified whenever possible.
 * ```
 * data = {"test":123,abc:"def"}
 * LOG.info('the json data:', data);
 * ```
 *
 * Output:
 * ```
 * [tag] the json data:{
 *	"test":123,"abc":"def"
 * }
 * ```
 * 
 * Author: Maciej Jaros
 * Web: http://enux.pl/
 *
 * Licensed under
 *   MIT License http://www.opensource.org/licenses/mit-license
 *   GPL v3 http://opensource.org/licenses/GPL-3.0
 *
 * @param {String} tag Tag to be put in console (e.g. class name).
 * @param {Object|Boolean} levels Preset for enabled levels (true|false for setting all levels).
 * @class Logger
 */
function Logger(tag, levels) {
	/**
	 * Use to disable all levels for this logger instance.
	 */
	this.enabled = true;
	/**
	 * Use to disable levels separately.
	 */
	this.enabledLevels = {
		info : true,
		warn : true,
		error : true
	};
	/**
	 * The tag text.
	 * @private
	 */
	this._tag = tag;
	/**
	 * Use to disable perfmonance logging.
	 */
	this.performanceEnabled = true;
	/**
	 * Tracks performance tick for diffs.
	 * @private
	 */
	this._performancePrevious = 0;

	// setup `_performanceNow` proxy for `performance.now`
	if (this.performanceEnabled) {
		this._performanceNow = (typeof(performance)!='undefined' && 'now' in performance)
		? function () {
			return performance.now();
		}
		// polly for iPhone...
		: function () {
			return (new Date()).getTime();
		};
		this._performancePrevious = this._performanceNow();
	}
	
	this._initEnabled(levels);
}

/**
 * Init enabled levels.
 * @param {Object|Boolean} levels Preset for enabled levels (true|false for setting all levels).
 */
Logger.prototype._initEnabled = function (levels) {
	if (typeof(levels) === 'boolean') {
		this.enabled = levels;
	}
	else if (typeof(levels) === 'object') {
		for (var level in levels) {
			this.enabledLevels[level] = levels[level] ? true : false;
		}
	}
};

/**
 * Check if logging is enabled for certain level.
 *
 * @param {String} level info|warn|error
 * @returns {Boolean} true if enabled
 */
Logger.prototype.isEnabled = function (level) {
	if (!this.enabled || typeof(console) === 'undefined'
		|| typeof(console.log.apply) !== 'function') {
		return false;
	}
	var enabled = false;
	switch (level) {
		case 'info':
			if ('log' in console) {
				enabled = this.enabledLevels.info;
			}
		break;
		case 'warn':
			if ('warn' in console) {
				enabled = this.enabledLevels.warn;
			}
		break;
		case 'error':
			if ('error' in console) {
				enabled = this.enabledLevels.error;
			}
		break;
	}
	return enabled;
};

/**
 * Attempts to create a readable string from about anything.
 *
 * DANGEROUS! Might fall into loops and is not very good for large objects.
 *
 * @private
 *
 * @param {mixed} variable Whatever to parse.
 * @returns {String}
 *
Logger.prototype._variableToReadableString = function (variable) {
	var text = variable;
	if (typeof(text) == 'undefined') {
		text = '[undefined]';
	}
	else if (typeof(text) != 'string') {
		try {
			text = JSON.stringify(text);
		} catch (e) {
			try {
				text = JSON.stringify(JSON.decycle(text, true));
			} catch (e) {
				text = text.toString();
			}
		}
		text = text
				.replace(/","/g, '",\n"')			// this should also work when a value is JSON.stringfied
				.replace(/\{"/g, '{\n"')
				.replace(/"\}(?=[,}]|$)/g, '"\n}')	// this should also work when a value is JSON.stringfied
		;
	}
	return text;
};

/**
 * Render arguments for display in console.
 *
 * @private
 *
 * @param {Array} argumentsArray
 *		This is either arguments array or a real Array object
 *		(see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions_and_function_scope/arguments).
 * @returns {String}
 *
Logger.prototype._renderArguments = function (argumentsArray) {
	var text = "";
	for (var i = 0; i < argumentsArray.length; i++) {
		text += this._variableToReadableString(argumentsArray[i]);
	}
	if (this._tag.length) {
		return "["+this._tag+"] " + text;
	}
	return text;
};

/**
 * Call console function prepending logger tag.
 *
 * @private
 *
 * @param {String} functionName Console function name.
 * @param {Array} argumentsArray
 *		This is either arguments array or a real Array object
 *		(see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions_and_function_scope/arguments).
 */
Logger.prototype._callConsole = function (functionName, argumentsArray) {
	var args;
	if (this._tag.length) {
		args = ["["+this._tag+"]"];
	} else {
		args = [];
	}
	// cannot just do `concat` for `Arguments` "array" (so doing manual merge here).
	for (var i = 0; i < argumentsArray.length; i++) {
		args.push(argumentsArray[i]);
	}

	// append stack
	if (this.isEnabled('info')) {
		var stack = this.readStack(3, 2);
		if (stack.length) {
			args.push(stack);
		}
	}

	console[functionName].apply(console, args);
};

/**
 * Performance info and checkpoint set.
 *
 * @param {String} comment Any comment e.g. tick info/ID.
 */
Logger.prototype.performance = function (comment) {
	if (this.performanceEnabled && this.isEnabled('info')) {
		var now = this._performanceNow();
		this.info(comment, '; diff [ms]: ', now - this._performancePrevious);
		this._performancePrevious = now;
	}
};

/**
 * Informational text, notice.
 *
 * @note All arugments are converted to text and passed to console.
 */
Logger.prototype.info = function () {
	if (this.isEnabled('info')) {
		this._callConsole('log', arguments);
	}
};

/**
 * Warning text.
 *
 * @note All arugments are converted to text and passed to console.
 */
Logger.prototype.warn = function () {
	if (this.isEnabled('warn')) {
		this._callConsole('warn', arguments);
	}
};

/**
 * Error text.
 *
 * @note All arugments are converted to text and passed to console.
 */
Logger.prototype.error = function () {
	if (this.isEnabled('error')) {
		this._callConsole('error', arguments);
	}
};

/**
 * Log stack information.
 */
Logger.prototype.logStack = function (skipLines, maxLines) {
	if (!this.isEnabled('info')) {
		return; // info not enabled/available
	}
	var stack = this.readStack(skipLines, maxLines);
	if (stack.length) {
		console.log(stack);
	}
};
/**
 * Read stack information.
 *
 * Note, should auto-skip Chrome's stack header and only get actual stack lines.
 * Each lines should be a different point in code (function call).
 *
 * @param {Number} skipLines Initial lines (function calls) to skip.
 * @param {Number} maxLines Number of lines that should be returned.
 * @returns {String} Stack lines (function calls).
 */
Logger.prototype.readStack = function (skipLines, maxLines) {
	var err = new Error;
	if (typeof err.stack !== 'string') {
		return '';	// not supported
	}
	var stack = err.stack;
	// skip extra line for Chrome (Error at...)
	if (stack.search(/^Error\n\s+at\s/)===0) {
		skipLines++;
	}
	var lineIndex = skipLines == 0 ? 0 : this._indexOfNth(stack, '\n', 0, skipLines);
	if (lineIndex > 0) {
		var endIndex = this._indexOfNth(stack, '\n', lineIndex+1, maxLines);
		if (endIndex < 0) {
			endIndex = stack.length;
		}

		stack = stack.substring(lineIndex, endIndex);
	}
	return stack;
};
/**
 * _indexOfNth ("a1,a2,a3", 'a', 0, 2) -> 3
 * @private
 */
Logger.prototype._indexOfNth = function (text, searchString, start, n) {
	var len = text.length;
	var i = start - 1;
	while(n-- && i++ < len){
		i = text.indexOf(searchString, i);
		if (i < 0) break;
	}
	return i;
};
