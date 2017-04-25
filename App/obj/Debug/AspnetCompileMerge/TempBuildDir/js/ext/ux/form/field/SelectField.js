Ext.define('Ext.ux.form.field.SelectField', {
    extend: 'Ext.form.field.ComboBox',
    xtype: 'selectfield',

    fieldLabel: 'ZC0 Select Field',

    displayField: 'Name',
    valueField: 'Id',
    autoLoadOnValue: true,

    columns:
        [
            { text: 'Наименование', dataIndex: 'Name', filter: true }
        ],

    expand: Ext.emptyFn,
    triggers:
        {
            select:
                {
                    cls: Ext.baseCSSPrefix + 'form-search-trigger',
                    handler: function () {
                        var me = this;

                        for (i in this.columns) {
                            this.columns[i].flex = this.columns[i].width || this.columns[i].flex || 1;
                        }

                        var grid = Ext.create('Ext.grid.Panel', {
                            selectfield: me,
                            //requires: ['Ext.toolbar.Paging', 'Ext.ux.grid.FilterBar'],
                            border: false,
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
                                    selectfield.setValue(selected.data[selectfield.valueField]);
                                    window.close();
                                }
                            }],
                            listeners: {
                                viewready: function (component) {
                                    var selectedValue = this.selectfield.getValue();
                                    var rowIndex = this.store.find('Id', selectedValue);
                                    this.getSelectionModel().select(rowIndex, true, true);
                                },
                                itemdblclick: function (_this, record, item, index, e, eOpts) {
                                    var selectButton = this.down('button[ref=selectButton]');
                                    selectButton.handler();
                                }
                            },
                            store: this.store,
                            selModel: {
                                selType: 'checkboxmodel',
                                mode: 'SINGLE'
                            },
                            columnLines: true,
                            columns: this.columns,
                            plugins : [{
                                ptype: 'filterbar',
                                renderHidden: false,
                                showShowHideButton: true,
                                showClearAllButton: true
                            }],
                            dockedItems : {
                                xtype: 'pagingtoolbar',
                                dock: 'bottom',
                                store: this.store,
                                displayInfo: true
                            }
                        });

                        var window = Ext.create('Ext.window.Window', {
                            title: this.fieldLabel,
                            height: 400,
                            width: 600,
                            maximizable: true,
                            modal: true,
                            layout: 'fit',
                            items: grid
                        });
                        window.show();
                        this.store.reload();
                    }
                },
            clear:
                {
                    cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                    handler: function () {
                        this.clearValue();
                    }
                },
            picker: { /*cls: 'x-hide-display',*/ disabled: true, hidden: true, handler: 'onTriggerClick', scope: 'this' }
        },

    getValue: function () {
        // If the user has not changed the raw field value since a value was selected from the list,
        // then return the structured value from the selection. If the raw field value is different
        // than what would be displayed due to selection, return that raw value.
        var me = this,
            picker = me.picker,
            rawValue = me.getRawValue(), //current value of text field
            value = me.value; //stored value from last selection or setValue() call

        if (me.getDisplayValue() !== rawValue) {
            value = rawValue;
            me.value = me.displayTplData = me.valueModels = null;
            if (picker) {
                me.ignoreSelection++;
                picker.getSelectionModel().deselectAll();
                me.ignoreSelection--;
            }
        }
        return value ? { Id: value } : null;
    },

    setValue: function (value) {
        var val = value;
        if ("object" === typeof value && "[object Object]" === Object.prototype.toString.call(value)) {
            val = value["Id"];
        }
        Ext.ux.form.field.SelectField.superclass.setValue.call(this, val);
    }
});