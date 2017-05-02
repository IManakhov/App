Ext.define('App.store.Message', {
    extend: 'Ext.data.Store',
    autoLoad: true,
    autoSync: true,
    remoteFilter: true,
    remoteSort: true,
    fields: [
        { name: 'Id', type: 'int' },
        { name: 'ObjectCreateDate', type: 'string' },
        { name: 'OperatorFrom', type: 'string' },
        { name: 'Date', type: 'date' },
        { name: 'Name', type: 'auto' }
    ],
    proxy: {
        type: 'ajax',
        url: '/Message/List',
        method: 'GET',

        reader: {
            rootProperty: 'data',
            totalProperty: 'totalCount'
        }
    }
});