/* global Ext, molnetClientRoot */

/**
 * Obiekt aplikacji, odpowiedzialny za zadeklarowanie zależności i
 * uruchomienie aplikacji.
 */
Ext.define('Molnet.Application', {
	extend: 'Ext.app.Application',
	name: 'Molnet',
	requires: [
		'Molnet.view.Viewport',
	],
	controllers: [
		'SessionController',
		'cataloguing.index.IndexController',
	],
	appFolder: molnetClientRoot + '/js/app',
	
	/**
	 * @event settingsload
	 * Fires after settings are loaded.
	 * @param {Molnet.Application} this 
	 * @param {Object} settings
	 */
	
	init: function() {
		Ext.enableAria = false;
		Ext.enableAriaButtons = false;
		Ext.enableAriaPanels = false;
		window.app = this;
		// basic debug info
		if (console && console.log) {
			console.log('userAgentData: ', JSON.stringify(navigator.userAgentData));
			console.log(navigator.userAgent);
			console.log(location.href);
		}
		// weryfikacja wersji ExtJS.
		var requiredVersion = '6.5.3';
		if (!Ext.getVersion().match(requiredVersion)) {
			console.error("Unexpected ExtJS version!", Ext.getVersion().version, "!=", requiredVersion);
		}
	},
	launch: function() {
		var _self = this;
		this.loadAppConfig()
			.then(function() {
				return _self.getController('SessionController').startSession();
			})
			.then(function() {
				_self.showLoading();
				Molnet.Settings.load(function(settings) {
					app.fireEvent('settingsload', app, settings);
					_self.setupL10n();
					_self.showViewport();
					_self.hideLoading();
				});
			});
	},
	/**
	 * Wczytuje podstawową, blokującą konfigurację.
	 *
	 * Odczytywana konfiguracja:
	 * <li>tryb uwierzytelniania (mol/cufs)
	 * <li>stan synchronizacji z szyną danych
	 *
	 * @returns {Ext.promise.Promise<Object>} Promise with decoded response if resolved.
	 */
	loadAppConfig: function() {
		var deferred = new Ext.Deferred();
		var me = this;
		setTimeout(function() {
			var result = me._mockAppConfig();
			if (result) {
				Molnet.appMode = result.data.appmode;
				Molnet.isBusOn = result.data.isbusmode;
				Molnet.isCufs = Molnet.appMode === 'cufs';
				Molnet.isTasc = result.data.systemBrand === 'tasc';
				Molnet.isLibra = result.data.systemBrand === 'libranet';
				Molnet.hasGoogleAuth = result.data.googleAuth;
				Molnet.tenantIdKeyMatch  = result.data.tenantIdKeyMatch;
				deferred.resolve(result);
			} else {
				deferred.reject('Response cannot be parsed!');
			}
		}, 100);
		return deferred.promise;
	},
	_mockAppConfig: function() {
		return {"success":true,"data":{"emailNotifications":true,"metaDescPl":"","appmode":"cufs","contactEnabled":false,"isbusmode":false,"decimalClassificationType":"udc","armsUrl":"http://localhost:8082/arms","lawLibraryOn":"0","opacHeaderPl":"RFID3","exclusionFromCirculationEnabled":true,"metaTitlePl":"RFID3","googleAuth":false,"tenantIdKeyMatch":true,"publicApi":false,"metaDescEn":"","systemBrand":"libranet","dateFormatType":"iso","neproxyUrl":"https://arms.pp.mol.com.pl/neproxy/","acceleratedReaderEnabled":false,"opacHeaderEn":"RFID3","metaTitleEn":"RFID3"}};
	},
	/**
	 * Dodatkowe ustawienia lokalizacji zależne od ustawień.
	 *
	 * Podstawowe ustawienia znajdują się w `Molnet.ExtLang`.
	 */
	setupL10n: function() {
		var dateFormat = Molnet.Settings.getDateFormat();
		var monthFormat = Molnet.Settings.getDateFormat('month');
		var dateTimeFormat = Molnet.Settings.getDateFormat('datetime');
		var weekStartDay = Molnet.Settings.getWeekStartDay();
		Ext.define('Ext.setupL10n.picker.Date', {
			override: 'Ext.picker.Date',
			startDay: weekStartDay,
			format: dateFormat
		});
		Ext.define('Ext.setupL10n.form.field.Date', {
			override: 'Ext.form.field.Date',
			startDay: weekStartDay,
			format: dateFormat
		});
		Ext.define('Ext.setupL10n.ux.form.field.Month', {
			override: 'Ext.ux.form.field.Month',
			format: monthFormat
		});
		Ext.define('Ext.setupL10n.grid.column.Date', {
			override: 'Ext.grid.column.Date',
			format: dateFormat
		});
		Ext.define('Ext.setupL10n.ux.grid.column.DateTimeColumn', {
			override: 'Ext.ux.grid.column.DateTimeColumn',
			format: dateTimeFormat
		});
	},
	/**
	 * Callback po załadowaniu ustawień. Tworzy viewport, gwarantując,
	 * że ustawienia będą już załadowane.
	 */
	showViewport: function() {
		Ext.create('Molnet.view.Viewport');
	},
	/**
	 * Ukrywa animację ładowania (splash).
	 */
	hideLoading: function() {
		Ext.fly('molnet-loading').fadeOut();
	},
	/**
	 * Pokazuje animację ładowania.
	 */
	showLoading: function() {
		Ext.fly('molnet-loading').fadeIn();
	}
});
