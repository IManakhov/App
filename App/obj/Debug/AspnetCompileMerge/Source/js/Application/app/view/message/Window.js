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
                            text: 'ФИО',
                            flex: 1,
                            sortable: true,
                            dataIndex: 'FIO',
                            filter: true
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
    ]
});