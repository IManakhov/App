Ext.define('App.view.message.Controller', {
    extend: 'App.base.Controller',
    alias: 'controller.message',
    requires: [
        'Ext.data.Store',
        'App.model.Message',
        'App.view.message.Grid',
        'App.view.message.Window'
    ],
    formModel: 'App.model.Message',
    PermissionPath: 'App.Messages',
    controllerName: 'Message',
    editWindow: 'messagewindow'
});