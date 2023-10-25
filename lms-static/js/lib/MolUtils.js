/**
 * @class MolUtils
 */
function MolUtils() {
}

/**
 *
 * @param {Number} time Czas w ms.
 * @return {String} Dni-godziny-minuty-sekundy.
 */
MolUtils.parseMilisecToTimeToEnd = function(time) {
	time /= 1000;
	// Calculate the number of days left
	var days = Math.floor(time / 86400);
	// After deducting the days calculate the number of hours left
	var hours = Math.floor((time - (days * 86400)) / 3600);
	// After days and hours , how many minutes are left
	var minutes = Math.floor((time - (days * 86400) - (hours * 3600)) / 60);
	// Finally how many seconds left after removing days, hours and minutes.
	var sec = Math.floor((time - (days * 86400) - (hours * 3600) - (minutes * 60)));

	var timeString = "";

	if (days >= 1)
		timeString += days + 'D ';
	if (hours > 0 || days > 0)
		timeString += hours + 'h ';
	if (minutes > 0 || hours > 0 || days > 0)
		timeString += minutes + 'm ';
	if (sec > 0 || minutes > 0 || hours > 0 || days > 0)
		timeString += sec + 's';

	return timeString;
};

/**
 * Location based check for production servers.
 *
 * @warning Ta funkcja NIE stanowi żadnego zabezpieczenia!
 * 	Może służyć jedynie do ukrywania/pokazywania rzeczy, które nie powinny być widoczne,
 * 	a NIE takie których użytkownik nie może zobaczyć.
 *
 * @warning This function provides no security whatsover!
 * It can only be used for hiding/showing things that user should not see.
 * It MUST NOT be used to show things that users must not see.
 * 	
 * Should be fastest for main clients (.lib.mol.pl, .molnet.mol.pl etc)
 *
 * 	TODO: Maybe change this to semi-authorisation style later...
 * 	Something like:
 * 	<li>can-have-debug
 * 	<li>should-have-internal-tools
 * 	...
 * 	Or split into serveral fuzzy functions i.e.:
 * 	<li>isNotProductionInstallation meaning we are sure this is not production
 * 	<li>iProductionInstallation meaning we are sure this is not production
 * 	<li>and isNotProductionInstallation || iProductionInstallation is not always true
 * 	
 * @private
 *
 * @param {Object} location hostname and href is checked.
 * @returns {Boolean?} Null when not sure.
 */
MolUtils.isProductionLocation = function(location) {
	// forced production mode
	if (location.href.indexOf('demo=true') > 0) {
		return true;
	}
	// .lib.mol.pl, .molnet.mol.pl etc
	// Note! This is intentionaly a quick 1st check (fast for majority)
	if (location.hostname.indexOf('.mol.pl') > 0) {
		return true;
	}
	// dev.mol.com.pl, prod.mol.com.pl = internal
	if (location.hostname.indexOf('.mol.com.pl') > 0) {
		return false;
	}
	// debug also forces "development" version (`#debug=true` works as well)
	if (location.href.indexOf('debug=true') > 0) {
		return false;
	}
	if (location.hostname === 'localhost') {
		return false;
	}
	if (location.hostname.search(/\.(localhost|local)$/) >= 0) {
		return false;
	}

	return null
}


/**
 * Rough check for production servers.
 *
 * Warning! This function provides no security whatsover!
 * It can only be used for hiding/showing things that user should not see.
 * It MUST NOT be used to show things that users must not see.
 *
 * @returns {Boolean}
 *	Priority is that on production should return true.
 *	Should return false for internal servers, but not a priority.
 */
MolUtils.isProductionInstallation = function(locationMock) {
	var locationShade = typeof locationMock === 'object' ? locationMock : location;
	var result = MolUtils.isProductionLocation(locationShade);
	if (result !== null) {
		return result;
	}
	// would be nice to have trunk force debugging for weird urls... but you can always have `#debug=true`
	/**
	if (document.title.indexOf('-release') > 0) {
		return true;
	}
	// trunk also forces "development" version
	if (document.title.indexOf('-trunk') > 0) {
		return false;
	}
	/**/
	return true;
};

/**
 * Sprawdzenie czy to instalacja testowa (dev/test/local).
 *
 * @waring Ta funkcja NIE stanowi żadnego zabezpieczenia!
 * 	Może służyć jedynie do ukrywania/pokazywania rzeczy, które nie powinny być widoczne,
 * 	a NIE takie których użytkownik nie może zobaczyć.
 *
 * @returns {Boolean} true jeśli jesteśmy na dev.mol.com.pl lub test.mol.com.pl itp.
 */
MolUtils.isTestInstallation = function(locationMock) {
	var locationShade = typeof locationMock === 'object' ? locationMock : location;
	var result = MolUtils.isProductionLocation(locationShade);
	if (result !== null) {
		return !result;
	}
	return false;
};

if (typeof module === 'object' && module.exports) {
	module.exports = MolUtils;
}