/* global Ext */

/**
 * Override konfigurujący połączenie z serwerem. Korzysta ze zmienne globalnej
 * "molnetApiRoot", aby ustawić odpowiednio ścieżki do API.
 */
Ext.define('Molnet.Connection', {
	override: 'Ext.data.Connection',
	setupUrl: function(options, url) {
		var fullUrl = '';
		// non-MOLNET API calls (url = 'http(s)://...')
		if (url.search(/^[a-z]+:\/\//) === 0) {
			fullUrl = url;
		}
		// append API base
		else {
			var apiRoot = window.molnetApiRoot || '';
			fullUrl = apiRoot + url;
		}
		return this.callParent([options, fullUrl]);
	}
});
Ext.Ajax.setDefaultHeaders({
	'Accept': 'application/json'
});
