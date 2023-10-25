/**
 * @fileOverview General document detials parsing.
 *
 * @warning This file MUST NOT be moved to different folder! It's used in mapp as an svn:external.
 * @note This library is used in OPAC.
 */

/**
 * @class FieldTemplate is templating engine based on builder pattern. It is configured using provided
 * methods and then template is generated with build() method. Generated templates are just methods
 * that accept the data as the only parameter, and return applied template result.
 * @returns {FieldTemplate}
 */
function FieldTemplate() {
	/**
	 * Array of processors, which are functions of parameters
	 * * templateData - the data to apply template to
	 * * currentValue - accumulated value of template processing
	 * Processors should prepend the currentValue if needed, and return new template result.
	 * @type Array
	 */
	this.processors = [];
}

/**
 * Creates template function from this FieldTemplate object and resets FieldTemplate object.
 * @returns {Function} function that takes template data as parameter and returns applied template result
 */
FieldTemplate.prototype.build = function() {
	var processors = this.processors;
	this.processors = [];
	return function(data) {
		var value = '';
		for (var i = 0; i < processors.length; i++) {
			value = processors[i](data, value);
		}
		return value;
	};
};

/**
 * Adds field processor to the template.
 * @param {String|optional} separator - field separator
 * @param {String} fieldName - name of field to lookup data for
 * @returns {FieldTemplate} this
 */
FieldTemplate.prototype.field = function(separator, fieldName) {
	if (fieldName === undefined) {
		fieldName = separator;
		separator = '';
	}
	this.processors.push(function(data, value) {
		var field = data[fieldName];
		if (!field) {
			return value;
		}
		var sep = (separator == ',' || separator == '.') ? separator + ' ' : ' ' + separator + ' ';
		if (typeof field === 'string') {
			if (!value) {
				value += field;
			} else {
				value += sep + field;
			}
		} else if (Array.isArray(field)) {
			for (var i = 0; i < field.length; i++) {
				if (!value) {
					value += field[i];
				} else {
					value += sep + field[i];
				}
			}
		}
		return value;
	});
	return this;
};

/**
 * Adds title processor to the template.
 * @param {String} fieldName - name of field to lookup data for
 * @param {String|Number} fieldIndicatorName - name of field indicator to lookup data for
 * @returns {FieldTemplate} this
 */
FieldTemplate.prototype.title = function(fieldName, fieldIndicatorName) {
	this.processors.push(function(data, value) {
		var titleIndicator = parseInt(data[fieldIndicatorName]);
		var title = data[fieldName] || '';
		var titleSkip = title.substr(0, titleIndicator);
		var titleEm = title.substr(titleIndicator);
		return value + titleSkip + (titleEm ? '<em>' + titleEm + '</em>' : '');
	});
	return this;
};

/**
 * URL parser changing text to HTML.
 *
 * Rules:
 * <li>`javascript:alert()` and `file://c:/Windows/` will NOT be linked (security threat for users).
 * <li>"abc/def" -> will be treated as an absolute URL - that is `http://abc/def` (we assume this might be internal server URL).
 * <li>"www.abc.pl/def" -> will be treated as an absolute URL - that is `http://www.abc.pl/def`.
 * <li>"/abc/def" -> will be treated as a relative URL - that is to `http://...molnet.mol.pl/abc/def`, but will NOT be linked.
 *	In future (if we start to support storing electronic documents), we might want to add an exception here.
 *	I.e. something like `/file/...` would be linked.
 *
 * @note You should assume `text` already has special HTML characters replaced with entities.
 *
 * @param {String} text Text form link field.
 * @param {Boolean} [asHtml=true] To return as HTML. Otherwise, object containing parsed URL and text will be returned.
 * @returns {String | Object} Output HTML or object containing parsed URL and text.
 */
FieldTemplate.prototype.urlParser = function(text, asHtml) {
	if (typeof asHtml === 'undefined') {
		asHtml = true;
	}
	var url = "";

	// known, safe URI schemas
	if (text.search(/(https?:\/\/|ftp:\/\/|mailto:)/) === 0) {
		url = text;
		text = text.replace(/^\w+:\/\//, '');
	}
	// `javascript:alert()` and `file://c:/Windows/` will NOT be linked (security threat for users).
	else if (text.search(':') >= 0) {
	}
	// "/abc/def" -> will be treated as a relative URL - that is to `http://...molnet.mol.pl/abc/def`, but will NOT be linked.
	else if (text.search('/') === 0) {
	}
	else if (text.search(/\w+/) === 0) {
		url = "http://" + text;
	}

	if (asHtml) {
		// create HTML
		var html = (url.length <= 0) ? text
			: "<a href='"+url+"' target='_blank' rel='noopener'>" + text + "</a>"
		;
		return html;
	}

	return {
		parsedUrl: url,
		text: text
	}
};

/**
 * URL parser for fields that might __contain__ URLs.
 *
 * @note You should assume `text` already has special HTML characters replaced with entities.
 *
 * @param {String} text Text form link field.
 * @returns {String} Output HTML.
 */
FieldTemplate.prototype.urlParserInText = function(text) {
	var html = text;

	// known, safe URI schemas
	html = html.replace(/(https?:\/\/|ftp:\/\/|mailto:)(\S+[^.,:;"'!\(\s])/g, function(url, schema, path){
		return "<a href='"+url+"' target='_blank' rel='noopener'>" + url + "</a>";
	});
		
	return html;
};

/**
 * Creates template that maps each item in field with callback.
 * @param {String} fieldName - name of field to lookup data for
 * @param {Function} callback - mapping function that takes item and returns applied mapping
 * @returns {Function} template method that accepts data, and returns array
 */
FieldTemplate.prototype.each = function(fieldName, callback) {
	return function(data) {
		var values = data[fieldName];
		var value = [];
		if (values) {
			for (var i in values) {
				if (values.hasOwnProperty(i)) {
					value.push(callback(values[i]));
				}
			}
		}
		return value;
	};
};

/**
 * MarcTemplates provides functions generating fields complying to MARC rules.
 * Each function takes single "data" parameter which is full Document object in
 * most cases, and CoPublication object in MarcTemplates.coPublication.* functions.
 *
 * @sa Usage examples: molnet-lms-client\src\main\js\app\controller\cataloguing\document\DocumentPreviewController.js
 * @type Object
 */
var MarcTemplates = (function() {
	var tpl = new FieldTemplate();
	return {
		/**
		 * Render array in a description record.
		 *
		 * @example Belowe will apply `MarcTemplates.series()` template to each item in `record.series` array:
		 * MarcTemplates.applyToArray(record, 'series')
		 *
		 * Note `record[fieldName]` is  expected to be an array,
		 * but if `record[fieldName]` is not set then returned array will simply be empty.
		 *
		 * @param {Array} record
		 * @param {String} fieldName Field name in the record.
		 * @param {String?} templateName Template name to apply (you can skip this if the name is the same as fieldName).
		 * @returns {Array} Array of rendered text.
		 */
		applyToArray: function(record, fieldName, templateName) {
			if (typeof(templateName) != 'string') {
				templateName = fieldName;
			}

			var renders = [];
			if (fieldName in record && Array.isArray(record[fieldName])) {
				var template = this[templateName];
				var arrayField = record[fieldName];
				for (var i = 0; i < arrayField.length; i++) {
					renders.push(template(arrayField[i]));
				}
			}
			return renders;
		},

		//
		// templates
		//
		documentType: tpl.field('documentType').build(),
		typeOfRecord: tpl.field('typeOfRecord').build(),
		title: tpl.title('title', 'titleIndicator').field(':', 'titleRemainder')
			.field('/', 'responsibilityStatement')
			.field('<br>', 'varyingFormTitle').build(),
		// Long form of the title (includes title part). To be used e.g. on lists.
		titleFull: tpl.title('title', 'titleIndicator').field(':', 'titleRemainder')
			.field('.', 'titlePartNumber').field(',', 'titlePartName')
			.field('/', 'responsibilityStatement')
			.field('<br>', 'varyingFormTitle').build(),
		// basic title beign a shorter form of the title (mainly/only used in LMS document preview)
		titleBasic: tpl.title('title', 'titleIndicator').field(':', 'titleRemainder').field('/', 'responsibilityStatement').build(),
		titlePart: tpl.field('titlePartNumber').field(',', 'titlePartName').build(),
		varyingFormTitle: tpl.field('varyingFormTitle').build(),
		coPublication: {
			title: tpl.field('title').field('/', 'responsibilityStatement').build(),
			uniformTitleTitle: tpl.title('uniformTitleTitle', 'uniformTitleTitleIndicator').build(),
			uniformTitleMediumPerformance: tpl.field('uniformTitleMediumPerformance').build(),
			uniformTitlePartName: tpl.field('uniformTitlePartName').build(),
			uniformTitleMusicKey: tpl.field('uniformTitleMusicKey').build(),
			uniformTitleTitleVersion: tpl.field('uniformTitleTitleVersion').build(),
			uniformTitleLanguageOfWork: tpl.field('uniformTitleLanguageOfWork').build(),
			uniformTitleArrangedStatement: tpl.field('uniformTitleArrangedStatement').build(),
			uniformTitleDateOfWork: tpl.field('uniformTitleDateOfWork').build()
		},
		publisher: tpl.field(';', 'publicationPlaces').field(':', 'publisherNames').field(',', 'publicationDate').build(),
		editionStatement: tpl.field('editionStatement').build(),
		// Zawarte w: Tytuł (macierzysty 773t; hostItemTitle)/ Autor (773a; hostItemAuthor)
		hostItem: tpl.field('hostItemTitle').field('/', 'hostItemAuthor')
		//	/ Numer wydania. (773b; hostItemEdition) Adres wydawniczy. (773d; hostItemPlace)
			.field('/', 'hostItemEdition').field('.', 'hostItemPlace')
		//	Lokalizacja. (773g; hostItemLocation) Opis fizyczny. (773h; hostItemPhysicalDescription)
			.field('.', 'hostItemLocation').field('.', 'hostItemPhysicalDescription')
		//	Dane o serii. (773k; hostItemSeries) Uwaga. (773n; hostItemNote)
			.field('.', 'hostItemSeries').field('.', 'hostItemNote')
		//	 ISSN. (773x) ISBN. (773z)
			.field('.', 'hostItemIssn').field('.', 'hostItemIsbn')
			.build()
		,
		physicalDescription: tpl.field('extent').field(':', 'otherPhysicalDetails').field(';', 'dimensions').field('+', 'accompanyingMaterial').build(),
		series: tpl.field('text').field(',', 'issn').field(';', 'number').build(),
		summary: function(record) {
			return 'summary' in record ? tpl.urlParserInText(record['summary']) : '';
		},
		dateOfEntryIntoForce: tpl.field('dateOfEntryIntoForce').build(),
		note: tpl.urlParserInText,
		url: tpl.urlParser,
		coverURL: tpl.field('coverURL').build(),
		scaleStatement: tpl.field('scaleStatement').build(),
		coordinatesStatement: tpl.field('coordinatesStatement').build(),
		uniformTitleTitle: tpl.title('uniformTitleTitle', 'uniformTitleTitleIndicator').build(),
		uniformTitleMediumPerformance: tpl.field('uniformTitleMediumPerformance').build(),
		uniformTitlePartName: tpl.field('uniformTitlePartName').build(),
		uniformTitleMusicKey: tpl.field('uniformTitleMusicKey').build(),
		uniformTitleTitleVersion: tpl.field('uniformTitleTitleVersion').build(),
		uniformTitleLanguageOfWork: tpl.field('uniformTitleLanguageOfWork').build(),
		uniformTitleArrangedStatement: tpl.field('uniformTitleArrangedStatement').build(),
		uniformTitleDateOfWork: tpl.field('uniformTitleDateOfWork').build(),
		musicalPresentation: tpl.field('musicalPresentation').build(),
		publishingSign: tpl.field('publishingSign').build(),
		hostItemTitle: tpl.field('hostItemTitle').build(),
		pages: tpl.field('pages').build(),
		signature: tpl.field('signature').build()
	};
})();

if (typeof module === 'object' && module.exports) {
	module.exports = {
		FieldTemplate: FieldTemplate,
		MarcTemplates: MarcTemplates,
	};
}