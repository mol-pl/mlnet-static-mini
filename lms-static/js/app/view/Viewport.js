/* global Ext, Molnet */
Ext.define('Molnet.view.Viewport', {
	extend: 'Ext.container.Viewport',
	requires: [
		'Molnet.view.viewport.CataloguingCard',
	],
	title: 'I18n.ApplicationTitle',
	layout: 'border',
	viewModel: true,
	items: [{
		xtype: 'panel',
		region: 'west',
		layout: {
			type: 'vbox',
			align: 'stretch'
		},
		width: 250,
		platformConfig: {
			'!themes.Triton': {
				hidden: true
			}
		},
		weight: -20,
		style: {
			backgroundColor: '#2c3845'
		},
	}, {
		region: 'center',
		deferredRender: true,
		layout: {
			type: 'card',
			deferredRender: true
		},
		id: 'viewportCards',
		border: false,
		bodyPadding: 5,
		items: [
			{
				xtype: 'cataloguingCard',
				moduleId: 'cataloguing',
				itemId: 'cataloguingCard'
			}
		]
	}]
});
