/**
 * Pesel parser and validator.
 *
 * ~singleton/helper.
 * 
 * LMS - RZ#6046 Obsługa walidacji PESEL w LMS (Szyfrowanie PESEL) REQ1368
 */
function PeselParser() {
}

/**
 * Full validation.
 *
 * Validate pesel by length, control number and date.
 *
 * @param {String} pesel Pesel string.
 * @returns {Boolean}
 */
PeselParser.validate = function(pesel) {
	return PeselParser.validateControlNumber(pesel)
		&& PeselParser.validateDate(pesel);
};

/** Check generic conformity and control number. */
PeselParser.validateControlNumber = function(pesel) {
	if (typeof pesel != 'string' || pesel.length !== 11 || isNaN(pesel)) {
		return false;
	}
	var weight = [1, 3, 7, 9, 1, 3, 7, 9, 1, 3];
	var sum = 0;
	var controlNumber = parseInt(pesel.substring(10, 11));

	for (var i = 0; i < weight.length; i++) {
		sum += (parseInt(pesel.substring(i, i + 1)) * weight[i]);
	}
	sum = sum % 10;
	return (10 - sum) % 10 === controlNumber;
},

/** Parse and validate date part of pesel. */
PeselParser.validateDate = function(pesel) {
	var dateParts = PeselParser.getDateParts(pesel);
	return PeselParser.validateDateParts(dateParts);
};

/**
 * Extract date from pesel.
 *
 * @param {String} pesel Pesel string.
 * @returns {Date}
 */
PeselParser.getDate = function(pesel) {
	var dateParts = PeselParser.getDateParts(pesel);
	if (PeselParser.validateDateParts(dateParts)) {
		return new Date(dateParts.year, dateParts.month - 1, dateParts.day);
	}
	return null;
};

/** Check if date parts form a valid date. */
PeselParser.validateDateParts = function(dateParts) {
	var date = new Date(dateParts.year, dateParts.month - 1, dateParts.day);

	// when month is greater than 11 then is overflow and change year
	// the same behaviour is for day and month
	return date.getFullYear() === dateParts.year
		&& date.getMonth() === dateParts.month - 1
		&& date.getDate() === dateParts.day;
}

/**
 * Extract date information from pesel.
 *
 * @param {String} pesel Pesel string.
 * @returns {Object} {
		day: int,
		month: int,
		year: int,
	}
 */
PeselParser.getDateParts = function(pesel) {
	// DAY
	var day = parseInt(pesel.substring(4, 6), 10);

	// MONTH
	var monthPart = parseInt(pesel.substring(2, 4), 10);
	var month = monthPart % 20;

	// YEAR
	var yearPart = parseInt(pesel.substring(0, 2), 10);
	var centuryCode = monthPart - month;

	var year = yearPart;
	if (centuryCode === 80) {
		year += 1800;
	} else if (centuryCode === 0) {
		year += 1900;
	} else if (centuryCode === 20) {
		year += 2000;
	} else if (centuryCode === 40) {
		year += 2100;
	} else if (centuryCode === 60) {
		year += 2200;
	}

	return {
		day: day,
		month: month,
		year: year,
	};
};

if (typeof module === 'object' && module.exports) {
	module.exports = PeselParser;
}