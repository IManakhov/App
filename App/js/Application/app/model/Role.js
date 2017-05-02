Ext.define('App.model.Role', {
    extend: 'Ext.data.Model',
    fields: [
       { name: 'Id' },
       { name: 'Subdivision' },
       { name: 'Name' }
    ],
    idProperty: 'Id',
    defaultValuesExist: true
});