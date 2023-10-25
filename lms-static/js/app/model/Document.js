Ext.define('Molnet.model.Document', {
	extend: 'Ext.data.Model',
	fields: [
		{
			name: 'id',
			type: 'auto'
		}, {
			name: 'documentType',
			type: 'int'
		}, {
			name: 'title',
			type: 'string'
		}, {
			name: 'responsibilityStatement',
			type: 'string'
		}, {
			name: 'publicationDate',
			type: 'string'
		}, {
			name: 'bibliography',
			type: 'string'
		}, {
			name: 'coverURL',
			type: 'string'
		},
		'id', 'documentType', 'author',
		'subjectEntries', 'authorEntries', 'note', 'isbn', 'issn', 'ukd', 'publicationPlaces', 'publisherNames',
		'coPublications', 'series', 'title', 'titleIndicator', 'titleRemainder',
		'varyingFormTitle', 'responsibilityStatement', 'responsibilityStmtForFile', 'titlePartNumber', 'titlePartName',
		'extent', 'dimensions', 'editionStatement', 'accompanyingMaterial', 'otherPhysicalDetails', 'publicationDate',
		'summary', 'publishingSign', 'signature', 'hostItemTitle', 'publicationYear', 'number', 'pages',
		'scaleStatement', 'coordinatesStatement', 'musicalPresentation', 'fileCharacteristics', 'numeration', 'version',
		'uniformTitleArrangedStatement', 'uniformTitleDateOfWork', 'uniformTitleLanguageOfWork', 'uniformTitleMediumPerformance',
		'uniformTitleMusicKey', 'uniformTitlePartName', 'uniformTitlePartNumber', 'uniformTitleSubheading',
		'uniformTitleTitle', 'uniformTitleTitleIndicator', 'uniformTitleTitleVersion', 'typeOfRecord', 'catalogueDesignation', 'currentPublicationFrequency',
		'url', 'dateOfEntryIntoForce', 'systemControlNumbers', {
			name: 'bnSynchronization',
			type: 'boolean',
			defaultValue: false
		}
	],
	/**
	 * Czy jest bibliografią.
	 * @return {Boolean}
	 */
	isBibliography: function() {
		if (this.get('bibliography') && this.get('bibliography').toString() === 'true') {
			return true;
		}
		return false;
	}
});
