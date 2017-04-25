Ext.define('App.view.message.Grid', {
    extend: 'App.base.Grid',
    alias: 'widget.messagepanel',
    controller: 'message',
    requires: ['App.store.Message'],
    viewConfig: {
        stripeRows: true
    },

    initComponent: function () {
        this.store = Ext.create('App.store.Message', {
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
                    text: 'От кого',
                    flex: 1,
                    dataIndex: 'OperatorFrom',
                    filter: true
                },
                {
                    text: 'Сообщение',
                    flex: 1,
                    dataIndex: 'Name',
                    filter: true
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