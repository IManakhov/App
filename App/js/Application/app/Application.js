Ext.define('App.Application', {
    extend: 'Ext.app.Application',
    requires:
    [
        //TODO Ильшату тянуть сразу все найденные Controller в папке view
        'App.view.MainController',
        'App.view.role.Controller',
        'App.view.operator.Controller',
        'App.view.personalarea.Controller',
        'App.view.payment.Controller',
        'App.view.paymenttransfer.Controller',
        'App.view.message.Controller',
        'App.enum.Enums'
    ],

    name: 'App',

    autoCreateViewport: 'App.view.Main'
});