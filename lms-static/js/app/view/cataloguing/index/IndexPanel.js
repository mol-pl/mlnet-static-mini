Ext.define('Molnet.view.cataloguing.index.IndexPanel', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.indexpanel',
	config: {
		isBibliography: true
	},
	
	layout: 'border',
	tbar: {
		items: [
			'->',
			{
				itemId: 'newDocument',
				text: 'I18n.Cataloguing.Document.Create',
				iconCls: 'ui-silk ui-silk-add',
				menu: [{
					text: 'I18n.Cataloguing.Document.Book',
					iconCls: 'document-type icon book',
					docType: 0
				}, {
					text: 'I18n.Cataloguing.Document.Movie',
					iconCls: 'document-type icon movie',
					docType: 1
				}, {
					text: 'I18n.Cataloguing.Document.EDocument',
					iconCls: 'document-type icon edocument',
					docType: 2
				},]
			},
		]
	},
	items: [{
		xtype: 'indexdocumentgrid',
		region: 'center',
		flex: 3,
	}, {
		xtype: 'indexgrid',
		region: 'west',
		split: true,
		flex: 1,
	}]
});
