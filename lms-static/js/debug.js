/*
 * Skrypty konfigurujące środowisko developmentu. Plik musi być załączony PRZED app.js
 */

/* global Ext */

Ext.Loader.setConfig({
	enabled: true,
	disableCaching: false //umożliwia debugowanie w Chrome
});

// wymuszenie omijania cache na localhost
// @note Nie działa na CSS
// @note Wyłączone dla Chrome przez buga: http://code.google.com/p/chromium/issues/detail?id=242847
if (!Ext.isChrome && location.hostname == 'localhost') {
	Ext.Loader.config.disableCaching = true;
}

/*
if (Ext.isDebugEnabled()) {
	// Domyślnie Ext JS robi `throw` w trybie debug. Nie chcemy tego.
	// Error handling without throwing
	Ext.Error.handle = function(err) {
		if ('msg' in err) {
			Ext.log({
				msg: err.msg,
				level: 'error',
				dump: err,
				stack: true
			});
		}
		else {
			console.error(err);
		}
		return true; // handled
	};
}
*/