Ext.define('App.store.PaymentTransfer', {
    extend: 'Ext.data.Store',
    autoLoad: true,
    autoSync: true,
    remoteFilter: true,
    remoteSort: true,
    fields: [
        { name: 'Id', type: 'int' },
        { name: 'ObjectCreateDate', type: 'string' },
        { name: 'OperatorFrom', type: 'string' },
        { name: 'OperatorTo', type: 'string' },
        { name: 'Date', type: 'date' },
        { name: 'Amount', type: 'number' },
        { name: 'Decision', type: 'auto' },
        { name: 'IsMyTransaction', type: 'auto' },
        
    ],
    proxy: {
        type: 'ajax',
        url: '/PaymentTransfer/List',
        method: 'GET',

        reader: {
            rootProperty: 'data',
            totalProperty: 'totalCount'
        }
    }
});