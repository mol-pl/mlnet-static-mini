/* global Ext */

/**
 * Kontroler karty Opracowanie > Opisy
 */
Ext.define('Molnet.controller.cataloguing.index.IndexController', {
	extend: 'Ext.app.Controller',
	stores: [
		'document.IndexStore',
	],
	views: [
		'cataloguing.index.IndexPanel',
		'cataloguing.index.IndexGrid',
		'cataloguing.index.IndexDocumentGrid',
		'cataloguing.index.IndexPanelWindow'
	],
	init: function() {
		this.control({
			'indexgrid *': {
				showholdingsummation: this.showHoldingSummation
			},
		});
		
	},
	
	/**
	 * Opens window with holdings summation and configures its view model.
	 * 
	 * @param {Ext.grid.Panel} grid
	 * @param {Ext.data.Model} record
	 */
	showHoldingSummation: function(grid, record) {
		(Ext.first('holdingssummationwindow') || 
			Ext.widget('holdingssummationwindow'))
	}
});
