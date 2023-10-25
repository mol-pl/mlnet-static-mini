var indexResponse = {"success":true,"data":[{"id":179,"text":"Gaiman, Neil (1960- )","type":0},{"id":180,"text":"Garztecki, Juliusz Witold (1920-2017) Tłumaczenie","type":0},{"id":338,"text":"Niepoprawny, Pismak","type":0},{"id":178,"text":"Pratchett, Terry (1948-2015)","type":0},{"id":195,"text":"Wyatt, David Il.","type":0}],"total":5};
Ext.define('Molnet.store.document.IndexStore', {
	extend: 'Ext.data.Store',
	requires: [
		'Ext.data.proxy.Rest'
	],
	model: 'Molnet.model.IndexEntry',
	alias: 'store.indexstore',

	data: indexResponse.data,
});
