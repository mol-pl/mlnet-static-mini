/* global Ext */

/**
 * Przeniesienie zasobów.
 * @type Ext.window.Window
 */
Ext.define('Molnet.view.cataloguing.index.IndexPanelWindow', {
	extend: 'Ext.window.Window',
	alias: 'widget.indexpanelwindow',
	layout: 'border',
	width: 800,
	height: 600,
	border: false,
	title: 'I18n.Cataloguing.Holdings.IndexPanelWindowTitle',
	modal: true,
	autoShow: true,
	holdingsToMoveIds: [], //identyfikatory zasobów jakie mają być przeniesione do innego opisu
	platformConfig: {
		'themes.Triton': {
			width: 1200,
			height: 800
		}
	},
	viewModel: {
		data: {
			// should be here to make climbing possible
			indexgridref: null,
			indexpickerref: null,
			indexdocumentgridref: null
			//
		}
	},
	tbar: [{
		xtype: 'documenttypesbuttongroup',
		isBibliography: false
	}],
	items: [{
		xtype: 'indexdocumentgrid',
		selModel: 'rowmodel',
		region: 'center',
		flex: 2,
		isBibliography: false,
		viewModel: {
			data: {
				logicContext: 'documentSwitch'
			}
		},
		bind: {
			documentTypes: '{documenttypesbuttongroupref.documentTypes}',
			indexRecord: '{indexgridref.selection}',
			indexType: '{indexpickerref.selectedIndex.type}'
		},
		platformConfig: {
			'themes.Triton': {
				flex: 6
			}
		}
	}, {
		xtype: 'indexgrid',
		region: 'west',
		split: true,
		flex: 1,
		bind: {
			documentTypes: '{documenttypesbuttongroupref.documentTypes}'
		},
		platformConfig: {
			'themes.Triton': {
				flex: 4
			}
		}
	}]
});
