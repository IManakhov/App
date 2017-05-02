Ext.define('Ext.ux.grid.SelectFieldGrid', {
    extend: 'Ext.grid.Panel',

    requires: ['Ext.toolbar.Paging', 'Ext.ux.grid.FilterBar'],
    border: false,

    selModel: {
        selType: 'checkboxmodel',
        mode: 'SINGLE'
    },

    viewConfig: {
        stripeRows: true
    },
    columnLines: true,
    plugins: [{
        ptype: 'filterbar',
        renderHidden: false,
        showShowHideButton: true,
        showClearAllButton: true
    }],
    
    tbar: [{
        text: 'Выбрать',
        ref: 'selectButton',
        iconCls: 'fa fa-check-square-o',
        style: 'color: green;',
        handler: function () {
            var tbar = this.ownerCt;
            var grid = tbar.ownerCt;
            var window = grid.ownerCt;
            var selectfield = grid.selectfield;
            var selected = grid.selModel.selected.items[0];
            if (selected)
            {
                selectfield.setValue(selected.data.Id);
                window.close();
            }
            else
            {
                Ext.Msg.alert('Внимание!', 'Выберите запись.');
            }
        }
    }],
    listeners: {
        viewready: function (component) {
            var selectedValue = this.selectfield.getValue();
            if (selectedValue && selectedValue.Id) {
                var rowIndex = this.store.find('Id', selectedValue.Id);
                this.getSelectionModel().select(rowIndex, true, true);
            }
            this.getStore().reload();
        },
        itemdblclick: function (_this, record, item, index, e, eOpts) {
            var selectButton = this.down('button[ref=selectButton]');
            selectButton.handler();
        }
    },
    
    initComponent: function () {

        this.dockedItems = {
            xtype: 'pagingtoolbar',
            dock: 'bottom',
            store: this.store,
            displayInfo: true
        };
        this.callParent(arguments);
    }
});