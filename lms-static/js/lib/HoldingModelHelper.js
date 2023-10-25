
/* global Ext */

HoldingModelHelper = function() {
};

/**
 * Tworzy wartość nowego pola "volumeIssue" dla zeszytu/rocznika w modelu HoldingItem.
 * @param {type} record element listy zasobów z modelu HoldingItem
 * @returns {String} 
 */
HoldingModelHelper.createVolumeIssue = function(record) {
	var volume = record.get('volume'), issue = record.get('issue');
	if (volume && issue) {
		return volume + '/' + issue;
	} else if (issue) {
		return issue;
	} else {
		return volume;
	}
};

/**
 * Tworzy wartość dla pierwszej kolumny "Zeszyt" listy zasobów czasopism.
 * @param {type} record element listy zasobów z modelu HoldingItem
 * @param {type} value wartość pola "VolumeIssue" z modelu HoldingItem danego rekordu
 * @returns {@exp;record@call;get}
 */
HoldingModelHelper.createVolumeIssueCol = function(record, value) {
	if (record.get('itemType') === 1) {
		if (!record.get('parentVolume')) {
			return value;
		} else {
			return record.get('issue');
		}
	} else {
		return value;
	}
};

/**
 * Zamienia cenę na format odpowiedni do lokalizacji tłumaczeń.
 * Ustawia odpowiedni separator dziesiętny, część groszową i walutę.
 * 
 * @param {type} price cena do transformowania
 * @param {type} currency waluta (nieobowiązkowa)
 * @returns {String} prztłumaczony format ceny
 */
HoldingModelHelper.createLocalizedPriceText = function(price, currency) {
	if (price && price !== '') {
		var priceFormatted = Ext.util.Format.number(price, '0,0.00');
		if (currency) {
			priceFormatted = priceFormatted + " " + currency;
		}
		return priceFormatted;
	}
	return '';
};