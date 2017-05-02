Ext.define('App.view.message.Window', {
    extend: 'App.base.Window',
    alias: 'widget.messagewindow',
    controller: 'message',

    title: 'Сообщение',
    items: [
        {
            xtype: 'form',
            bodyPadding: '5',
            fieldDefaults: {
                labelWidth: 100,
                anchor: '100%'
            },

            items: [
                {
                    xtype: 'datefield',
                    fieldLabel: 'Дата',
                    name: 'Date',
                    allowBlank: false,
                    editable: true,
                    readOnly: true,
                    format: 'd.m.Y',
                },
                {
                    xtype: 'appselectfield',
                    fieldLabel: 'От кого',
                    listView: 'App.view.operator.Grid',
                    textProperty: 'Name',
                    name: 'OperatorFrom',
                    allowBlank: false,
                    model: 'App.model.Operator',
                    store: 'App.store.Operator',
                    columns: [
                        {
                            xtype: 'actioncolumn',
                            width: 40,
                            items:
                            [{
                                getClass: function (v, meta, rec) {
                                    if (rec.get('IsFavorite')) {
                                        this.items[0].tooltip = 'Избранный';
                                        return 'fa fa-star';
                                    } else {
                                        this.items[0].tooltip = 'Добавить в избранные';
                                        return 'fa fa-star-o';
                                    }
                                }
                            }]
                        },
                        {
                            text: 'Логин',
                            flex: 1,
                            dataIndex: 'Login',
                            filter: true
                        },
                        {
                            text: 'ФИО',
                            flex: 1,
                            dataIndex: 'FIO',
                            filter: true
                        },
                        {
                            text: 'Статус',
                            flex: 1,
                            dataIndex: 'Status',
                            renderer: App.enum.OperatorStatus.getRenderer,
                            filter: App.enum.OperatorStatus.getFilter()
                        }
                    ],
                    onStoreBeforeLoad: function (store, operation) {
                        store.getProxy().setExtraParam('Status', 10);
                    }
                },
                {
                    xtype: 'textfield',
                    fieldLabel: 'Сообщение',
                    name: 'Name'
                },
                {
                    xtype: 'textarea',
                    fieldLabel: 'Текст',
                    name: 'Text'
                }
            ]
        }
    ],
    buttons: [
        {
            action: 'Save',
            text: 'Отправить',
            iconCls: 'fa fa-floppy-o',
            listeners: {
                click: function (btn) {
                    var wnd = btn.up('window');
                    wnd.fireEvent('onSaveBtnClick', wnd);
                }
            }
        },
        {
            action: 'Cancel',
            text: 'Закрыть',
            iconCls: 'fa fa-undo si-red',
            listeners: {
                click: function (btn) {
                    var wnd = btn.up('window');
                    wnd.fireEvent('onCancelBtnClick', wnd);
                }
            }
        }
    ]
});