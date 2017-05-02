Ext.define('App.view.personalarea.BalanceHistoryGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.balancehistorypanel',
    controller: 'personalarea',
    requires: ['App.store.BalanceHistory'],
    viewConfig: {
        stripeRows: true
    },

    initComponent: function () {
        this.store = Ext.create('App.store.BalanceHistory', {});

        Ext.apply(this, {
            store: this.store,

            columns: [
                {
                    xtype: 'datecolumn',
                    text: 'Дата c',
                    flex: 1,
                    dataIndex: 'DateFrom',
                    filter: true
                },
                {
                    xtype: 'datecolumn',
                    text: 'Дата по',
                    flex: 1,
                    dataIndex: 'DateTo',
                    filter: true
                },
                {
                    text: 'Сумма',
                    flex: 1,
                    dataIndex: 'Amount',
                    filter: true
                }
            ],

            tbar: [
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