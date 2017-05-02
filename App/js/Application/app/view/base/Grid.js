Ext.define('App.base.Grid', {
    extend: 'Ext.grid.Panel',

    PermissionPath: '',

    listeners: {
        selectionchange: 'onGridSelectionChange',
        celldblclick: 'onCellDBClick',
        viewready: 'onGridViewReady',
        onDeleteBtnClick: 'onDeleteBtnClick',
        onEditBtnClick: 'onEditBtnClick',
        onCreateBtnClick: 'onCreateBtnClick',
    },


    tbar: [
        {
            iconCls: 'fa fa-plus si-green',
            action: 'add',
            hidden: true,
            text: 'Добавить',
            listeners: {
                click: function (btn) {
                    var grid = btn.up('grid');
                    grid.fireEvent('onCreateBtnClick', grid);
                }
            }
        },
        {
            iconCls: 'fa fa-pencil si-yellow',
            action: 'edit',
            hidden: true,
            text: 'Изменить',
            listeners: {
                click: function (btn) {
                    var grid = btn.up('grid');
                    grid.fireEvent('onEditBtnClick', grid);
                }
            }
        },
        {
            action: 'delete',
            hidden: true,
            iconCls: 'fa fa-trash-o si-red',
            text: 'Удалить',
            listeners: {
                click: function (btn) {
                    var grid = btn.up('grid');
                    grid.fireEvent('onDeleteBtnClick', grid);
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
    ],

    initBbar: true,

    initComponent: function () {
        var me = this;
        Ext.applyIf(me, {
            selModel: {
                selType: 'checkboxmodel',
                mode: "MULTI"
            },
            plugins: [
                {
                    ptype: 'filterbar',
                    renderHidden: false,
                    showShowHideButton: true,
                    showClearAllButton: true
                }
            ]
        });
        if(me.initBbar){
            Ext.apply(me,
                {
                    bbar: {
                        xtype: 'pagingtoolbar',
                        store: me.store,
                        displayMsg: 'Данные на отображение {0} - {1} из {2}',
                        emptyMsg: "Нет данных для просмотра",
                    }
                });
        }
        me.callParent();
    }
});