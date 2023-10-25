/* global MarcTemplates, Ext */

function DocumentPreviewUtils() {
	this.i18nMap = {
		documentType: 'I18n.Cataloguing.Document.Type',
		authorEntries: 'I18n.Cataloguing.AuthorEntries',
		subjectEntries: 'I18n.Cataloguing.SubjectEntries',
		note: 'I18n.Cataloguing.Document.Notes',
		isbn: 'I18n.Cataloguing.Document.ISBN',
		ukd: 'I18n.Cataloguing.Document.UKD',
		publicationPlaces: 'I18n.Cataloguing.Document.PublicationPlaces',
		publisherNames: 'I18n.Cataloguing.Document.PublisherNames',
		coPublications: 'I18n.Cataloguing.Document.CoPublications.Title',
		series: 'I18n.Cataloguing.Document.Series.Title',
		title: 'I18n.Cataloguing.Document.Title.Text',
		titleRemainder: 'I18n.Cataloguing.Document.TitleRemainder',
		varyingFormTitle: 'I18n.Cataloguing.Document.VaryingFormTitle',
		responsibilityStatement: 'I18n.Cataloguing.Document.ResponsibilityStatement',
		titlePartNumber: 'I18n.Cataloguing.Document.TitlePartNumber',
		titlePartName: 'I18n.Cataloguing.Document.TitlePartName',
		extent: 'I18n.Cataloguing.Document.Extent',
		dimensions: 'I18n.Cataloguing.Document.Dimensions',
		editionStatement: 'I18n.Cataloguing.Document.EditionStatement',
		accompanyingMaterial: 'I18n.Cataloguing.Document.AccompanyingMaterial',
		otherPhysicalDetails: 'I18n.Cataloguing.Document.OtherPhysicalDetails',
		publicationDate: 'I18n.Cataloguing.Document.PublicationDate',
		dateOfEntryIntoForce: 'I18n.Cataloguing.Document.DateOfEntryIntoForce',
		summary: 'I18n.Cataloguing.Document.Summary',
		fileCharacteristics: 'I18n.Cataloguing.Document.FileCharacteristics',
		typeOfRecord: 'I18n.Cataloguing.Document.TypeOfRecord',
		physicalDescription: 'I18n.Cataloguing.Document.PhysicalDescription',
		publisher: 'I18n.Cataloguing.Document.Published',
		titlePart: 'I18n.Cataloguing.Document.TitlePart',
		signature: 'I18n.Cataloguing.Document.Signature',
		numeration: 'I18n.Cataloguing.Document.Numeration',
		issn: 'I18n.Cataloguing.Document.Issn',
		catalogueDesignation: 'I18n.Cataloguing.Document.CatalogueDesignation',
		uniformedTitle: 'I18n.Cataloguing.Document.UniformedTitle',
		uniformTitleTitle: 'I18n.Cataloguing.Document.UniformedTitleTitle',
		uniformTitleTitleIndicator: 'I18n.Cataloguing.Document.UniformTitle.TitleIndicator',
		uniformTitlePartNumber: 'I18n.Cataloguing.Document.UniformTitle.PartNumber',
		uniformTitlePartName: 'I18n.Cataloguing.Document.UniformTitle.PartName',
		uniformTitleMusicKey: 'I18n.Cataloguing.Document.UniformTitle.MusicKey',
		uniformTitleLanguageOfWork: 'I18n.Cataloguing.Document.UniformTitle.LanguageOfWork',
		uniformTitleArrangedStatement: 'I18n.Cataloguing.Document.UniformTitle.ArrangedStatement',
		uniformTitleDateOfWork: 'I18n.Cataloguing.Document.UniformTitle.DateOfWork',
		uniformTitleSubheading: 'I18n.Cataloguing.Document.UniformTitle.Subheading',
		uniformTitleTitleVersion: 'I18n.Cataloguing.Document.UniformTitle.TitleVersion',
		uniformTitleMediumPerformance: 'I18n.Cataloguing.Document.UniformTitle.MediumPerformance',
		publicationYear: 'I18n.Cataloguing.Document.PublicationYear',
		storeResponsibilityStatement: 'I18n.Cataloguing.Document.ResponsibilityStatement',
		hostItemAuthor: 'I18n.Cataloguing.Document.HostItem.Author',
		hostItemEdition: 'I18n.Cataloguing.Document.HostItem.Edition',
		hostItemPlace: 'I18n.Cataloguing.Document.HostItem.Place',
		hostItemLocation: 'I18n.Cataloguing.Document.HostItem.Location',
		hostItemPhysicalDescription: 'I18n.Cataloguing.Document.HostItem.PhysicalDescription',
		hostItemSeries: 'I18n.Cataloguing.Document.HostItem.Series',
		hostItemNote: 'I18n.Cataloguing.Document.HostItem.Note',
		hostItemTitle: 'I18n.Cataloguing.Document.HostItem.Title',
		hostItemIssn: 'I18n.Cataloguing.Document.HostItem.ISSN',
		hostItemIsbn: 'I18n.Cataloguing.Document.HostItem.ISBN',
		number: 'I18n.Cataloguing.Document.Number',
		pages: 'I18n.Cataloguing.Document.Pages',
		scaleStatement: 'I18n.Cataloguing.Document.ScaleStatement',
		musicalPresentation: 'I18n.Cataloguing.Document.MusicalPresentation',
		version: 'I18n.Cataloguing.Document.UniformTitle.TitleVersion',
		publishingSign: 'I18n.Cataloguing.Document.PublishingSign',
		coordinatesStatement: 'I18n.Cataloguing.Document.CoordinatesStatement',
		currentPublicationFrequency: 'I18n.Cataloguing.Document.currentPublicationFrequency',
		url: 'I18n.Cataloguing.Document.URL'
	};
	this.orderList = [
		'documentTypeId', // 
		'documentType',
		'typeOfRecord', // klasyfikacja opisu
		'authorEntries',
		'title',
		'titlePart',
		'varyingFormTitle',
		'uniformedTitle',
		'coPublications',
		'publisher',
		'publicationPlaces',
		'publisherNames',
		'publicationYear',
		'publicationDate',
		'editionStatement', // (250 a) – ks.dok. film. dok. el. dok. kart.druk muz.czas.
		'hostItemAuthor',
		'hostItemTitle',
		'hostItemEdition',
		'hostItemPlace',
		'hostItemLocation',
		'hostItemPhysicalDescription',
		'hostItemSeries',
		'hostItemNote',
		'hostItemIssn',
		'hostItemIsbn',
		'number', //  (773g) //-  tylko dla kart. zrt. z czas, kart. odr. praca
		'fileCharacteristics', //(256a) – tylkko dla dok. el.
		'numeration', //(362a) – tylko dla czasopisma
		'musicalPresentation',
		'currentPublicationFrequency',
		'physicalDescription',
		'pages',
		'scaleStatement',
		'coordinatesStatement',
		'isbn',
		'publishingSign',
		'issn',
		'catalogueDesignation', // to samo co issn ale musi się inaczej nazywać label
		'subjectEntries',
		'note',
		'url',
		'series',
		'ukd',
		'summary',
		'dateOfEntryIntoForce',
		'signature'
	];
	this.orderListCoPub = [//kolejność pól dla pozycji współwydanej
		'title',
		'responsibilityStatement',
		'authorEntries',
		'uniformTitleTitle',
		'uniformTitleMediumPerformance',
		'uniformTitlePartNumber',
		'uniformTitlePartName',
		'uniformTitleMusicKey',
		'uniformTitleSubheading',
		'uniformTitleTitleVersion',
		'uniformTitleLanguageOfWork',
		'uniformTitleArrangedStatement',
		'uniformTitleDateOfWork'
	];
}

/**
 * @deprecated Do typów dokumentów używać Ext.getStore('documenttypestore');
 */
DocumentPreviewUtils.prototype.documentTypeIdToName = function (id) {
	console.error('documentTypeIdToName used');
	return 'Book';
};
/**
 * @deprecated Do typów dokumentów używać Ext.getStore('documenttypestore');
 */
DocumentPreviewUtils.prototype.documentTypeIdToCss = function (id) {
	console.error('documentTypeIdToCss used');
	return 'book';
};

/**
 *
 * Przygotwuje dane dla szablonu podglądu dokumentu.
 * 
 * @param {Ext.data.Model} record rekord, wartości pobrane z formualrza
 * @param {Ext.data.Model} oldRecord kopia rekordu
 */
DocumentPreviewUtils.prototype.prepareData = function (record, oldRecord) {
	record = this._prepareRecord(record.getData(), oldRecord);

	// have no idea how to check all dates in the record
	// Date.parse() returns Date for something like 'warszawa : Prószyński i S-ka, 1998'
	// looks like we must do it for every date in the record
	if ('dateOfEntryIntoForce' in record) {
		var dateOfApp = Molnet.I18n.formatDate(record.dateOfEntryIntoForce, 'date');
		record.dateOfEntryIntoForce = dateOfApp;
	}
	
	// restore i18n defaults (changed below)
	this.i18nMap.titlePart = 'I18n.Cataloguing.Document.TitlePart';
	this.i18nMap.publishingSign = 'I18n.Cataloguing.Document.PublishingSign';
	// i18n variations for different document types
	switch (record.documentTypeModel.get('codeName')) {
		case 'Book':
			this.i18nMap.titlePart = 'I18n.Cataloguing.Document.TitleVolume';
			break;
		case 'Sound':
		case 'AudioBook':
			this.i18nMap.publishingSign = 'I18n.Cataloguing.Document.CatalogueDesignation';
			break;
	}
	if (Molnet.Settings.get('tenant.decimal_classification') == 'ddc') {
		this.i18nMap.ukd = 'I18n.Cataloguing.Document.Dewey';
	}
	// przepisanie na tablicę mikro-obiektów
	var orderedData = [];
	Ext.Array.forEach(this.orderList, function (key) {
		var object = {};
		object[key] = record[key];
		orderedData.push(object);
	});
	return orderedData;
};
/**
 * @private
 */
DocumentPreviewUtils.prototype._encodeHtml = function (element) {
	if (element === null || element === undefined)
		return element;
	if (element.constructor === String) {
		return Ext.String.htmlEncode(element);
	} else if (Array.isArray(element)) {
		var newArray = [];
		for (var i = 0; i < element.length; i++) {
			newArray[i] = this._encodeHtml(element[i]);
		}
		return newArray;
	} else {
		var encodedObject = new Object();
		for (var name in element) {
			if (element.hasOwnProperty(name)) {
				encodedObject[name] = this._encodeHtml(element[name]);
			}
		}
		return encodedObject;
	}
};

/**
 * Klonowanie obiektu z kluczami wg podanej kolejności.
 *
 * Uwaga! Klucze nie wymienione w `orderedKeys` zostaną pominięte.
 * Klonowanie jest płytkie (jeden stopień).
 *
 * @param {Object} item Obiekt do sklonowania.
 * @param {Array} orderedKeys Tablica kluczy ułożona wg żądanej kolejności.
 * @return {Object} Sklonowany obiekt.
 * @private
 */
DocumentPreviewUtils.prototype._cloneInOrder = function (item, orderedKeys) {
	var newItem = new Object();
	for (var k = 0; k < orderedKeys.length; k++) {
		var key = orderedKeys[k];
		if (key in item) {
			newItem[key] = item[key];
		}
	}
	return newItem;
};

/**
 * Przygotowuje rekord dokumentu.
 * @param {Ext.data.Model} recordArg rekord, wartości pobrane z formualrza
 * @param {Ext.data.Model} oldRecordArg kopia rekordu
 * @private
 */
DocumentPreviewUtils.prototype._prepareRecord = function (recordArg, oldRecordArg) {
	var record = this._encodeHtml(recordArg);
	var oldRecord = this._encodeHtml(oldRecordArg);
	record.documentTypeId = record.documentType;
	record.documentTypeModel = Ext.getStore('documenttypestore').getByIdWithFallback(record.documentType);
	record.documentType = record.documentTypeModel.get('name');

	record.title = MarcTemplates.titleBasic(record);

	record.titlePart = MarcTemplates.titlePart(record);

	var formatedCoPub = [];
	if (Array.isArray(record.coPublications)) {
		for (var i = 0; i < record.coPublications.length; i++) {
			// "sklonowanie" z przepisaniem pól pozycji współwydanej według kolejności
			var coPub = this._cloneInOrder(record.coPublications[i], this.orderListCoPub);
			// formatowanie
			coPub.title = MarcTemplates.coPublication.title(coPub);
			coPub.uniformTitleTitle = MarcTemplates.coPublication.uniformTitleTitle(coPub);
			formatedCoPub[i] = coPub;
		}
	}
	record.coPublications = formatedCoPub;

	// scalamy ze sobą pola (publicationPlaces,publisherNames,publicationDate) w obiekt publisher, pozstałe pola są czyszczone aby xtemlate ich nie wyswietlil
	if (record.documentTypeModel.get('codeName') !== 'Article') {
		if (record.publicationPlaces.length < 2 || record.publisherNames.length < 2) {
			record.publisher = MarcTemplates.publisher(record);
			record.publicationPlaces = "";
			record.publisherNames = "";
			record.publicationDate = "";
		}
	}

	record.physicalDescription = MarcTemplates.physicalDescription(record);
	record.dimensions = "";
	record.otherPhysicalDetails = "";
	record.extent = "";
	record.accompanyingMaterial = "";

	record.series = MarcTemplates.applyToArray(record, 'series');

	record.url = MarcTemplates.applyToArray(record, 'url');
	record.note = MarcTemplates.applyToArray(record, 'note');
	record.summary = MarcTemplates.summary(record);

	var uniformFieldOccured = false;
	var uniformedTitle = new Object();
	uniformedTitle.title = MarcTemplates.uniformTitleTitle(oldRecord);
	for (var k in oldRecord) {
		if (oldRecord.hasOwnProperty(k) && oldRecord[k] && k.indexOf("uniform") != -1) {
			uniformedTitle[k] = oldRecord[k];
			uniformFieldOccured = true;
		}
	}
	if (uniformFieldOccured) {
		record.uniformedTitle = uniformedTitle;
		uniformedTitle.uniformTitleTitle = '';
	} else {
		record.uniformedTitle = "";
	}

	// catalogueDesignation to samo co issn ale musi się inaczej nazywać label, tylko w Dok. muzycznym Oraz Audiobook
	if (record.documentTypeModel.get('codeName') === 'Sound' ||
		record.documentTypeModel.get('codeName') === 'AudioBook') {
		if (record.issn && record.issn != '') {
			record.catalogueDesignation = new String(record.issn).toString();
			record.issn = "";
		}
	}

	return record;
};

// instancja
documentPreviewUtils = new DocumentPreviewUtils();