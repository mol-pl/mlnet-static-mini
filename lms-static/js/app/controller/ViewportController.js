/* global RequestHelper, Ext, molnetApiRoot, MolUtils, molnetClientRoot */

Ext.define('Molnet.controller.ViewportController', {
	extend: 'Ext.app.Controller',
	requires: [
		'Ext.util.Cookies'
	],
	views: [
		'Viewport',
	],
	
	listen: {
		controller: {
			'*': {
				subpagefocus: 'onSubPageFocus',
				errorlogcatch: 'onErrorLogCatch',
				querynavigate: 'onQueryNavigate'
			},
			'#sideNavigationController': {
				sidenavigationsubpageclick: function(controller, sideNavigation, info) {
					var subPage = Ext.ComponentQuery.query('[subPageId=' + info.node.get('subPageId') + ']').pop();
					controller.fireEvent('subpagefocus', controller, subPage);
				}
			}
		}
	},
	
	init: function() {
		// logger
		this.LOG = new Logger(this.id, {
			info : !MolUtils.isProductionInstallation(),
			warn : true,
			error : true
		});

		this.control({
			'buttongroup button[cardId]': {///łapie click każdego buttona
				click: this.onCardButtonClick
			},
			'#viewportCards panel': {
				show: this.onCardShow
			},
			'#viewportCards': {
				beforerender: function() {
					this.getNavigationStructure();
				}
			},
			'viewport': {
				afterrender: this.afterrenderViewport
			}, //dla guzików z lewego paska
			'[moduleId] tab': {
				click: function(tab) {
					this.fireEvent('subpagefocus', this, tab.card);
				}
			},
			'[moduleId]': {
				tabchange: function(panel, newTab) {
					this.fireEvent('subpagefocus', this, newTab);
				}
			},
		});
	},

	/**
	 * Fired when sub page must be focused.
	 * Doesn't focus if viewport is masked (modal window is shown).
	 * 
	 * @param {Ext.app.Controller} controller
	 * @param {Ext.Component} [subPage]
	 */
	onSubPageFocus: function(controller, subPage) {
		// function info (debug)
		var logInfo = {controller:controller};
		logInfo.controller = controller;
		if (typeof controller === 'object') {
			logInfo.controllerName = controller.moduleClassName;
		}
		logInfo.subPage = subPage;
		if (typeof subPage === 'object') {
			logInfo.subPageId = subPage.id;
		}
		this.LOG.info('onSubPageFocus', logInfo);

		// check if there are any modal windows
		var modalWindows = Ext.ComponentQuery.query('window[modal=true]');
		var isViewportMasked = modalWindows.some(function(window) {
			return !window.hidden;
		});
		if (isViewportMasked) {
			this.LOG.info('onSubPageFocus', 'viewport masked skipping');
			return;
		}
		// Note! This will not work.
		// When user navigates through tabs we would have to remove previously added returnFocus.
		// Also should probably support non-modal windows (like the one for adding a reader)
		// Would also probably be better to have something like this added for all opened windows.
		// See also: LMS - RZ#4780 Fix or revert onSubPageFocus
		/**
		// return later if viewport is currently masked
		if (isViewportMasked) {
			// add return focus to active modal windows
			modalWindows.each(function(window) {
				if (!window.hidden) {
					var returnFocus = function() {
						controller.fireEvent('subpagefocus', controller, subPage);
					};
					window.on({
						hide: returnFocus,
						destroy: returnFocus,
						close: returnFocus,
						single: true
					});
				}
			});
			return;
		}
		/**/

		// set focus
		this.LOG.info('onSubPageFocus', 'set focus?');
		if (typeof subPage === 'undefined') {
			var viewportCards = Ext.ComponentQuery.query('#viewportCards').pop();
			var activeCard = viewportCards.getLayout().getActiveItem();

			subPage = activeCard.getActiveTab();
			this.LOG.info('onSubPageFocus', 'set focus for active tab');
		}
		if (subPage.getDefaultFocus() && !subPage.getDefaultFocus().hasFocus) {
			this.LOG.info('onSubPageFocus', 'set focus: ', subPage.id);
			subPage.focus(false, 100);
		} else {
			this.LOG.info('onSubPageFocus', 'focus not needed');
		}
		/**/
	},
	
	/**
	 * Fired when navigation by query must be performed.
	 * 
	 * @param {Ext.app.Controller} controller
	 * @param {Ext.Component} module
	 * @param {Ext.Component} subPage
	 */
	onQueryNavigate: function(controller, module, subPage) {
		this.switchActiveCardByQuery(module, subPage);
	},
	
	// cached navigation structure
	_navigationStructure: null,
	
	/**
	 * Returns current navigation structure.
	 * 
	 * @return {Object.<string, Object>} paths Object where key is navigation path in format which
	 *									is usable with `switchActiveCardByPath` method as a param.
	 */
	getNavigationStructure: function() {
		if (this._navigationStructure !== null) {
			return this._navigationStructure;
		}
		var paths = {};
		var viewportMainChild = Ext.ComponentQuery.query('#viewportCards').pop();
		viewportMainChild.items.each(function(module) {
			module.items.each(function(subPage) {
				var subPageInfo = {};
				if (!module.moduleId) {
					return false;
				}
				subPageInfo.moduleId = module.moduleId;
				subPageInfo.subPageId = subPage.subPageId;
				subPageInfo.subPageTitle = subPage.title;
				subPageInfo.tabComponentId = subPage.getId();
				subPageInfo.moduleItemId = module.itemId;
				subPageInfo.bookmarked = subPage.bookmarked;

				var navigationButton = viewportMainChild.down('[cardId=' + module.itemId + ']');
				if (navigationButton) {
					subPageInfo.moduleTitle = navigationButton.text;
				}
				
				var navigationPath = subPageInfo.moduleId + '/' + subPageInfo.subPageId;
				
				paths[navigationPath] = subPageInfo;
			});
		});
		this._navigationStructure = paths;
		return paths;
	},
	
	/**
	 * Returns only visible navigation structure.
	 * 
	 * @return {Object.<string, Object>} paths Object where key is navigation path in format which
	 *									is usable with `switchActiveCardByPath` method as a param.
	 */
	getVisibleNavigationStructure: function() {
		var navigationStructure = this.getNavigationStructure(),
			viewportMainChild = Ext.ComponentQuery.query('#viewportCards').pop(),
			visibleNavigationStructure = {};
		for (var path in navigationStructure) {
			var pathInfo = navigationStructure[path],
				tabComponentId = pathInfo.tabComponentId,
				tabComponent = Ext.getCmp(tabComponentId);
			
			if (!tabComponent) {
				continue;
			}
			var navigationButton = viewportMainChild.down('[cardId=' + pathInfo.moduleItemId + ']');
			if (!tabComponent.tab.isHidden() && navigationButton && !navigationButton.isHidden()) {
				visibleNavigationStructure[path] = pathInfo;
			}
		}
		
		return visibleNavigationStructure;
	},
	
	afterrenderViewport: function(viewport) {
		var me = this;
		// Set focus on default field for a starting page (works upon LMS page refesh).
		// For reader grid it should focus the barcode field.
		// Note! This should also work if starting page is e.g. Dashboard.
		// Note! DevTools in Firefox might steal initial focus. So test focus on-refresh without devtools closed
		// (or with DevTools opened in separate window).
		this.LOG.info('forcing inital focus');
		me.fireEvent('subpagefocus', me);
	},
	/**
	 * Zmiana aktywnej karty na pierwszą widoczną (o ile to konieczne).
	 * @param {Ext.tab.Panel} tabPanel
	 * @private
	 */
	setVisibleTabActive: function(tabPanel) {
		if (tabPanel.getActiveTab().tab.isHidden()) {
			tabPanel.items.each(function(tabItem){
				var tab = tabItem.tab;
				if (tab.isVisible()) {
					tabPanel.setActiveTab(tabItem);
					return false;
				}
				return true;
			});
		}
	},
	/**
	 * Callback dla przycisniecia jednej z zakładek głownych.
	 * Podmienia kartę na odpwoiednią.
	 * Tworzy takze zaślepkę ładowania.
	 */
	onCardButtonClick: function(button) {
		var viewportCards = Ext.ComponentQuery.query('#viewportCards').pop();
		if (viewportCards.getLayout().getActiveItem().itemId != button.cardId) {
			viewportCards.setLoading('I18n.Ext.Loading'.i18n(), true);
		}
		viewportCards.getLayout().setActiveItem(button.cardId);

		var tabPanel = viewportCards.down('#' + button.cardId);
		this.setVisibleTabActive(tabPanel);
		this.fireEvent('subpagefocus', this);
	},
	/**
	 * Callback dla eventu show kart głównych.
	 * Zdejmuje zaślepkę ładowania
	 */
	onCardShow: function() {
		var viewportCards = Ext.ComponentQuery.query('#viewportCards').pop();
		viewportCards.setLoading(false);
	},
	onLogout: function() {
		var appMode = Molnet.appMode;
		if (appMode === 'cufs' || appMode === 'tasc') {
			window.location = '/social/' + appMode + '/signout' + '?returnurl=' + window.location;
		} else {
			Ext.Ajax.request({
				url: '/../logout',
				method: 'GET',
                params: {
                    libraryId: Molnet.Settings.getSessionData('authContext').id
                },
				success: function() {
					Molnet.view.BrowserNavigationHandler.reload();
				},
				failure: function(response, opts) {
					console.log('AppMode load failure', response);
				}
			});
		}
	},
	/**
	 * Zmienia aktywne działy/karty.
	 * 
	 * Uwaga! Otwieranie jest opóźnione. Zastosuj callback, aby wykonać coś po otwarciu karty.
	 *
	 * @param {String} targetModuleQuery Id działu.
	 * @param {String} targetTabQuery [optional] Id karty do aktywowania (w ramach tego działu).
	 * @param {Function} callback Funkcja wykonywana gdy karta jest gotowa;
	 *	dostaje `tabPanel` jako parametr, czyli aktywny dział.
	 * @returns {Boolean} Jeśli zwrócony zostanie `false`, to nie udało się odnaleźć działu.
	 */
	switchActiveCardByQuery: function(targetModuleQuery, targetTabQuery, callback) {
		var viewportModules = Ext.ComponentQuery.query('#viewportCards').pop();

		var tabPanel = viewportModules.down(targetModuleQuery);
		if (!tabPanel) {
			return false;
		}

		var activeModule = viewportModules.getLayout().getActiveItem();
		var activeModuleId = activeModule.itemId;
		var targetModuleId = tabPanel.itemId;
		// using `id` because it is more universal then `itemId` (available even if not set in config)
		var activeTabId = tabPanel.getActiveTab().id;	
		var targetTab = tabPanel.down(targetTabQuery);
		var targetTabId = null;
		if (targetTab) {
			targetTab.id;
		}

		// prepare on-ready with callback
		var onReady;
		if (callback) {
			onReady = function() {
				callback(tabPanel);
			};
		} else {
			onReady = function() {};
		}

		// activate button and change target module or tab
		if (activeModuleId !== targetModuleId || activeTabId !== targetTabId) {
			//viewportModules.setLoading(true);
			setTimeout(function() {
				var moduleButton = viewportModules.down('[cardId=' + targetModuleId + ']');
				if (activeModuleId !== targetModuleId) {
					moduleButton.toggle();
				}

				viewportModules.getLayout().setActiveItem(targetModuleId);
				if (targetTab && !targetTab.isDestroyed && !targetTab.tab.isHidden()) {
					tabPanel.setActiveTab(targetTab);
				}
				//viewportModules.setLoading(false);
				
				onReady();
			}, 10);
		} else {
			onReady();
		}
		return true;
	},
	/**
	 * Zmienia aktywne działy/karty na podstawie ścieżki.
	 *
	 * @param {String} path Format ścieżki: `moduleId/subPageId`, albo `moduleId` (dane jak w `UsabilityAnalytics` dla `pageView`).
	 */
	switchActiveCardByPath: function(path) {
		var moduleId, subPageId;
		path.replace(/(\w+)(?:\/(\w+))?/, function(a, dir, file){
			moduleId = dir;
			subPageId = file;
		});
		if (moduleId && subPageId) {
			this.switchActiveCardByQuery('[moduleId='+moduleId+']', '[subPageId='+subPageId+']');
		} else if (moduleId) {
			this.switchActiveCardByQuery('[moduleId='+moduleId+']', '[subPageId]');
		}
	},
	/**
	 * Zmienia aktywne działy/karty.
	 *
	 * Uwaga! Otwieranie jest opóźnione.
	 *
	 * @param {String} targetModuleId Id działu.
	 * @param {String} targetTabId [optional] Id karty do aktywowania (w ramach tego działu).
	 * @deprecated Zalecane korzystanie ze `switchActiveTab`.
	 */
	switchActiveCard: function(targetModuleId, targetTabId) {
		this.switchActiveCardByQuery('#' + targetModuleId, '#' + targetTabId);
	},
	
	/**
	 * @note Only for non-production installations!
	 * 
	 * Fired when error is caught in the log catcher.
	 * Creates notification badge for the "Diagnostic" button.
	 */
	onErrorLogCatch: function(args) {
		var button = Ext.ComponentQuery.query('#diagnosticInformation').pop();
		if (!button) {
			return;
		}
		if (args.message) {
			if (args.message.indexOf('Script error.') === -1) {
				onCrossOriginError();
			}
		} else {
			onCrossOriginError();
		}
		
		function onCrossOriginError() {
			button.diagnoseBadge = Ext.fly(button.el.query('.diagnose-badge').pop()) || button.el.appendChild({
				tag: 'i',
				cls: 'fas fa-circle diagnose-badge'
			});
		}
	},
	
	/**
	 * Decodes response text or throws 'Response cannot be parsed!' exception.
	 * @param {Object} response The raw response.
	 * @returns {Object} Decoded response text.
	 */
	decodeResponseText: function(response) {
		var decodedResponseText = Ext.decode(response.responseText, true);
		if (!decodedResponseText) {
			throw 'Response cannot be parsed!';
		}
		return decodedResponseText;
	}
});

