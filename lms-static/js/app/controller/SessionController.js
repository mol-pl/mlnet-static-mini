/* global Ext, MolUtils */

/**
 * Specjalny kontroler monitorujący i utrzymujący sesję z serwerem.
 */
Ext.define('Molnet.controller.SessionController', {
	extend: 'Ext.app.Controller',
//	sessionTimeoutTask: undefined,
	/**
	 * Metoda rozpoczyna sesję serwerową. Próbuje wznowić sesję.
	 * Wywoływana na start aplikacji (w Application.js)
	 */
	startSession: function() {
		var deferred = new Ext.Deferred();
		var me = this;

		setTimeout(function() {
			var decodedResponseText = me._mockInfoUser();
			if (decodedResponseText) {
				var data = decodedResponseText.data;
				Molnet.Settings.setSessionData(data);
				//me.startRequestMonitoring();
				deferred.resolve();
			} else {
				deferred.reject('Response cannot be parsed!');
			}
		}, 100);
		return deferred.promise;
	},
	_mockInfoUser: function() {
		return {
			"success": true,
			"data": {
				"providerId": "cufs",
				"accountCufsProfile": {
					"userName": "johndoe@example.com",
					"firstName": null,
					"lastName": null,
					"email": null,
					"pesel": null,
					"credentialsExpired": true,
					"originalProvider": null,
					"originalName": null,
					"librariesWithRoles": [],
					"accountRoles": ["ROLE_READER"]
				},
				"sessionMaxInactiveInterval": 7200,
				"roles": ["ROLE_LIBRARIAN", "ROLE_READER"],
				"username": "johndoe@example.com",
				"authContext": {
					"id": 62,
					"name": "Biblioteka"
				},
				"emailVerificationStatusCode": "request_sent",
				"lastName": "Doe",
				"firstName": "John",
				"providerType": "social",
				"email": "johndoe@example.com"
			}
		};
	},
});
