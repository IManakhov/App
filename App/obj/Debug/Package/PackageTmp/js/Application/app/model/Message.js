Ext.define('App.model.Message', {
    extend: 'Ext.data.Model',
    fields: [
       { name: 'Id' },
       { name: 'OperatorFrom' },
       { name: 'OperatorTo' },
       { name: 'Name' },
       { name: 'Date' },
       { name: 'Text' }
    ],
    idProperty: 'Id',
    defaultValuesExist: true
});