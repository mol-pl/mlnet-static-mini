/**
 * Cutting the mustard test aka browser features compatbility check.
 * 
 * Inspired by a test of BBC site programmers, which tested for major features missing in IE.
 * 
 * This test is aimed for Windows XP browsers and IE. 
 * 
 * FF 52.0, 2017-03-07 (last on XP)
 * Ch 49.0, 2016-03-02 (last on XP)
 * 
 * IE 11.0, 2013
 * Microsoft Edge the 1st, 2015
 * Microsoft Edge-Chromium, 2019-04
 *
 * Note: Main source code and unit tests in MOL NET+ OPAC.
 *
 * Author: Maciej Nux Jaros.
 * License: MIT or CC-BY.
 */
function MustardCutTest(initOptions) {
	this.options = {
		/** Base name for state preservation. */
		stateName: 'MustardCutTest',
		/** Next check time [h]. */
		recheckDelay: 16,
		/** User agent for a mock. */
		mockOld: '',
	}

	if (typeof initOptions === 'object') {
		if ('mockOld' in initOptions) this.options.mockOld = initOptions.mockOld;
		if ('stateName' in initOptions) this.options.stateName = initOptions.stateName;
		if ('recheckDelay' in initOptions) this.options.recheckDelay = initOptions.recheckDelay;
	}
}

/**
 * Check if the browser cuts the mustard.
 */
MustardCutTest.prototype.isModern = function() {

	// test
	if (this.options.mockOld.length) {
		return false;
	}

	// ES6 (2015)
	if (false
		|| (typeof String.prototype.startsWith !== 'function')
		|| (typeof String.prototype.includes !== 'function')
		|| (typeof Array.from !== 'function')
		|| (typeof Array.prototype.includes !== 'function')
	) {
		return false;
	}
	
	// ES2017
	// Interestingly Object.values is Chrome54+, so not on Chrome XP, but is in FF XP.
	// (not to be confused with Object.keys which is availble since IE9).
	if (false
		|| (typeof Object.values !== 'function')
		|| (typeof Object.entries !== 'function')
	) {
		return false;
	}
	
	// ES2018, but was implemented fast
	// technically flatMap is ES2019, but implemented in 2018 in FF, Ch, Sa.
	if (false
		|| (typeof Promise !== 'function' || typeof Promise.prototype.finally !== 'function')
		|| (typeof Array.prototype.flatMap !== 'function')
	) {
		return false;
	}
	
	return true;
}

/**
 * Short info about current user agent (use only for old browsers).
 * 
 * Note! This is designed just to display a more accurate message.
 * DO NOT use this to detect features.
 * 
 * Note that in Chrome and FF v100 browsers started to present fake user agent.
 * But we don't care as we only check old browsers here.
 * 
 * @returns {Array} Strings that can be used as classes.
 */
MustardCutTest.prototype.agentClasses = function(prefix) {
	var agent = navigator.userAgent;
	if (this.options.mockOld.length) {
		agent = this.options.mockOld;
	}
	var agentInfo = this.parseAgentClasses(agent, prefix);
	return agentInfo;
}

/**
 * Short info about given user agent.
 * 
 * Old browsers:
 * <li>Mozilla/5.0 (Windows NT 6.1; WOW64; rv:52.0) Gecko/20100101 Firefox/52.0
 * <li>Mozilla/5.0 (Windows NT 5.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.112 Safari/537.36
 * 
 * IE:
 * <li>XP:    Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 5.1; Trident/4.0)
 * <li>Vista: Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.0; Trident/4.0)
 * <li>Win7:  Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.1; Trident/4.0)
 * <li>Win10: Mozilla/5.0 (Windows NT 10.0; Trident/7.0; rv:11.0) like Gecko
 */
MustardCutTest.prototype.parseAgentClasses = function(agent, prefix) {
	if (typeof prefix != 'string') {
		prefix = 'mustard-';
	}
	var agentInfo = [];

	// system
	if (agent.indexOf('Windows NT') >= 0) agentInfo.push(prefix+'windows')
	if (agent.indexOf('Windows NT 5.') >= 0) agentInfo.push(prefix+'windows-xp')

	// browser
	if (agent.indexOf('Trident/') >= 0) agentInfo.push(prefix+'trident')
	else if (agent.indexOf('Firefox/') >= 0) agentInfo.push(prefix+'firefox')
	else if (agent.indexOf('Chrome/') >= 0) agentInfo.push(prefix+'chrome')

	return agentInfo;
}

/**
 * Save shown state.
 */
MustardCutTest.prototype.shown = function() {
	var name = 'js_' + this.options.stateName;
	// max-age [seconds]
	var age = this.options.recheckDelay * 3600;
	document.cookie=name+'=1; path=/; max-age='+age;
}
/**
 * Was message shown.
 * @returns true if message was shown recently.
 */
MustardCutTest.prototype.wasShown = function() {
	var name = 'js_' + this.options.stateName;
	return (document.cookie.indexOf(name+"=1")!=-1);
}

//
// For testing / Node.js.
if (typeof module !== 'undefined' && 'exports' in module) {
	module.exports = MustardCutTest;
}