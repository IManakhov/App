Ext.define('App.view.paymenttransfer.Grid', {
    extend: 'App.base.Grid',
    alias: 'widget.paymenttransferpanel',
    controller: 'paymenttransfer',
    requires: ['App.store.PaymentTransfer'],
    viewConfig: {
        stripeRows: true
    },

    listeners: {
        selectionchange: 'onGridSelectionChange',
        celldblclick: 'onCellDBClick',
        viewready: 'onGridViewReady',
        onCreateBtnClick: 'onCreateBtnClick',
        onRollbackBtnClick: 'onRollbackBtnClick',
        onAcceptBtnClick: 'onAcceptBtnClick',
        onDeclineBtnClick: 'onDeclineBtnClick',
    },

    initComponent: function () {
        this.store = Ext.create('App.store.PaymentTransfer', {
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
                    text: 'Кому',
                    flex: 1,
                    dataIndex: 'OperatorTo',
                    filter: true
                },
                {
                    text: 'Сумма',
                    flex: 1,
                    dataIndex: 'Amount',
                    filter: true
                },
                {
                    text: 'Решение',
                    flex: 1,
                    dataIndex: 'Decision',
                    renderer: App.enum.PaymentTransferDecision.getRenderer,
                    filter: App.enum.PaymentTransferDecision.getFilter()
                }
            ],

            tbar: [
                {
                    iconCls: 'fa fa-plus si-green',
                    action: 'add',
                    text: 'Новый перевод',
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
                },

                {
                    iconCls: 'fa fa-close si-red',
                    action: 'rollback',
                    text: 'Отменить перевод',
                    disabled: true,
                    listeners: {
                        click: function (btn) {
                            var grid = btn.up('grid');
                            grid.fireEvent('onRollbackBtnClick', grid);
                        }
                    }
                },
                {
                    iconCls: 'fa fa-check si-green',
                    action: 'accept',
                    text: 'Принять перевод',
                    disabled: true,
                    listeners: {
                        click: function (btn) {
                            var grid = btn.up('grid');
                            grid.fireEvent('onAcceptBtnClick', grid);
                        }
                    }
                },
                {
                    iconCls: 'fa fa-close si-yellow',
                    action: 'decline',
                    text: 'Отказаться от перевода',
                    disabled: true,
                    listeners: {
                        click: function (btn) {
                            var grid = btn.up('grid');
                            grid.fireEvent('onDeclineBtnClick', grid);
                        }
                    }
                },
            ]
        });

        this.callParent();
    }
});