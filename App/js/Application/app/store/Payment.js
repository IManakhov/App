Ext.define('App.store.Payment', {
    extend: 'Ext.data.Store',
    autoLoad: true,
    autoSync: true,
    remoteFilter: true,
    remoteSort: true,
    fields: [
        { name: 'Id', type: 'int' },
        { name: 'ObjectCreateDate', type: 'string' },
        { name: 'From', type: 'string' },
        { name: 'Date', type: 'date' },
        { name: 'Amount', type: 'number' },
        { name: 'BalanceAmount', type: 'number' }, 
        { name: 'Type', type: 'auto' }
    ],
    proxy: {
        type: 'ajax',
        url: '/Payment/List',
        method: 'GET',

        reader: {
            rootProperty: 'data',
            totalProperty: 'totalCount'
        }
    }
});