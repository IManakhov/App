Ext.define('App.view.MainController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.main',
    requires: [
        'Ext.tab.Panel',
        'Ext.tree.Panel'
    ],

    createTab: function (tree, record) {
        var me = this,
            tabPanel = me.lookupReference('tabPanelCenter'),
            tabOpen;

        if (record.get('leaf')) {
            tabOpen = tabPanel.items.findBy(function (tab) {
                return tab.title === record.get('text');
            });
            if (!tabOpen) {
                var module = record.get('module');
                var closable = module === "desktop" ? false : true;
                tabOpen = tabPanel.add({
                    xtype: 'panel',
                    module: module,
                    title: record.get('text'),
                    autoShow: true,
                    closable: closable,
                    layout: 'fit',
                    items: [
                        {
                            xtype: module + 'panel'
                        }
                    ]
                });
            }

            tabPanel.setActiveTab(tabOpen);
        }
    }
});