/* global Ext */
Ext.define('Molnet.view.HoldingsSummationWindow', {
	extend: 'Ext.window.Window',
	alias: 'widget.holdingssummationwindow',
	autoShow: true,
	
	layout: 'fit',
	width: 500,
	height: 300,
	
	title: 'Test',
	
	items: [{
		xtype: 'grid',
		store: {
			fields:[ 'name', 'email', 'phone'],
			data: [
				{ name: 'Lisa', email: 'lisa@simpsons.com', phone: '555-111-1224' },
				{ name: 'Bart', email: 'bart@simpsons.com', phone: '555-222-1234' },
				{ name: 'Homer', email: 'homer@simpsons.com', phone: '555-222-1244' },
				{ name: 'Marge', email: 'marge@simpsons.com', phone: '555-222-1254' }
			]
		},
		columns: [
			{ text: 'Name', dataIndex: 'name' },
			{ text: 'Email', dataIndex: 'email', flex: 1 },
			{ text: 'Phone', dataIndex: 'phone' }
		],
	}]
});