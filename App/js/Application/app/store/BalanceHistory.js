Ext.define('App.store.BalanceHistory', {
    extend: 'Ext.data.Store',
    autoLoad: true,
    autoSync: true,
    remoteFilter: true,
    remoteSort: true,
    fields: [
        { name: 'Id', type: 'int' },
        { name: 'ObjectCreateDate', type: 'string' },
        { name: 'DateTo', type: 'date' },
        { name: 'DateFrom', type: 'date' },
        { name: 'Amount', type: 'number' }
    ],
    proxy: {
        type: 'ajax',
        url: '/Operator/BalanceHistory',
        method: 'GET',

        reader: {
            rootProperty: 'data',
            totalProperty: 'totalCount'
        }
    }
});