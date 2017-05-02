Ext.define('App.view.payment.Grid', {
    extend: 'App.base.Grid',
    alias: 'widget.paymentpanel',
    controller: 'payment',
    requires: ['App.store.Payment'],
    viewConfig: {
        stripeRows: true
    },

    initComponent: function () {
        this.store = Ext.create('App.store.Payment', {
            listeners: {
                beforeload: function (store, opeation) {
                    opeation.params = opeation.params || {};
                    opeation.params.IsOther = true;
                }
            }
        });

        Ext.apply(this, {
            store: this.store,

            columns: [
                {
                    xtype: 'datecolumn',
                    text: 'Дата',
                    flex: 1,
                    dataIndex: 'Date',
                    filter: true
                },
                {
                    text: 'Сумма',
                    flex: 1,
                    dataIndex: 'Amount',
                    filter: true
                },
                {
                    text: 'Баланс',
                    flex: 1,
                    dataIndex: 'BalanceAmount',
                    filter: true
                },
                {
                    text: 'Тип',
                    flex: 1,
                    dataIndex: 'Type',
                    renderer: App.enum.PaymentType.getRenderer,
                    filter: App.enum.PaymentType.getFilter()
                },
            ],

            tbar: [
                {
                    iconCls: 'fa fa-plus si-green',
                    action: 'add',
                    text: 'Добавить',
                    listeners: {
                        click: function (btn) {
                            var grid = btn.up('grid');
                            grid.fireEvent('onCreateBtnClick', grid);
                        }
                    }
                },
                {
                    iconCls: ' fa fa-refresh si-blue',
                    action: 'refresh',
                    text: 'Обновить',
                    listeners: {
                        click: function (btn) {
                            var grid = btn.up('grid');
                            if (grid && grid.getStore) {
                                var store = grid.getStore();
                                if (store)
                                    store.load();
                            }
                        }
                    }
                }
            ]
        });

        this.callParent();
    }
});