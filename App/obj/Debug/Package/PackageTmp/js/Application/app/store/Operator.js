Ext.define('App.store.Operator', {
    extend: 'Ext.data.Store',
    autoLoad: false,
    autoSync: false,
    remoteFilter: true,
    remoteSort: true,
    fields: [
        { name: 'Id', type: 'int' },
        { name: 'FIO', type: 'string' },
        { name: 'Login', type: 'string' },
        { name: 'Status', type: 'auto' },
        { name: 'IsFavorite', type: 'auto' }
    ],
    proxy: {
        type: 'ajax',
        url: '/Operator/List',
        method: 'GET',

        reader: {
            rootProperty: 'data',
            totalProperty: 'totalCount'
        }
    }
});