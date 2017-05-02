Ext.define('App.view.Main', {
    extend: 'Ext.container.Viewport',
    alias: 'widget.main',
    layout: 'border',
    controller: 'main',
    items:
        [
            {
                region: 'west',
                xtype: 'treepanel',
                title: '<b>Меню</b>',
                width: 220,
                buttonAlign: 'left',
                rootVisible: false,
                autoScroll: true,
                store: Ext.create('Ext.data.TreeStore', {
                    proxy: {
                        type: 'ajax',
                        method: 'GET',
                        url: 'MenuItems/GetAll'
                    },
                    listeners: {
                        load: function (store, records, successful, operation, node, eOpts) {
                            if (records && records.length > 0) {
                                var treepanel = node.getOwnerTree();
                                treepanel.fireEvent('itemclick', treepanel, records[0]);
                            }
                        }
                    }
                }),
                listeners: {
                    itemclick: 'createTab',
                    afterlayout: function () {
                        var height = Ext.getBody().getViewSize().height;
                        this.setHeight(height);
                    }
                },
                fbar: [
                    {
                        xtype: "container",
                        height: 19,
                        layout: { type: "hbox" },
                        items: [
                            {
                                xtype: 'label',
                                width: 194,
                                listeners: {
                                    beforerender: function (label, eOpts) {
                                        Ext.Ajax.request({
                                            url: ('/Operator/GetCurrentOperatorSurnameAndName'),
                                            success: function (response, opts) {
                                                var result = Ext.decode(response.responseText);
                                                if (result && result.surnameAndName) {
                                                    label.setHtml("<a href='#'>" + result.surnameAndName + "</a>");
                                                }
                                            }
                                        });
                                    },
                                    render: function (component) {
                                        component.getEl().on('click', function () {
                                            var changePasswordWindow = Ext.create('widget.changepasswordwindow');
                                            var form = changePasswordWindow.down('form');
                                            form.getForm().isValid();
                                            changePasswordWindow.show();
                                        }, component);
                                    }
                                }
                            },
                            {
                                xtype: 'button',
                                iconCls: 'fa fa-sign-out si-red',
                                tooltip: 'Выйти из системы',
                                scale: 'huge',
                                handler: function (button, e, eOpts) {
                                    //Закомментировал маску при выходе из системы
                                    //var viewport = button.up('viewport');
                                    //var loadMask = new Ext.LoadMask({ target: viewport, msg: "Выход из системы" });
                                    //loadMask.show();
                                    Ext.Ajax.request({
                                        method: 'GET',
                                        url: 'Login/Logout',
                                        success: function (response) {
                                            window.location.href = 'Home/Index';
                                            //loadMask.hide();
                                        },
                                        failure: function (response) {
                                            Ext.Msg.alert('Ошибка!', Ext.isString(response.responseData) ? response.responseData : response.responseData.message);
                                            //loadMask.hide();
                                        }
                                    });
                                }
                            }
                        ]
                    }
                ]
            },
            {
                region: 'center',
                xtype: 'tabpanel',
                type: 'mainpanel',
                reference: 'tabPanelCenter'
            }
        ]
});