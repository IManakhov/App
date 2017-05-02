Ext.define('App.model.PaymentTransfer', {
    extend: 'Ext.data.Model',
    fields: [
       { name: 'Id' },
       { name: 'OperatorFrom' },
       { name: 'OperatorTo' },
       { name: 'AmountFrom' },
       { name: 'AmountTo' },
       { name: 'Comission' },
       { name: 'Date' },
       { name: 'Decision' },
       { name: 'Text' }
    ],
    idProperty: 'Id',
    defaultValuesExist: true
});