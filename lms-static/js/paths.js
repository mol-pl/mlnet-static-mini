/*
 * Konfiguracja przestrzeni nazw. Mimo, że loader nie jest używany w produkcji,
 * ustawienie namespace'ów jest konieczne, ze względu na custom'owy loader.
 */
Ext.Loader.setConfig({
	enabled: false,
	paths: {
		'Ext.ux': molnetClientRoot + '/js/ux',
		'Molnet': molnetClientRoot + '/js/app'
	}
})