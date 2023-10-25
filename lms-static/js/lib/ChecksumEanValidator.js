/**
 * EAN numbers (ISBN/ISSN) validators.
 * 
 * @param {type} checksumLength
 * @returns {ChecksumEanValidator}
 */
function ChecksumEanValidator(checksumLength) {
	this.checksumLength = checksumLength;
}

ChecksumEanValidator.prototype.validate11Checksum = function(value) {
	var digitCount = value.length;
	var sum = 0;
	for (var i=0; i<digitCount; i++) {
		var digit = (value[i] === 'X' && i === digitCount-1) ? 10 : parseInt(value[i]);
		sum += digit * (digitCount-i);
	}
	return sum % 11 === 0;
};

ChecksumEanValidator.prototype.validateEAN = function(value) {
	var check = 0;
	for (var i = 0; i < 13; i += 2) {
		check += parseInt(value[i]);
	}
	for (var i = 1; i < 12; i += 2){
		check += 3 * parseInt(value[i]);
	}
	return check % 10 === 0;
};

ChecksumEanValidator.prototype.validate = function(val) {
	var reg = /(\d+-?)*[\dX]/gi;
	var result;
	while ((result = reg.exec(val)) !== null) {
		var clean = result[0].replace(/[-\s]/g, '');
		switch (clean.length) {
			case this.checksumLength: 
				if (this.validate11Checksum(clean)) {
					return true;
				}
			break
			case 13:
				if (this.validateEAN(clean)) {
					return true;
				}
			break
		}
	}
	return false;
};

ChecksumEanValidator.isbn = new ChecksumEanValidator(10);
ChecksumEanValidator.issn = new ChecksumEanValidator(8);

if (typeof module === 'object' && module.exports) {
	module.exports = ChecksumEanValidator;
}