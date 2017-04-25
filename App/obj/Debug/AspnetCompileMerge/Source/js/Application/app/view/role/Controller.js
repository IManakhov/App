Ext.define('App.view.role.Controller', {
    extend: 'App.base.Controller',
    alias: 'controller.role',
    requires: [
        'Ext.data.Store',
        'App.model.Role',
        'App.view.role.Grid',
        'App.view.role.Window'
    ],
    formModel: 'App.model.Role',
    PermissionPath: 'App.Roles',
    controllerName: 'Role',
    editWindow: 'rolewindow',
    onShowWindow: function (component, eOpts) {
        component.down('[name=Subdivision]').setReadOnly(!Permission.Access('CanEditSundivision'));
    },
});