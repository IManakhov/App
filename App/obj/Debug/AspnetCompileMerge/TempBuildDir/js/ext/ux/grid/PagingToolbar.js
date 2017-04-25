Ext.define('Ext.ux.grid.PagingToolbar', {
    extend: 'Ext.toolbar.Paging',
    alias: 'widget.pagingtoolbar',
    displayInfo: true,
    displayMsg: 'Данные на отображение {0} - {1} из {2}',
    emptyMsg: "Нет данных для просмотра",
    initComponent: function () {
        var me = this;

        me.items = [
        {
            xtype: 'tbseparator'
        },
        {
            xtype: 'combo',
            editable: false,
            //hideTrigger: true,
            fieldLabel: 'Записей',
            width: 125,
            labelWidth: 50,
            mode: 'local',
            triggerAction: 'all',
            store: new Ext.data.SimpleStore({
                fields: ['count'],
                data: [[30], [60], [100], [200], [500]],
                autoLoad: false
            }),
            valueField: 'count',
            displayField: 'count',
            listeners: {
                select: function (cb) {
                    me.store.currentPage = 1;
                    me.store.pageSize = parseInt(cb.getRawValue(), 10);
                    me.doRefresh();
                },
                afterrender: function () {
                    this.setValue(me.store.pageSize);
                }
            }
        }
        ];

        me.callParent(arguments);
    }
});
