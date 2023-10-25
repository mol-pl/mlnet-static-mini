Ext.define('Molnet.model.IndexEntry', {
	extend: 'Ext.data.Model',
	fields: [
		{
			name: 'id',
			type: 'auto'
		},
		{
			name: 'text',
			type: 'string'
		},
		{
			name: 'docCount',
			type: 'int'
		},
		{
			name: 'type',
			type: 'int'
		}, 'normalForm', 'hasTracing'
	]
});
