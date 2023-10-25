Ext.define('Molnet.view.cataloguing.index.IndexDocumentGrid', {
	extend: 'Ext.grid.Panel',
	alias: 'widget.indexdocumentgrid',
	requires: [
		'Molnet.model.Document',
	],
	config: {
		documentTypes: [],
		isBibliography: true,
		/**
		 * @cfg {Ext.data.Model} indexRecord
		 * Current index context.
		 */
		indexRecord: null,

		/**
		 * @cfg {String} [indexType="author"]
		 * Index type.
		 */
		indexType: 'author',
	},
	
	border: false,
	store: {
		model: 'Molnet.model.Document',
		"data": [
			{
				"id": 3354,
				"author": "Gromek, Monika",
				"title": "Lekcja muzyki 4",
				"titleRemainder": "Podręcznik do muzyki dla klasy czwartej szkoły podstawowej",
				"publicationDate": "2020",
				"numeration": "",
				"urlText": "lekcja_muzyki_4_3354",
				"documentType": 0,
				"docType": "book",
				"titlePartNumber": "",
				"responsibilityStatement": "Monika Gromek, Grażyna Kilbach",
				"publisherNames": "Nowa Era",
				"publicationPlaces": "Warszawa",
				"bibliography": false,
				"hasHoldings": true
			}
		],
		proxy: {
			type: 'memory'
		}
	},
	indexName: undefined,
	indexEntryId: undefined,
	columns: [{
		text: 'I18n.Cataloguing.AuthorEntry.DocumentGrid',
		dataIndex: 'author',
		flex: 2,
		filter: true
	}, {
		text: 'I18n.Cataloguing.Document.Title',
		dataIndex: 'title',
		flex: 2,
		filter: true
	}, {
		text: 'I18n.Cataloguing.Document.PublicationDate',
		dataIndex: 'publicationDate',
		flex: 1,
		filter: true
	}, {
		xtype: 'actioncolumn',
		itemId: 'generalActions',
		hideable: false,
		text: 'I18n._Actions',
		width: 200,
		sortable: false,
		menuDisabled: true,
		items: [{
			tooltip: 'I18n._Remove',
			iconCls: 'ui-silk ui-silk-delete',
			handler: function() {
				Ext.MessageBox.confirm('Confirm?', 'Say no or press ESC.');
			}
		}]
	}],
});
