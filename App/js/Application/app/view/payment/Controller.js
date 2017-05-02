Ext.define('App.view.payment.Controller', {
    extend: 'App.base.Controller',
    alias: 'controller.payment',
    requires: [
        'Ext.data.Store',
        'App.model.Payment',
        'App.view.payment.Grid',
        'App.view.payment.Window'
    ],
    formModel: 'App.model.Payment',
    PermissionPath: 'App.Payments',
    controllerName: 'Payment',
    editWindow: 'paymentwindow'
});