Ext.define('App.model.Payment', {
    extend: 'Ext.data.Model',
    fields: [
       { name: 'Id' },
       { name: 'OperatorFrom' },
       { name: 'OperatorTo' },
       { name: 'Amount' },
       { name: 'Date' },
       { name: 'IsCurrent' }
    ],
    idProperty: 'Id',
    defaultValuesExist: true
});