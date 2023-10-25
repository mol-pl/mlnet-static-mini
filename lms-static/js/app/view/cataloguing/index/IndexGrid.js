Ext.define('Molnet.view.cataloguing.index.IndexGrid', {
	extend: 'Ext.grid.Panel',
	alias: 'widget.indexgrid',
	requires: [
		'Molnet.view.HoldingsSummationWindow',
	],
	config: {
		documentTypes: []
	},
	
	store: {
		type: 'indexstore',
	},
	columns: {
		items: [
			{
				text: 'I18n.Cataloguing.DictionaryEntry.Text',
				dataIndex: 'text',
				flex: 1,
				resizable: false,
				filter: true,
				renderer: function(value) {
					return Ext.String.htmlEncode(value);
				}
			},
			{
				xtype: 'actioncolumn',
				hideable: false,
				dataIndex: 'actioncolumn',
				width: 72,
				sortable: false,
				resizable: false,
				menuDisabled: true,
				items: [
					{
						tooltip: 'I18n.Cataloguing.Entries.HoldingsSummation',
						iconCls: 'ui-silk ui-silk-sum',
						handler: function(grid, row, col, me, e, record) {
							this.fireEvent('showholdingsummation', grid.ownerCt, record, e);
						}
					}
				]
			}
		]
	},
});
