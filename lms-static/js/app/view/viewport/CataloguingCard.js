/* global Ext */

Ext.define('Molnet.view.viewport.CataloguingCard', {
	extend: 'Ext.tab.Panel',
	alias: 'widget.cataloguingCard',
	plain: true,
	cls: 'tabpanel',
	platformConfig: {
		'themes.Triton': {
			iconCls: 'far fa-cabinet-filing',
			header: false,
			tabBar: {
				hidden: true
			}
		}
	},
	defaults: {
		tabConfig: {
			focusable: false
		}
	},
	items: [
		{
			xtype: 'indexpanel',
			title: 'I18n.Cataloguing.Documents',
			subPageId: 'Documents',
			itemId: 'indexpanelid',
			platformConfig: {
				'themes.Triton': {
					iconCls: 'far fa-file-alt',
					bookmarked: true
				}
			}
		},
	],
});
