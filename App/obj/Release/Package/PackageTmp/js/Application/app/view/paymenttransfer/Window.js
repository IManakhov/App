Ext.define('App.view.paymenttransfer.Window', {
    extend: 'App.base.Window',
    alias: 'widget.paymenttransferwindow',
    controller: 'paymenttransfer',

    title: 'Денежный перевод',
    items: [
        {
            xtype: 'form',
            bodyPadding: '5',
            fieldDefaults: {
                labelWidth: 170,
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
                    readOnly: true,
                    model: 'App.model.Operator',
                    store: 'App.store.Operator',
                    columns: [
                        {
                            text: 'ФИО',
                            flex: 1,
                            dataIndex: 'FIO',
                            filter: true
                        }
                    ],
                    onStoreBeforeLoad: function (store, operation) {
                        store.getProxy().setExtraParam('Status', 10);
                    }
                },
                {
                    xtype: 'appselectfield',
                    fieldLabel: 'Кому',
                    listView: 'App.view.operator.Grid',
                    textProperty: 'Name',
                    name: 'OperatorTo',
                    allowBlank: false,
                    model: 'App.model.Operator',
                    store: 'App.store.Operator',
                    columns: [
                        {
                            xtype: 'actioncolumn',
                            id: 'actionColumnFavorites',
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
                    xtype: 'numberfield',
                    fieldLabel: 'Сумма к оплате',
                    readOnly: true,
                    id: 'AmountFromItem',
                    name: 'AmountFrom'
                },
                {
                    xtype: 'numberfield',
                    fieldLabel: 'Комиссия (5%)',
                    readOnly: true,
                    id: 'ComissionItem',
                    name: 'Comission'
                },
                {
                    xtype: 'numberfield',
                    fieldLabel: 'Сумма на перевод',
                    allowDecimal: false,
                    name: 'AmountTo',
                    listeners: {
                        change: function (cmp, newVal, oldVal) {
                            var wnd = cmp.up('form');
                            var amountFrom = newVal / 0.95;
                            wnd.down('#AmountFromItem').setValue(amountFrom);
                            wnd.down('#ComissionItem').setValue(amountFrom - newVal);
                        }
                    }
                },

                {
                    name: 'Decision',
                    xtype: 'combobox',
                    editable: false,
                    fieldLabel: 'Статус',
                    valueField: 'Value',
                    displayField: 'Name',
                    store: App.enum.PaymentTransferDecision.getStore(),
                    value: 0,
                    readOnly: true,
                    allowBlank: false
                },
                {
                    xtype: 'textarea',
                    name: 'Text',
                    fieldLabel: 'Сообщение',
                }
            ]
        }
    ]
});