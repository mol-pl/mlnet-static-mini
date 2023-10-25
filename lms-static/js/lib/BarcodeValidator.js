function BarcodeValidator() {}

/** Walidacja kodów kreskowych. */
BarcodeValidator.validate = function(code) {
	// maxLength: 30
	if (code.length > 30) {
		return false;
	}
	// od zera, od liter, od innych znaków
	if (code.search(/^[^1-9]/) === 0) {
		return true;
	}
	// długie ciągi cyfr
	if (code.search(/^[1-9][0-9]{6}/) === 0) {
		return true;
	}
	// więcej niż wyróżnik literowy
	if (code.search(/[a-z][a-z0-9]{4}/i) > 0) {
		return true;
	}
	// znaki specjalne są ok, bo wyróżniki literowe to:
	// `(val) ⇒ /^[a-zA-Z][a-zA-Z0-9]{0,3}$/.test(val)`.
	if (code.search(/[^a-z0-9]/i) > 0) {
		return true;
	}
	return false;
}

if (typeof module === 'object' && module.exports) {
	module.exports = BarcodeValidator;
}