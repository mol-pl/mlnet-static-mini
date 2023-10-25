/* global Ext, Molnet */

// assign some custom platform tags for `platformConfig` property
Ext.platformTags.themes = {};
Ext.platformTags.themes[Ext.theme.name] = true;

// fake i18n
String.prototype.i18n = function(key) {
	return key !== 'string' ? '' : key.replace(/.+\./, '');
}

//Load application prerequisites
Ext.require('Molnet.Connection');
		
Ext.require('Molnet.Settings');

//Run application
Ext.application('Molnet.Application');
