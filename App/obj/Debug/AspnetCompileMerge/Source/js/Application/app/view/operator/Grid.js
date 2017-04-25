Ext.define('App.view.operator.Grid', {
    extend: 'App.base.Grid',
    alias: 'widget.operatorpanel',
    controller: 'operator',
    requires: ['App.store.Operator'],

    viewConfig: {
        stripeRows: true,
    },

    initComponent: function () {
        var me = this;
        this.store = Ext.create('App.store.Operator');

        Ext.apply(this, {
            store: this.store,

            columns: this.columns || [
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
                        },
                        handler: function (view, rowIndex, colIndex, item, e, record, row) {

                            Ext.Ajax.request({
                                url: ('/Operator/Favorite'),
                                params: { favoriteId: record.get('Id') },
                                success: function (response, options) {
                                    var data = Ext.decode(response.responseText);
                                    if (data.success) {
                                        me.store.reload();
                                    }
                                    else {
                                        Ext.Msg.alert('Ошибка', data ? data.message : 'Неизвестная ошибка');
                                    }
                                },
                                failure: function (response) {
                                    Ext.Msg.alert('Ошибка', data ? data.message : 'Неизвестная ошибка');
                                },
                                timeout: 60000 //60 секунд (по умолчанию 30)
                            });
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


        });

        this.callParent();
    }
});