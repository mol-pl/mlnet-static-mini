/**
 * @class MarcUtils
 *
 * @todo Wydzielić do osobnego skryptu i dorobić ładowanie (nie extować tej klasy! - potencjalnie do OPAC).
 */
function MarcUtils() {
	// przyszłościowo
	this.type = 'usmarc';
}
/**
 * Otaczanie wybranych elementów składni elementami HTML.
 *
 * @param {String} marc Kod MARC
 * @returns {String} Kod HTML gotowy do podświetlania składni.
 */
MarcUtils.prototype.getSyntaxedHtml = function(marc) {
	if (marc.search(/\s*</)==0 || marc.indexOf('<marcxml:record')>=0) {
		return '<pre style="margin:0">'+this._encodeHtml(marc.replace(/></g, '>\n<'))+'</pre>';
	} else {
		return this.marc21ToHtml(marc);
	}
};

/**
 * Format MARC21 code as HTML.
 * @param {String} marc MARC string.
 * @returns {String} HTML ready for code highlighting.
 */
MarcUtils.prototype.marc21ToHtml = function(marc) {
	marc = marc.replace(/(?:^|\s)([0-9]{3})(..)(.+(?:\s+\$.+)*)/g, function(a, fieldNumber, indicator, subfields) {
		subfields = subfields.replace(/(^|\s)(\$[0-9a-z])/g, '$1<span class="marc-subfield-code">$2</span>');
		return '\n'
				+ '<div class="marc-field marc-field-' + fieldNumber + '">'
				+ '<span class="marc-field-number">' + fieldNumber + '</span>'
				+ '<span class="marc-indicator">' + indicator + '</span>'
				+ '<span class="marc-subfields">' + subfields + '</span>'
				+ '</div>'
		;
	});
	return marc;
};

/**
 * Function escapes HTML string to entities (htmlspecialchars).
 * @param  {String} str Original string.
 * @return {String} string with all special characters escaped.
 */
MarcUtils.prototype._encodeHtml = function (str) {
	if (typeof str === typeof " ") {
		str = str
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/'/g, "&#39;")
			.replace(/\"/g, "&quot;")
		;
	}
	return str;
};