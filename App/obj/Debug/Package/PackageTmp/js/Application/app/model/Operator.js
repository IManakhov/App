Ext.define('App.model.Operator', {
    extend: 'Ext.data.Model',
    fields: [
        { name: 'Id' },
        { name: 'Surname' },
        { name: 'Name' },
        { name: 'Patronymic' },
        { name: 'Login' },
        { name: 'Password' },
        { name: 'Email' },
        { name: 'Phone' },
        { name: 'Status' },
        { name: 'Position' },
        { name: 'Roles' },
        { name: 'Subdivisions' },
        { name: 'CanSetSign' },
        { name: 'SignDateEnd' },
        { name: 'SignPosition' },
        { name: 'CurrentSubdivisionId' },
        { name: 'CurrentSubdivision' },
        { name: 'SignAccesDocument' }
    ],
    idProperty: 'Id'
});