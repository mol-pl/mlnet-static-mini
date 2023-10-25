/* global Ext */

Ext.define('Molnet.view.BrowserNavigationHandler', {
	singleton: true,
	beforeUnloadText: 'I18n.BrowserNavigation.LeavingPage.Warning',
	warnBeforeUnload: false,
	constructor: function() {
		Ext.getDoc().on('keydown', this.onKeyDown, this);
		Ext.getWin().on('beforeunload', this.onBeforeUnload, this);
	},
	onKeyDown: function(e, t) {
		if (e.getKey() === e.BACKSPACE && (!/^(input|textarea)$/i.test(t.tagName) || t.disabled || t.readOnly)) {
			e.stopEvent();
		}
	},
	onBeforeUnload: function(e) {
		if (this.warnBeforeUnload) {
			return e.browserEvent.returnValue = this.beforeUnloadText;
		}
	},
	reload: function() {
		this.warnBeforeUnload = false;
		window.location.reload();
	},
	startReloadTracking: function() {
		this.warnBeforeUnload = true;
	}
});
