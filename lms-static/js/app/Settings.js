/* global Ext, MolUtils */

/**
 * Klasa dostępu do ustawień systemu.
 * Przechowuje ustawienia systemowe oraz interfejsowe
 *
 * @see {@link MolUtils} for some extra functions that e.g. check instalation type
 *	e.g. {@link MolUtils.isProductionInstallation()}
 * @see Molnet.UiStateSettings
 */
Ext.define('Molnet.Settings', {
	singleton: true,
	props: {},
	sessionData: null,
	loaded: false,
	url: '/settings',
	
	SYNCHRONIZATION: {
		DISABLED: '0',
		FORTIFIED: '1',
		ENABLED: '2'
	},

	/**
	 * Logger
	 * @returns {Logger}
	 */
	LOG: null,
	
	/**
	 * Inicjowanie klasy.
	 */
	constructor: function() {
		// logger
		this.LOG = new Logger('Molnet.Settings', {
			info : !MolUtils.isProductionInstallation(),
			warn : true,
			error : true
		});
	},
	/**
	 * Pobiera ustawienie o podanym kluczu.
	 *
	 * @param {String} key Klucz ustawienia.
	 */
	get: function(key) {
		if (!this.loaded) {
			throw 'Accessing settings value before they are loaded';
		}
		return this.props[key];
	},
	/**
	 * Czy dana właściwość typu on/off jest włączona.
	 * @param {String} key Klucz ustawienia.
	 * @return {Boolean}
	 */
	isOn: function(key) {
		var on = parseInt(this.get(key));
		if (on) {
			return true;
		}
		return false;
	},
	/**
	 * Ładowanie ustawień.
	 *
	 * Ładowanie jest jednokrotne (dane nie są odświeżane przy kolejnych wywołaniach).
	 *
	 * @param {Function} callback Funkcja wywoływana po udanym załadowaniu.
	 */
	load: function(callback) {
		var me = this;
		if (me.loaded) {
			callback(me.props);
			return;
		}

		var settingsResponse = this._mockSettings();

		// debugger;
		me.props = settingsResponse.data;
		me.loaded = true;

		// mock loadExtraSettings
		me.props['extra.handbooks_used'] = '0';	// default

		callback(me.props);
	},
	_mockSettings: function() {
		return {
			"success": true,
			"data": {
				"tenant.public_api_on": "0",
				"tenant.cufs_claims.roles.teacher": "Nauczyciel",
				"tenant.pass_digit_count": "1",
				"library.postcode": "81-321",
				"tenant.show_cart": "1",
				"tenant.pass_unique_days": "365",
				"tenant.page_description_pl": "",
				"library.replyto": "library@example.com",
				"library.overdue_fee_amount": "0.50",
				"tenant.pass_uppercase_count": "1",
				"tenant.reader_birthday_visible": "1",
				"tenant.exclusion_from_circulation_on": "1",
				"tenant.cufs_claims.validating_original_on": "0",
				"library.show_wizard": "0",
				"library.arfido_url": "",
				"library.ebook_loans_on": "0",
				"library.reservation_queues": "1",
				"tenant.accelerated_reader_enabled": "0",
				"tenant.reader.barcode_generator_enabled": "0",
				"tenant.date_format": "iso",
				"tenant.cufs_claims": "0",
				"library.latitude": "",
				"library.reservation_period": "2",
				"tenant.email_notifications_on": "1",
				"tenant.cufs_claims.original_providers": "",
				"library.name": "rfid.localhost",
				"library.mailcc": "",
				"library.school_type": "one",
				"tenant.lang": "pl",
				"tenant.page_title_en": "RFID3",
				"tenant.google_auth_on": "0",
				"tenant.law_library_on": "0",
				"tenant.username_on": "0",
				"librarian.loan_confirmation": "1",
				"library.pesel_visible": "1",
				"library.send_emails_on": "1",
				"tenant.email_notifications_to_guardian_on": "0",
				"tenant.sip2_on": "0",
				"tenant.cufs_claims.roles.student": "Uczniowie",
				"library.long_term_loans_on": "1",
				"tenant.pass_nonalfanum_count": "0",
				"library.handbooks_on": "0",
				"tenant.cufs_claims.roles.other": "Pracownicy,Dyrekcja,Kadry,Ksiegowosc,Pedagog,Place,Sekretariat",
				"tenant.sip2_key": "",
				"librarian.return_confirmation": "1",
				"library.city": "Gdynia",
				"librarian.theme": "classic",
				"library.rfid_tag_assigment_code_type": "inventory number",
				"library.reservation_queues_length": "3",
				"tenant.guardians_amount_visible": "0",
				"tenant.currency": "PLN",
				"tenant.synchronization.bn": "0",
				"tenant.encrypted_pesel_on": "1",
				"library.holding_check_import_enabled": "1",
				"tenant.page_title_pl": "RFID3",
				"library.reservation_on": "1",
				"tenant.available_themes": "classic",
				"tenant.idkey": "$2a$13$cJ1hZ2UOBuye3gu6Y15eia3O3ueOaRUBdBuVEENZar.eHwcavQX1E32gyK",
				"tenant.theme": "classic",
				"librarian.starting_tab": "cataloguing/Documents",
				"tenant.z_client_on": "0",
				"tenant.z_server_on": "0",
				"library.longitude": "",
				"tenant.decimal_classification": "udc",
				"library.street": "Elektrybałta",
				"library.number": "42",
				"tenant.change_logs_visible": "0",
				"tenant.cufs_claims.roles.guardian": "Rodzice",
				"library.rfid_tag_assigment_enabled": "0",
				"library.arfido_mifare_enabled": "0",
				"library.notificationinterval": "3",
				"tenant.pass_lowercase_count": "1",
				"tenant.logging_pesel_on": "0",
				"tenant.opac_header_en": "RFID3",
				"library.overdue_fee_on": "1",
				"library.arfido_staffpad_enabled": "1",
				"tenant.copy_city_card_to_barcode_on": "0",
				"library.loan_opac_renewal_on": "1",
				"library.loan_opac_renewal_count": "2",
				"library.nowa_era_on": "0",
				"tenant.key": "92f3571b-9a1f-4bcd-8b4b-ebdbc59aaadc",
				"library.phone": "",
				"library.sou_import_on": "0",
				"library.xml_import_on": "1",
				"library.reservation_free_access": "1",
				"tenant.system_brand": "libranet",
				"library.mailfromalias": "rfid.localhost",
				"tenant.app_mode": "cufs",
				"library.country": "Polska",
				"tenant.contact.email": "",
				"tenant.page_description_en": "",
				"tenant.contact.enable": "0",
				"tenant.cufs_claims.roles.admin": "Administratorzy",
				"library.loan_period_periodical": "14",
				"tenant.bn_search_on": "1",
				"tenant.bus_mode": "0",
				"tenant.mobile_on": "0",
				"library.open_days": "1111100",
				"tenant.pass_length": "8",
				"tenant.pass_valid_days": "30",
				"tenant.opac_header_pl": "RFID3",
				"tenant.cufs_claims.roles.librarian": "Biblioteka",
				"library.register_on": "0",
				"tenant.item.barcode_generator_enabled": "0",
				"library.school_readers_on": "0",
				"library.loan_opac_renewal_period": "14"
			}
		};
	},
	/**
	 *
	 * @param {type} data
	 * @returns {undefined}
	 */
	setSessionData: function(data) {
		this.sessionData = {
			userLogin : data.username,
			userFirstName : data.firstName,
			userLastName : data.lastName,
			providerId : data.providerId,
			providerType : data.providerType,
			roles : data.roles,
			authContext : (data.authContext && typeof data.authContext === 'object') ? data.authContext : null,
			roleClaims : data.roleClaims,	// for debugging claims
		}
	},
	/**
	 * Check if user has an admin role.
	 * @returns {Boolean} true if so.
	 */
	isAdmin: function() {
		var isAdmin = false;
		var roles = this.getSessionData('roles');
		if (roles.indexOf('ROLE_ADMIN') >= 0) {
			isAdmin = true;
		}
		return isAdmin;
	},
	/**
	 * Pobranie informacji o użytkowniku i logowaniu.
	 * @param {type} key
	 * @returns Wartość lub pusty string.
	 */
	getSessionData: function(key) {
		if (this.sessionData && key in this.sessionData) {
			return this.sessionData[key];
		}
		return "";
	},
	/**
	 * Pobranie loginu/nazwy bieżącego użytkownika.
	 * @returns Wartość lub pusty string.
	 */
	getUserLogin: function() {
		return this.getSessionData('userLogin');
	},
	/**
	 * Pobranie imienia bieżącego użytkownika.
	 *
	 * @returns Imię lub login.
	 */
	getUserFirstName: function() {
		if (this.getSessionData('userFirstName').length > 0) {
			return this.getSessionData('userFirstName');
		}
		return this.getSessionData('userLogin');
	},
	/**
	 * Library selected by the user.
	 *
	 * @returns Library name or empty if default.
	 */
	getSelectedLibrary: function() {
		var context = Molnet.Settings.getSessionData('authContext');
		var name = '';
		try {
			name = context.name.trim();
		} catch (exception) {
			this.LOG.warn('getSelectedLibrary failed', exception);
		}
		var nameCompare = name.toLowerCase();
		if (nameCompare === 'biblioteka' || nameCompare === 'library') {
			name = '';
		}
		return name;
	},
	/**
	 * Tryb aplikacji.
	 * 
	 * Uwaga! Zwraca `null` jeśli konfiguracja nie została jeszcze pobrana.
	 * @see Molnet.Application#loadAppConfig()
	 */
	appMode: function() {
		if (Molnet.appMode) {
			return Molnet.appMode;
		}
		return null;
	},
	/**
	 * Czy szyna danych jest aktywna.
	 */
	isBusOn: function() {
		if (Molnet.isBusOn) {
			return true;
		}
		return false;
	},
	/**
	 * Czy CUFS jest aktywny.
	 */
	isCufs: function() {
		if (Molnet.isCufs) {
			return true;
		}
		return false;
	},
	/**
	 * Spr. czy logowano się za pomocą hasła (czy za pomocą zewnętrznego providera).
	 *
	 * <del>
	 * Note! This might provide invalid information for merged accounts.
	 * @see ContextProvider.createContext
	 * RZ#5147 One account to many libraries in one tenant for CUFS and bus BB#12966 REQ1512
	 * </del>
	 * Should be fine now.
	 *
	 * @returns {Boolean}
	 */
	isPasswordAuthentication: function() {
		if (this.getSessionData('providerType') === 'password') {
			return true;
		}
		return false;
	},
	/**
	 * Czy system ma mieć __markę__ Libra.
	 *
	 * Uwaga! Docelowo powinno wpływać tylko na wygląd, a nie na dostępne funkcje.
	 */
	isLibra: function() {
		if (Molnet.isLibra) {
			return true;
		}
		return false;
	},
	
	/**
	 * Czy system ma mieć __markę__ Tasc.
	 *
	 * Uwaga! Docelowo powinno wpływać tylko na wygląd, a nie na dostępne funkcje.
	 */
	isTasc: function() {
		if (Molnet.isTasc) {
			return true;
		}
		return false;
	},
	/**
	 * Czy czytelnicy szkolni są aktywni.
	 *
	 * Wpływa zarówno dostępne typy czytelników jak i niektóre funkcje związane z typami szkolnymi.
	 * Np. promocja nie ma sensu jeśli nie ma uczniów.
	 */
	hasSchoolReaders: function() {
		return this.isOn('library.school_readers_on');
	},
	/**
	 * Definicje formatów dat.
	 */
	_dateFormats: {
		'us' : {
			'date' : 'm/d/Y',
			'datetime' : 'm/d/Y, g:i a',
			'month' : 'm/Y'
		},
		'iso' : {
			'date' : 'Y-m-d',
			'datetime' : 'Y-m-d, G:i',
			'month' : 'Y-m'
		},
		'uk' : {
			'date' : 'd/m/Y',
			'datetime' : 'd/m/Y, G:i',
			'month' : 'm/Y'
		}
	},
	/**
	 * Początek tyogdnia.
	 *
	 * @returns {Number} Początkowy numer tygodnia. Przy czym 0 to niedziela.
	 */
	getWeekStartDay: function() {
		var formatCode = Molnet.Settings.get('tenant.date_format');
		var startDay;
		switch (formatCode) {
			case 'us':
				startDay = 0;
			break;
			case 'iso':
			case 'uk':
			default:
				startDay = 1;
			break;
		}
		return startDay;
	},
	/**
	 * Zwraca format daty do użycia dla użytkownika.
	 *
	 * Można założyć, że zwrócony format jest zgodny z wymaganiami dla `Ext.Date`.
	 *
	 * Uwaga! Do formatowania daty (i czasu) w komunikatach służy `Molnet.I18n.formatDate`.
	 *
	 * @param {String} type Typ formatowania (datetime, date, month); domyślnie `date`.
	 * @returns {String}
	 */
	getDateFormat: function(type) {
		// domyślny typ daty
		if (typeof type !== 'string') {
			type = 'date'
		}
		// format
		var formatCode = Molnet.Settings.get('tenant.date_format');
		if ((formatCode in this._dateFormats)
			&& (type in this._dateFormats[formatCode])) {
			return this._dateFormats[formatCode][type];
		}
		// na wszelki wypadek
		this.LOG.warn('getDateFormat: unknown format or type: ', formatCode, type);
		return 'Y-m-d';
	},
	
	/**
	 * Whether the system has new design or not.
	 * @return {Boolean} 
	 */
	isNewDesign: function() {
		if (typeof this.get('librarian.theme') === 'undefined') {
			return this.get('tenant.theme') === 'triton';
		} else {
			return this.get('librarian.theme') === 'triton';
		}
	}
});
