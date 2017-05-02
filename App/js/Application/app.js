Ext.application({
    name: 'App',
    appFolder: '/js/Application/app',
    paths: {
        'Ext': '/js/ext',
        'App.view': '/js/Application/app/view'
    },

    extend: 'App.Application',

    autoCreateViewport: 'App.view.Main'
});