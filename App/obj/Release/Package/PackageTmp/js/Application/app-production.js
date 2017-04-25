Ext.define('App.enum.Enums', {

    items: {},

    getItems: function () {
        var data = [];
        for (var i in this.items) {
            data.push({ "Name": this.items[i], "Value": i });
        }
        return data;
    },

    getRenderer: function (val) {
        return this.items[val] || "";
    },

    getFilter: function () {
        return {
                    xtype: 'combobox',
                    type: 'list',
                    store: this.getStore(true),
                    multiSelect: false,
                    displayField: 'Name',
                    valueField: 'Value'
                }
    },

    getStore: function(isFilter) {
        return Ext.create('Ext.data.Store',
        {
            fields: ['Value', 'Name'],
            data: isFilter ? [{ "Name": '-', "Value": null }].concat(this.getItems()) : this.getItems()
        });
    }
});

//Месяцы
Ext.define('App.enum.Month', {
    extend: 'App.enum.Enums',
    singleton: true,

    items: {
        1: "Январь",
        2: "Февраль",
        3: "Март",
        4: "Апрель",
        5: "Май",
        6: "Июнь",
        7: "Июль",
        8: "Август",
        9: "Сентябрь",
        10: "Октябрь",
        11: "Ноябрь",
        12: "Декабрь"
    },
    getRenderer: function (val) {
        return App.enum.Month.items[val] || "";
    },
    getStore: function (isFilter) {
        return Ext.create('Ext.data.Store',
        {
            fields: ['Id', 'Name'],
            data: isFilter ? [{ "Name": '-', "Id": null }].concat(this.getItems()) : this.getItems()
        });
    },

    getItems: function () {
        var data = [];
        for (var i in this.items) {
            data.push({ "Name": this.items[i], "Id": i });
        }
        return data;
    }
});

Ext.define('App.enum.OperatorStatus', {
    extend: 'App.enum.Enums',
    singleton: true,

    items: {
        10: "Активный",
        20: "Удалился"
    },
    getRenderer: function (val) {
        return App.enum.OperatorStatus.items[val] || "";
    }
});

Ext.define('App.enum.YesOrNo', {
    extend: 'App.enum.Enums',
    singleton: true,

    items: {
        10: "Нет",
        20: "Да"
    },
    getRenderer: function (val) {
        return App.enum.YesOrNo.items[val] || "";
    }
});

Ext.define('App.enum.ActiveStatus', {
    extend: 'App.enum.Enums',
    singleton: true,

    items: {
        0: "Не активен",
        10: "Активен"
    },

    getRenderer: function (val) {
        return App.enum.ActiveStatus.items[val] || "";
    }
});

Ext.define('App.enum.PaymentTransferDecision', {
    extend: 'App.enum.Enums',
    singleton: true,

    items: {
        0: "Отсутствует",
        10: "Отменил отправитель",
        20: "Отменил получатель",
        30: "Получил получатель"
    },
    getRenderer: function (val) {
        return App.enum.PaymentTransferDecision.items[val] || "";
    }
});

Ext.define('App.enum.PaymentType', {
    extend: 'App.enum.Enums',
    singleton: true,

    items: {
        0: "Отсутствует",
        10: "Пополнение cчета",
        20: "Перевод счета на счет"
    },
    getRenderer: function (val) {
        return App.enum.PaymentType.items[val] || "";
    }
});
// custom Vtype for vtype:'phone' 
// Vtype for phone number validation
Ext.apply(Ext.form.VTypes, {
    'phoneText': 'Телефон должен состоять из 11 или 12 цифр',
    'phoneMask': /[\-\+0-9\(\)\s\.Ext]/,
    'phoneRe': /^(^(\d{11})|^(\d{12}))$/,
    'phone': function (v) {
        return this.phoneRe.test(v);
    },
    phoneEmptyText: '89776665544 или 88437776655',
});

// Function to format a phone number
Ext.apply(Ext.util.Format, {
    phoneNumber: function (value) {
        var phoneNumber = value.replace(/\./g, '').replace(/-/g, '').replace(/[^0-9]/g, '');

        if (phoneNumber !== '' && phoneNumber.length === 10) {
       //     return '' + phoneNumber.substr(0, 3) + '' + phoneNumber.substr(3, 3) + '-' + phoneNumber.substr(6, 4);
        } else {
            return value;
        }
        return value;
    }
});
Ext.define('Ext.form.field.Month', {
    extend: 'Ext.form.field.Date',
    alias: 'widget.monthfield',
    requires: ['Ext.picker.Month'],
    alternateClassName: ['Ext.form.MonthField', 'Ext.form.Month'],
    selectMonth: null,
    createPicker: function () {
        var me = this,
            format = Ext.String.format;
        return Ext.create('Ext.picker.Month', {
            pickerField: me,
            ownerCt: me.ownerCt,
            renderTo: document.body,
            floating: true,
            hidden: true,
            focusOnShow: true,
            minDate: me.minValue,
            maxDate: me.maxValue,
            disabledDatesRE: me.disabledDatesRE,
            disabledDatesText: me.disabledDatesText,
            disabledDays: me.disabledDays,
            disabledDaysText: me.disabledDaysText,
            format: me.format,
            showToday: me.showToday,
            startDay: me.startDay,
            minText: format(me.minText, me.formatDate(me.minValue)),
            maxText: format(me.maxText, me.formatDate(me.maxValue)),
            listeners: {
                afterrender: {
                    scope: me,
                    fn: function (c) {
                        var me = c;
                        me.el.on("mousedown", function (e) {
                            e.preventDefault();
                        }, c);
                    }
                },
                select: {
                    scope: me,
                    fn: me.onSelect
                },
                monthdblclick: {
                    scope: me,
                    fn: me.onOKClick
                },
                yeardblclick: {
                    scope: me,
                    fn: me.onOKClick
                },
                OkClick: {
                    scope: me,
                    fn: me.onOKClick
                },
                CancelClick: {
                    scope: me,
                    fn: me.onCancelClick
                }
            },
            keyNavConfig: {
                esc: function () {
                    me.collapse();
                }
            }
        });
    },
    onCancelClick: function () {
        var me = this;
        me.selectMonth = null;
        me.collapse();
    },
    onOKClick: function () {
        var me = this;
        if (me.selectMonth) {
            me.setValue(me.selectMonth);
            me.fireEvent('select', me, me.selectMonth);
        }
        me.collapse();
    },
    onSelect: function (m, d) {
        var me = this;
        me.selectMonth = new Date((d[0] + 1) + '/1/' + d[1]);
    }
});
Ext.define('App.ux.form.PhoneField', {
    extend: 'Ext.form.field.Text',
    xtype: 'ux-phonefield',

    config: {
        valueTpl: null,
        tplValue: '(___) ___-____',
        leftValue: null,
        leftReadOnly: false
    },

    maskRe: /[0-9]/,

    applyValueTpl: function (tpl) {
        if (tpl && !tpl.isTemplate) {
            tpl = new Ext.XTemplate(tpl);
        }

        return tpl;
    },

    updateTplValue: function (value) {
        var arr = value.split(''),
            i = 0,
            len = arr.length,
            tpl = '',
            valIdx = 0,
            val;

        for (; i < len; i++) {
            val = arr[i];

            if (val !== '_') {
                tpl += val;
            } else {
                tpl += '{[values[' + valIdx + ']]}';

                valIdx++;
            }
        }

        this.setValueTpl(tpl);
    },

    initEvents: function () {
        var me = this,
            inputEl = me.inputEl;

        me.callParent();

        if (!me.selectOnFocus && !me.emptyText) {
            //add mousedown listener if one already isn't added
            me.mon(inputEl, 'mousedown', me.focusEnd, me);
        }

        if (!me.enableKeyEvents) {
            me.mon(inputEl, 'keydown', me.onKeyDown, me);
            me.mon(inputEl, 'keyup', me.onKeyUp, me);
        }
    },

    onFocus: function () {
        this.callParent(arguments);

        this.focusEnd();
    },

    onMouseDown: function (e) {
        this.callParent(arguments);

        this.focusEnd(e);
    },

    focusEnd: function (e) {
        var me = this,
            len = me.getRawValue().length;

        setTimeout(function () {
            me.selectText(len, len);
        }, 10);

        if (e && e.isEvent) {
            e.preventDefault();
        }
    },

    onKeyDown: function (e) {
        var me = this,
            charCode = e.getCharCode(),
            key = String.fromCharCode(e.getCharCode());

        if (!/[0-9]+/.test(key) && charCode < 96 && charCode > 105) {
            e.stopEvent();
        } else if (me.enableKeyEvents) {
            me.callParent(arguments);
        }
    },

    onKeyUp: function (e) {
        var me = this,
            charCode = e.getCharCode(),
            key = String.fromCharCode(e.getCharCode());

        if (/[0-9]+/.test(key) || (charCode > 95 && charCode < 106)) {
            me.setValue(me.getValue());
        }

        me.callParent(arguments);
    },

    processRawValue: function (value) {
        value = this.callParent([value]);
        value = value.replace(/[^0-9]/g, '');

        return value;
    },

    valueToRaw: function (value) {
        var me = this,
            tpl = me.getValueTpl(),
            valueTpl = me.getTplValue().replace(/[^0-9_]/g, ''),
            valueTplLen = valueTpl.length,
            leftValue = me.getLeftValue() || '',
            start = 0,
            valueLength;

        if (leftValue) {
            leftValue = leftValue.toString();
            start = leftValue.length;

            if (value) {
                value = value.replace(new RegExp('^' + leftValue), '');
                start += value.length;
            }
        }

        value = me.callParent([value]).replace(/[^0-9]/g, '');

        valueLength = value.length;

        value = leftValue + valueTpl.substr(start, valueTplLen - valueLength) + value;
        value = value.split('');

        valueLength = value.length;

        if (!me.getLeftReadOnly() && valueLength > valueTplLen) {
            value = Ext.Array.slice(value, valueLength - valueTplLen);
        }

        return me.callParent([tpl.apply(value)]);
    }
});
/**
*   @class B4.form.SelectField
*
*   Поле, значение которого выбирается из справочника
* 
*   # Example usage:
*
*   // Параметр model необходимо определять, если не определен параметр store
*   @example
*   {
*       xtype: 'appselectfield',
*       listView: 'B4.view.Author.Grid',
*       textProperty: 'Name',
*       name: 'Author',
*       store: 'B4.store.Author',
*       model: 'B4.model.Author'
*   } 
*
*/
Ext.define('App.ux.form.SelectField', {
    extend: 'Ext.form.field.Trigger',
    alias: 'widget.appselectfield',
    alternateClassName: ['App.SelectField'],

    requires: ['Ext.grid.Panel', 'Ext.ux.grid.FilterBar'],

    /**
    * @cfg {Boolean} allowBlank
    * Флаг: разрешено ли пустое значение поля
    */
    allowBlank: true,

    /**
    * @cfg {String} listView
    * Представление, которое используется для отображения данных справочника
    */
    listView: null,

    /**
    * @cfg {String} listRenderTo
    * Селектор, с помощью которого запрашивается контейнер окна выбора
    */
    windowContainerSelector: null,

    /**
    * @cfg {String} listRenderTo
    * Открывать ли окно выбора модально
    */
    modalWindow: true,

    /**
    * @cfg {Object} windowCfg
    * Параметры конфигурации окна выбора
    */
    windowCfg: null,

    /**
    * @cfg {String} editView
    * Представление, которое используется для редактирования данных справочника
    */
    editView: null,

    /**
    * @cfg {String/Object} store
    * Store
    * Нельзя задавать storeId, если store заранее не был создан
    */
    store: null,

    /**
    * @cfg {"SINGLE"/"MULTI"/"SIMPLE"} selectionMode
    * Режим выбора для Ext.selection.CheckboxModel: SINGLE, MULTI, SIMPLE
    * Поведение каждого из режимов описано в доках к Ext.selection.Model.mode
    */
    selectionMode: 'SINGLE',

    /**
    * @cfg {String} title
    * Заголовок для окна выбора
    */
    title: 'Выбор элемента',

    idProperty: 'Id',

    textProperty: 'Name',

    /**
    * @cfg {Bool} isGetOnlyIdProperty return only idProperty value
    */
    isGetOnlyIdProperty: true,

    /**
    * @cfg {Object} columns
    * Столбцы таблицы
    */
    columns: null,

    trigger1Cls: 'x-form-search-trigger',
    trigger2Cls: 'x-form-clear-trigger',

    /**
    * Метод для получения store
    * @return {B4.base.Store} store  
    */
    getStore: function () {
        return this.store;
    },

    constructor: function () {
        var me = this;

        me.callParent(arguments);


        // выносим конфигурацию тулбара дабы не дублировать ее
        Ext.apply(me, {
            _toolbarSelectBtnConfig: {
                xtype: 'button',
                text: 'Выбрать',
                iconCls: 'fa fa-check si-green',
                handler: me.onSelectValue,
                scope: me
            },
            _toolbarCloseBtnConfig: {
                xtype: 'button',
                text: 'Закрыть',
                iconCls: 'fa fa-times si-red',
                handler: me.onSelectWindowClose,
                scope: me
            },
            _toolbarSelectAllBtnConfig: {
                xtype: 'button',
                text: 'Выбрать все',
                iconCls: 'icon-basket-add',
                handler: me.onSelectAll,
                scope: me
            }
        });
    },

    initComponent: function () {
        var me = this,
            store = me.store;

        // подготовка хранилища, если передано како-либо значение
        if (store) {
            // если передана строка
            if (Ext.isString(store)) {
                // сначала пробуем найти хранилище по его имени
                me.store = Ext.StoreMgr.lookup(store);
                if (Ext.isEmpty(me.store)) {
                    // иначе считаем что передано имя класса
                    me.store = Ext.create(store);
                }
            }
        } else if (me.model && Ext.isString(me.model)) {
            me.store = Ext.create('Ext.data.Store', {
                model: me.model,
                autoLoad: false,
                groupField: me.storeGroupField || null
            });
        } else {
            me.store = Ext.StoreMgr.lookup('ext-empty-store');
        }

        if (!Ext.isEmpty(me.store) && Ext.isFunction(me.store.on)) {
            me.store.on('beforeload', me.onStoreBeforeLoad, me);
        }

        me.callParent(arguments);
    },

    onStoreBeforeLoad: function (store, operation) {
        var me = this, options = {};
        options.params = operation.params || {};
        me.fireEvent('beforeload', me, options, store);
        Ext.apply(operation, options);
    },

    destroy: function () {
        var me = this;
        if (me.store) {
            me.store.un('beforeload', me.onStoreBeforeLoad);
        }

        if (me.selectWindow) {
            me.selectWindow.destroy();
        }
        me.callParent(arguments);
    },

    _makeSelectionModel: function () {
        var me = this,
            mode = me.selectionMode.toUpperCase(),
            tooltip = Ext.create('Ext.tip.ToolTip', {
                html: 'Выбрать все отображаемые записи'
            });

        var selModel = Ext.create('Ext.selection.CheckboxModel', {
            mode: me.selectionMode,
            checkOnly: me.selectionMode == 'MULTI',
            multipageSelection: {},
            getSelected: function () {
                return this.multipageSelection;
            },
            listeners: {
                selectionchange: function (selectionModel, selectedRecords) {
                    if (selectedRecords.length == 0 && this.store.loading == true && this.store.currentPage != this.page) {
                        return;
                    }

                    if (this.store.loading == true) {
                        this.multipageSelection = {};
                        return;
                    }

                    this.store.data.each(function (i) {
                        Ext.Object.each(this.getSelected(), function (property, value) {
                            if (i.id === value.id) {
                                delete this.multipageSelection[property];
                            }
                        }, this);
                    }, this);

                    if (me.selectionMode.toUpperCase() == 'SINGLE') {
                        Ext.each(selectedRecords, function (i) {
                            this.multipageSelection[0] = i;
                        }, this);
                    } else {
                        Ext.each(selectedRecords, function (i) {
                            if (!Ext.Object.getKey(this.multipageSelection, i))
                                this.multipageSelection[Ext.Object.getSize(this.multipageSelection)] = i;
                        }, this);
                    }
                },
                buffer: 5
            },
            restoreSelection: function () {
                if (!this.store) this.store = me.store;
                this.store.data.each(function (item) {
                    Ext.Object.each(this.getSelected(), function (property, value) {
                        if (item.id === value.id) {
                            this.select(item, true, true);
                        }
                    }, this);
                }, this);
                this.page = this.store.currentPage;
            }
        });

        return selModel;
    },

    /**
    * Показываем окно со справочником
    */
    onTrigger1Click: function () {
        var me = this,
            mode = me.selectionMode.toUpperCase();

        if (me.fireEvent('beforeselect', me) === false) {
            return false;
        }
        // флаг необходимости опустить создание тулбара окна
        var doNotCreateWindowToolbar = false;

        if (Ext.isString(mode)) {
            if (mode != 'SINGLE' && mode != 'MULTI') {
                console.error('Config error:', 'incorrect selection mode');
                return;
            }
        }

        if (mode === 'MULTI' && !me.isRendered) {
            me._toolbarSelectBtnConfig.items.push(me._toolbarSelectAllBtnConfig);
            me.isRendered = true;
        }

        // если предтавление списка отсутствует
        if (Ext.isEmpty(me.gridView)) {
            var gridCreated = false;

            if (Ext.isString(me.listView)) {

                var gridViewCfg = {
                    title: null,
                    border: false,
                    closable: false,
                    store: me.store,
                    selModel: me._makeSelectionModel()
                };

                if (me.columns)
                    gridViewCfg.columns = me.columns;
                me.gridView = Ext.create(me.listView, gridViewCfg);
                gridCreated = true;

                if (Ext.isFunction(me.gridView.getStore)) {
                    var gridStore = me.gridView.getStore();
                    if (gridStore) {
                        me.store = gridStore;
                        me.store.un('beforeload', me.onStoreBeforeLoad, me);
                        me.store.on('beforeload', me.onStoreBeforeLoad, me);
                    } else {
                        me.gridView.reconfigure(me.store);
                    }
                }
            }
            else if (Ext.isObject(me.listView) && me.listView.isComponent) {

                me.gridView = me.listView;
                me.store = me.listView.store;
            }
            else {

                var columns = (Ext.isObject(me.listView) ? me.listView.columns : []) || [];

                if (Ext.isEmpty(columns)) {
                    if (Ext.isArray(me.columns)) {
                        columns = me.columns;
                    } else if (Ext.isObject(me.columns)) {
                        columns = [me.columns];
                    }

                    if (Ext.isEmpty(columns)) {
                        columns.push({
                            xtype: 'gridcolumn',
                            dataIndex: me.textProperty,
                            header: 'Ð Ð°Ð¸Ð¼ÐµÐ½Ð¾Ð²Ð°Ð½Ð¸Ðµ',
                            flex: 1
                        });
                    }
                }
                var cfg = Ext.apply({}, me.listView || {});
                Ext.applyIf(cfg, {
                    xtype: 'gridpanel',
                    plugins: [{
                        ptype: 'filterbar',
                        renderHidden: false,
                        showShowHideButton: true,
                        showClearAllButton: true
                    }],
                    features: me.features || [],
                    dockedItems: [
                        {
                            xtype: 'pagingtoolbar',
                            displayInfo: true,
                            store: me.store,
                            dock: 'bottom'
                        }
                    ]
                });

                Ext.apply(cfg, {
                    title: null,
                    border: false,
                    store: me.store,
                    columns: columns,
                    selModel: me._makeSelectionModel()
                });
                me.gridView = Ext.widget(cfg);
                gridCreated = true;
            }


            if (gridCreated) {

                var gridToolbar = me.gridView.getDockedItems('toolbar[dock="top"]');
                if (gridToolbar && gridToolbar.length) {
                    doNotCreateWindowToolbar = true;
                    gridToolbar = gridToolbar[0];
                    gridToolbar.insert(0, me._toolbarSelectBtnConfig);
                    gridToolbar.add('->');
                    gridToolbar.add(me._toolbarCloseBtnConfig);
                }
                me.fireEvent('gridcreated', me, me.gridView);
            }
        }

        me.store.on('load', me.gridView.getSelectionModel().restoreSelection, me.gridView.getSelectionModel());
        if (mode === 'SINGLE') {
            me.gridView.on('itemdblclick', function (grid, record) {
                grid.getSelectionModel().multipageSelection[0] = record;
                grid.getSelectionModel().select(record, true, true);
                return me.onSelectValue.apply(me, arguments);
            }, me);
        }

        me.store.load();

        me.gridView.getSelectionModel().deselectAll(true);
        
        if (!me.selectWindow) {
            var wndConfig = {};
            if (Ext.isObject(me.windowCfg))
                Ext.apply(wndConfig, me.windowCfg);

            me.fireEvent('beforewindowcreated', me, wndConfig);

            var renderToCmp = Ext.ComponentQuery.query('tabpanel[type=mainpanel]')[0].getActiveTab();
            if (Ext.isString(me.windowContainerSelector)) {
                renderToCmp = Ext.ComponentQuery.query(me.windowContainerSelector);
                if (Ext.isArray(renderToCmp))
                    renderToCmp = renderTo[0];
            }

            Ext.applyIf(wndConfig, {
                height: 500,
                width: 600,
                constrain: true,
                modal: me.modalWindow == true,
                layout: 'fit',
                title: me.title
            });

            Ext.apply(wndConfig, {
                items: [me.gridView],
                listeners: {
                    close: function () {
                        delete me.gridView;
                        delete me.selectWindow;
                    }
                },
                dockedItems: doNotCreateWindowToolbar ? [] : [
                    {
                        xtype: 'toolbar',
                        dock: 'top',
                        items: [
                            me._toolbarSelectBtnConfig,
                            '->',
                            me._toolbarCloseBtnConfig
                        ]
                    }
                ]
            });

            me.selectWindow = Ext.create('Ext.window.Window', wndConfig);

            me.fireEvent('windowcreated', me, me.selectWindow);

            me.gridView.on('setSavedId', me.onNewSavedId, me);
        }

        var addBtn = me.selectWindow.down('button[action=add]');
        if (addBtn && me.hideAddBtn) { addBtn.hide(); addBtn.BlockedShow = true; }
        var editBtn = me.selectWindow.down('button[action=edit]');
        if (editBtn) editBtn.hide();
        var deleteBtn = me.selectWindow.down('button[action=delete]');
        if (deleteBtn) deleteBtn.hide();
        me.selectWindow.forbitEdit = true;

        renderToCmp.add(me.selectWindow);
        me.selectWindow.show();
        me.fireEvent('afterwindowshow', me, me.selectWindow);
        me.selectWindow.center();
    },

    onTrigger2Click: function () {
        var me = this;

        if (me.fireEvent('beforeclear', me) === false) {
            return;
        }

        me.setValue(null);
        me.updateDisplayedText();
    },

    onSelectWindowClose: function () {
        delete this.gridView;
        this.selectWindow.close();
        delete this.selectWindow;
    },

    onSelectValue: function () {
        var me = this,
            rec = me.gridView.getSelectionModel().getSelected();

        if (!rec || rec.length == 0) {
            Ext.Msg.alert('Ошибка', 'Необходимо выбрать запись!');
            return;
        }

        if (me.selectionMode.toUpperCase() == 'SINGLE') {
            rec = rec[0] || rec.items[0];
            if (Ext.isEmpty(rec)) {
                Ext.Msg.alert('Ошибка', 'Необходимо выбрать запись!');
                return;
            }
            me.setValue(rec.getData());
        }
        else {
            var data = [];
            for (var i in rec.items) {
                data.push(rec.items[i].getData());
            }
            me.setValue(data);
        }

        me.onSelectWindowClose();
    },

    onNewSavedId: function (id) {
        var me = this,
            controller = me.getStoreController();
        Ext.Ajax.request({
            url: ('/'+ controller +'/Get'),
            params: {
                id: id
            },
            success: function (response) {
                var data = Ext.decode(response.responseText);
                me.setValue(data);
                me.selectWindow.close();
            },
            failure: function (response) {
                //Ext.msg("Ошибка при получении", Ext.decode(response.statusText).message);
            }
        });
    },

    getStoreController: function(){
        var me = this,
                urlSplited = me.gridView.getStore().getProxy().url.split('/');
        return urlSplited.length == 3 ? urlSplited[1] : urlSplited[0];
    },

    /**
    * Обработка события при выборе всех
    */
    onSelectAll: function () {
        var me = this;

        me.updateDisplayedText('Выбраны все');
        me.value = 'All';
        me.selectWindow.hide();
    },

    /**
    * Устанавливаем значение поля. 
    * @param {Object} data Новое значение
    * @return {B4.form.SelectField} this
    */
    setValue: function (data) {
        var me = this,
            oldValue = me.getValue(),
            isValid = me.getErrors() != '';
        me.value = data;
        me.updateDisplayedText(data);

        me.fireEvent('validitychange', me, isValid);
        me.fireEvent('change', me, data, oldValue);
        me.validate();
        return me;
    },

    /**
    * Возвращает значение поля. 
    * @return {Object} this.value
    */
    getValue: function () {
        var me = this;
        if (Ext.isObject(me.value)) {
            return me.isGetOnlyIdProperty ? { Id: me.value[me.idProperty] } : me.value;
        }

        if (Ext.isArray(me.value)) {
            return Ext.Array.map(me.value, function (data) { return me.isGetOnlyIdProperty ? { Id: data[me.idProperty] } : data; });
        }

        return me.value;
    },

    /**
    * Возвращает текст поля. 
    * @return {Object} this.rawValue
    */
    getText: function () {
        return this.rawValue;
    },

    /**
    * Возвращает значение поля для передачи на сервер. 
    * @return {Object} this.value[this.dataField]
    */
    getSubmitValue: function () {
        var me = this;

        if (!Ext.isEmpty(me.idProperty)) {
            if (Ext.isEmpty(me.value))
                return null;

            if (Ext.isString(me.value))
                return me.value;

            if (Ext.isObject(me.value))
                return me.value[me.idProperty];

            if (Ext.isArray(me.value))
                return Ext.Array.map(me.value, function (data) { return data[me.idProperty]; });
        }

        return me.callParent(arguments);
    },

    /**
    * Обновление отображаемого текста в поле
    * @param {Object} data Объект, из которого берется новое значение
    * @private
    */
    updateDisplayedText: function (data) {
        var me = this,
            text;

        if (Ext.isString(data)) {
            text = data;
        }
        else {
            text = data && data[me.textProperty] ? data[me.textProperty] : '';
            if (Ext.isEmpty(text) && Ext.isArray(data)) {
                text = Ext.Array.map(data, function (record) { return record[me.textProperty]; }).join();
            }
        }

        me.setRawValue.call(me, text);
    }
});
/**
*   @class App.ux.form.TagSelectField
*
*   Поле, значение которого выбирается из справочника
* 
*   # Example usage:
*
*   // Параметр model необходимо определять, если не определен параметр store
*   @example
*   {
*       xtype: 'apptagselectfield',
*       listView: 'App.view.Author.Grid',
*       textProperty: 'Name',
*       name: 'Author',
*       store: 'App.store.Author',
*       model: 'App.model.Author'
*   } 
*
*/
Ext.define('App.ux.form.TagSelectField', {
    extend: 'Ext.form.field.Tag',
    alias: 'widget.apptagselectfield',
    alternateClassName: ['App.TagSelectField'],

    requires: ['Ext.grid.Panel', 'Ext.ux.grid.FilterBar'],

    triggers: {
        clear: {
            weight: 1,
            cls: Ext.baseCSSPrefix + 'form-clear-trigger',
            hidden: true,
            handler: 'onTrigger3Click',
            scope: 'this'
        },
        find: {
            weight: 1,
            cls: Ext.baseCSSPrefix + 'form-search-trigger',
            handler: 'onTrigger2Click',
            scope: 'this'
        },
        picker: {
            weight: 1,
            hidden: true,
            scope: 'this'
        }
    },

    minChars: 2,
    
    typeAhead: false,
    
    editable: false,

    selectOnFocus: false,

    disableKeyFilter: true,
    /**
    * @cfg {Boolean} allowBlank
    * Флаг: разрешено ли пустое значение поля
    */
    allowBlank: true,

    /**
    * @cfg {String} listView
    * Представление, которое используется для отображения данных справочника
    */
    listView: null,

    /**
    * @cfg {String} listRenderTo
    * Селектор, с помощью которого запрашивается контейнер окна выбора
    */
    windowContainerSelector: null,

    /**
    * @cfg {String} listRenderTo
    * Открывать ли окно выбора модально
    */
    modalWindow: true,

    /**
    * @cfg {Object} windowCfg
    * Параметры конфигурации окна выбора
    */
    windowCfg: null,

    /**
    * @cfg {String} editView
    * Представление, которое используется для редактирования данных справочника
    */
    editView: null,

    /**
    * @cfg {String/Object} store
    * Store
    * Нельзя задавать storeId, если store заранее не был создан
    */
    viewStore: null,

    /**
    * @cfg {"SINGLE"/"MULTI"/"SIMPLE"} selectionMode
    * Режим выбора для Ext.selection.CheckboxModel: SINGLE, MULTI, SIMPLE
    * Поведение каждого из режимов описано в доках к Ext.selection.Model.mode
    */
    selectionMode: 'MULTI',

    /**
    * @cfg {String} title
    * Заголовок для окна выбора
    */
    title: 'Выбор элемента',

    valueField: 'Id',

    displayField: 'Name',

    /**
    * @cfg {Object} columns
    * Столбцы таблицы
    */
    columns: null,

    trigger2Cls: 'x-form-search-trigger',
    trigger3Cls: 'x-form-clear-trigger',

    pinList: false,

    /**
    * Метод для получения store
    * @return {B4.base.Store} store  
    */
    getViewStore: function () {
        return this.viewStore;
    },

    constructor: function () {
        var me = this;

        me.callParent(arguments);


        // выносим конфигурацию тулбара дабы не дублировать ее
        Ext.apply(me, {
            toolbarSelectBtnConfig: {
                xtype: 'button',
                text: 'Выбрать',
                iconCls: 'fa fa-check si-green',
                handler: me.onSelectValue,
                scope: me
            },
            toolbarCloseBtnConfig: {
                xtype: 'button',
                text: 'Закрыть',
                iconCls: 'fa fa-times si-red',
                handler: me.onSelectWindowClose,
                scope: me
            }
        });
    },

    initComponent: function () {
        var me = this,
            viewStore = me.viewStore;

        // подготовка хранилища, если передано како-либо значение
        if (viewStore) {
            // если передана строка
            if (Ext.isString(viewStore)) {
                // сначала пробуем найти хранилище по его имени
                me.viewStore = Ext.StoreMgr.lookup(viewStore);
                if (Ext.isEmpty(me.viewStore)) {
                    // иначе считаем что передано имя класса
                    me.viewStore = Ext.create(viewStore);
                }
            }
        } else if (me.model && Ext.isString(me.model)) {
            me.viewStore = Ext.create('Ext.data.Store', {
                model: me.model,
                autoLoad: false,
                groupField: me.storeGroupField || null
            });
        } else {
            me.viewStore = Ext.StoreMgr.lookup('ext-empty-store');
        }

        if (!Ext.isEmpty(me.viewStore) && Ext.isFunction(me.viewStore.on)) {
            me.viewStore.on('beforeload', me.onViewStoreBeforeLoad, me);
        }

        if (!Ext.isEmpty(me.store) && Ext.isFunction(me.store.on)) {
            me.store.on('beforeload', me.onStoreBeforeLoad, me);
        }

        me.callParent(arguments);
    },

    onStoreBeforeLoad: function (store, operation) {
        var me = this, options = {};
        store.proxy.extraParams = {
            excludeId: Ext.encode(me.getIdValues())
        }
        options.params = operation.params || {};
        me.fireEvent('beforeload', me, options, store);
        Ext.apply(operation, options);
    },

    onViewStoreBeforeLoad: function (viewStore, operation) {
        var me = this, options = {};
        viewStore.proxy.extraParams = {
            excludeId: Ext.encode(me.getIdValues())
        }
        options.params = operation.params || {};
        me.fireEvent('beforeviewload', me, options, viewStore);
        Ext.apply(operation, options);
    },

    destroy: function () {
        var me = this;
        if (me.viewStore) {
            me.viewStore.un('beforeload', me.onViewStoreBeforeLoad);
        }

        if (me.selectWindow) {
            me.selectWindow.destroy();
        }
        me.callParent(arguments);
    },

    _makeSelectionModel: function () {
        var me = this,
            mode = me.selectionMode.toUpperCase(),
            tooltip = Ext.create('Ext.tip.ToolTip', {
                html: 'Выбрать все отображаемые записи'
            });

        var selModel = Ext.create('Ext.selection.CheckboxModel', {
            mode: me.selectionMode,
            checkOnly: me.selectionMode == 'MULTI',
            multipageSelection: {},
            getSelected: function () {
                return this.multipageSelection;
            },
            listeners: {
                selectionchange: function (selectionModel, selectedRecords) {
                    if (selectedRecords.length == 0 && this.viewStore.loading == true && this.viewStore.currentPage != this.page) {
                        return;
                    }

                    if (this.viewStore.loading == true) {
                        this.multipageSelection = {};
                        return;
                    }

                    this.viewStore.data.each(function (i) {
                        Ext.Object.each(this.getSelected(), function (property, value) {
                            if (i.id === value.id) {
                                delete this.multipageSelection[property];
                            }
                        }, this);
                    }, this);

                    if (me.selectionMode.toUpperCase() == 'SINGLE') {
                        Ext.each(selectedRecords, function (i) {
                            this.multipageSelection[0] = i;
                        }, this);
                    } else {
                        Ext.each(selectedRecords, function (i) {
                            if (!Ext.Object.getKey(this.multipageSelection, i))
                                this.multipageSelection[Ext.Object.getSize(this.multipageSelection)] = i;
                        }, this);
                    }
                },
                buffer: 5
            },
            restoreSelection: function () {
                if (!this.viewStore) this.viewStore = me.viewStore;
                this.viewStore.data.each(function (item) {
                    Ext.Object.each(this.getSelected(), function (property, value) {
                        if (item.id === value.id) {
                            this.select(item, true, true);
                        }
                    }, this);
                }, this);
                this.page = this.viewStore.currentPage;
            }
        });

        return selModel;
    },

    /**
    * Показываем окно со справочником
    */
    onTrigger2Click: function () {
        var me = this,
            mode = me.selectionMode.toUpperCase();

        if (me.fireEvent('beforeselect', me) === false) {
            return false;
        }
        // флаг необходимости опустить создание тулбара окна
        var doNotCreateWindowToolbar = false;

        if (Ext.isString(mode)) {
            if (mode != 'SINGLE' && mode != 'MULTI') {
                console.error('Config error:', 'incorrect selection mode');
                return;
            }
        }

        if (mode === 'MULTI' && !me.isRendered) {
            me.isRendered = true;
        }

        // если предтавление списка отсутствует
        if (Ext.isEmpty(me.gridView)) {
            var gridCreated = false;

            if (Ext.isString(me.listView)) {
                var gridViewCfg = {
                    title: null,
                    border: false,
                    closable: false,
                    store: me.viewStore,
                    selModel: me._makeSelectionModel()
                };
                if (me.columns)
                    gridViewCfg.columns = me.columns;

                me.gridView = Ext.create(me.listView, gridViewCfg);

                gridCreated = true;
                if (Ext.isFunction(me.gridView.getStore)) {
                    var gridStore = me.gridView.getStore();
                    if (gridStore) {
                        me.viewStore = gridStore;
                        me.viewStore.un('beforeload', me.onViewStoreBeforeLoad, me);
                        me.viewStore.on('beforeload', me.onViewStoreBeforeLoad, me);
                    } else {
                        me.gridView.reconfigure(me.viewStore);
                    }
                }
            }
            else if (Ext.isObject(me.listView) && me.listView.isComponent) {
                me.gridView = me.listView;
                me.viewStore = me.listView.viewStore;
            }
            else {
                var columns = (Ext.isObject(me.listView) ? me.listView.columns : []) || [];
                if (Ext.isEmpty(columns)) {
                    if (Ext.isArray(me.columns)) {
                        columns = me.columns;
                    } else if (Ext.isObject(me.columns)) {
                        columns = [me.columns];
                    }
                    if (Ext.isEmpty(columns)) {
                        columns.push({
                            xtype: 'gridcolumn',
                            dataIndex: me.textProperty,
                            header: 'Наименование',
                            flex: 1
                        });
                    }
                }
                var cfg = Ext.apply({}, me.listView || {});
                Ext.applyIf(cfg, {
                    xtype: 'gridpanel',
                    plugins: [{
                        ptype: 'filterbar',
                        renderHidden: false,
                        showShowHideButton: true,
                        showClearAllButton: true
                    }],
                    features: me.features || [],
                    dockedItems: [
                        {
                            xtype: 'pagingtoolbar',
                            displayInfo: true,
                            store: me.viewStore,
                            dock: 'bottom'
                        }
                    ]
                });

                Ext.apply(cfg, {
                    title: null,
                    border: false,
                    store: me.viewStore,
                    columns: columns,
                    selModel: me._makeSelectionModel()
                });
                me.gridView = Ext.widget(cfg);
                gridCreated = true;
            }

            if (gridCreated) {
                var gridToolbar = me.gridView.getDockedItems('toolbar[dock="top"]');
                if (gridToolbar && gridToolbar.length) {
                    doNotCreateWindowToolbar = true;
                    gridToolbar = gridToolbar[0];
                    gridToolbar.insert(0, me.toolbarSelectBtnConfig);
                    gridToolbar.add('->');
                    gridToolbar.add(me.toolbarCloseBtnConfig);
                }
                me.fireEvent('gridcreated', me, me.gridView);
            }
        }

        me.viewStore.on('load', me.gridView.getSelectionModel().restoreSelection, me.gridView.getSelectionModel());
        if (mode === 'SINGLE') {
            me.gridView.on('itemdblclick', function (grid, record) {
                grid.getSelectionModel().multipageSelection[0] = record;
                grid.getSelectionModel().select(record, true, true);
                return me.onSelectValue.apply(me, arguments);
            }, me);
        }

        me.viewStore.load();

        me.gridView.getSelectionModel().deselectAll(true);

        if (!me.selectWindow) {
            var wndConfig = {};
            if (Ext.isObject(me.windowCfg))
                Ext.apply(wndConfig, me.windowCfg);

            me.fireEvent('beforewindowcreated', me, wndConfig);

            var renderToCmp = Ext.ComponentQuery.query('tabpanel[type=mainpanel]')[0].getActiveTab();
            if (Ext.isString(me.windowContainerSelector)) {
                renderToCmp = Ext.ComponentQuery.query(me.windowContainerSelector);
                if (Ext.isArray(renderToCmp))
                    renderToCmp = renderTo[0];
            }

            Ext.applyIf(wndConfig, {
                height: 500,
                width: 600,
                constrain: true,
                modal: me.modalWindow == true,
                layout: 'fit',
                title: me.title
            });

            Ext.apply(wndConfig, {
                items: [me.gridView],
                listeners: {
                    close: function () {
                        delete me.gridView;
                        delete me.selectWindow;
                    }
                },
                dockedItems: doNotCreateWindowToolbar ? [] : [
                    {
                        xtype: 'toolbar',
                        dock: 'top',
                        items: [
                            me.toolbarSelectBtnConfig,
                            '->',
                            me.toolbarCloseBtnConfig
                        ]
                    }
                ]
            });

            me.selectWindow = Ext.create('Ext.window.Window', wndConfig);

            me.fireEvent('windowcreated', me, me.selectWindow);

            me.gridView.on('setSavedId', me.onNewSavedId, me);
        }

        //var addBtn = me.selectWindow.down('button[action=add]');
        //if (addBtn) addBtn.hide();
        var editBtn = me.selectWindow.down('button[action=edit]');
        if (editBtn) editBtn.hide();
        var deleteBtn = me.selectWindow.down('button[action=delete]');
        if (deleteBtn) deleteBtn.hide();
        me.selectWindow.forbitEdit = true;

        renderToCmp.add(me.selectWindow);
        me.selectWindow.show();
        me.fireEvent('afterwindowshow', me, me.selectWindow);
        me.selectWindow.center();
    },

    onTrigger3Click: function () {
        var me = this;

        if (me.fireEvent('beforeclear', me) === false) {
            return;
        }

        me.setValue(null);
        me.updateDisplayedText();
    },

    onSelectWindowClose: function () {
        delete this.gridView;
        this.selectWindow.close();
        delete this.selectWindow;
    },

    onSelectValue: function () {
        var me = this,
            rec = me.gridView.getSelectionModel().getSelected();

        if (!rec || rec.length == 0) {
            Ext.Msg.alert('Ошибка', 'Необходимо выбрать запись!');
            return;
        }

        me.applyChanges = true;
        for (var i in rec.items) {
            if (!Ext.Array.findBy(me.valueCollection.items,
                function(itm) {
                    if (itm.data.Id === rec.items[i].data.Id)
                        return true;
            }))
            {
                me.valueCollection.add(rec.items[i]);
            }
        }
        me.fireEvent('afterSelectValue', rec)
        me.updateValue();
        me.onSelectWindowClose();
    },

    onNewSavedId: function (id) {
        var me = this,
            controller = me.getStoreController();
        Ext.Ajax.request({
            url: ('/' + controller /* TODO ILSHAT */ + '/Get'),
            params: {
                id: id
            },
            success: function (response) {
                var data = Ext.decode(response.responseText);
                var record = Ext.create('Ext.data.Model', data);
                var oldValue = me.valueCollection;
                me.valueCollection.add(record);
                me.fireEvent('afterSelectValue', record);
                me.updateValue();
                me.validate();
                me.selectWindow.close();
            },
            failure: function (response) {
                //Ext.msg("Ошибка при получении", Ext.decode(response.statusText).message);
            }
        });
    },

    getStoreController: function () {
        var me = this,
                urlSplited = me.gridView.getStore().getProxy().url.split('/');
        return urlSplited.length == 3 ? urlSplited[1] : urlSplited[0];
    },

    checkChange: function () {
        var me = this,
            newVal, oldVal;
        if (!me.suspendCheckChange && !me.destroying && !me.destroyed) {
            newVal = me.getValue();
            oldVal = me.lastValue,
            needSetOldValue = false;

            if (me.applyChanges && me.didValueChange(newVal, oldVal)) {
                if (needSetOldValue) {
                    me.setValue(oldVal);
                } else {
                    me.callParent(arguments);
                }
                me.applyChanges = false;
            }
        }
    },

    getValue: function () {
        var valArray = this.callParent(arguments);
        var arrayToReturn = [];
        Ext.each(valArray, function (val) {
            arrayToReturn.push({ Id:val });
        });
        return arrayToReturn;
    },
    
    getIdValues: function () {
        var valArray = this.getValue();
        var arrayToReturn = [];
        Ext.each(valArray, function (val) {
            arrayToReturn.push(val.Id);
        });
        return arrayToReturn;
    },

    setValue: function (valArray) {
        if (valArray && valArray.length > 0) {
            var me = this;
            Ext.each(valArray, function (val) {
                me.valueCollection.add(Ext.create('Ext.data.Model', val));
            });
        }
    },

    onSelectionChange: function (selModel, selectedRecs) {
        return;
        this.applyMultiselectItemMarkup();
        this.applyChanges = true;
        //this.fireEvent('valueselectionchange', this, selectedRecs);
    },

    beforeQueryDefValue: false,

    beforeQuery: function (queryPlan) {
        var me = this;

        // Allow beforequery event to veto by returning false 
        if (me.fireEvent('beforequery', queryPlan) === false || (!me.beforeQueryDefValue && !queryPlan.query)) {
            queryPlan.cancel = true;
        }

            // Allow beforequery event to veto by returning setting the cancel flag 
        else if (!queryPlan.cancel) {

            // If the minChars threshold has not been met, and we're not forcing an "all" query, cancel the query 
            if (queryPlan.query.length < me.minChars && !queryPlan.forceAll) {
                queryPlan.cancel = true;
            }
        }
        return queryPlan;
    }
});
Ext.define('App.model.Message', {
    extend: 'Ext.data.Model',
    fields: [
       { name: 'Id' },
       { name: 'OperatorFrom' },
       { name: 'OperatorTo' },
       { name: 'Name' },
       { name: 'Date' },
       { name: 'Text' }
    ],
    idProperty: 'Id',
    defaultValuesExist: true
});
Ext.define('App.model.Operator', {
    extend: 'Ext.data.Model',
    fields: [
        { name: 'Id' },
        { name: 'Surname' },
        { name: 'Name' },
        { name: 'Patronymic' },
        { name: 'Login' },
        { name: 'Password' },
        { name: 'Email' },
        { name: 'Phone' },
        { name: 'Status' },
        { name: 'Position' },
        { name: 'Roles' },
        { name: 'Subdivisions' },
        { name: 'CanSetSign' },
        { name: 'SignDateEnd' },
        { name: 'SignPosition' },
        { name: 'CurrentSubdivisionId' },
        { name: 'CurrentSubdivision' },
        { name: 'SignAccesDocument' }
    ],
    idProperty: 'Id'
});
Ext.define('App.model.Payment', {
    extend: 'Ext.data.Model',
    fields: [
       { name: 'Id' },
       { name: 'OperatorFrom' },
       { name: 'OperatorTo' },
       { name: 'Amount' },
       { name: 'Date' },
       { name: 'IsCurrent' }
    ],
    idProperty: 'Id',
    defaultValuesExist: true
});
Ext.define('App.model.PaymentTransfer', {
    extend: 'Ext.data.Model',
    fields: [
       { name: 'Id' },
       { name: 'OperatorFrom' },
       { name: 'OperatorTo' },
       { name: 'AmountFrom' },
       { name: 'AmountTo' },
       { name: 'Comission' },
       { name: 'Date' },
       { name: 'Decision' },
       { name: 'Text' }
    ],
    idProperty: 'Id',
    defaultValuesExist: true
});
Ext.define('App.model.Role', {
    extend: 'Ext.data.Model',
    fields: [
       { name: 'Id' },
       { name: 'Subdivision' },
       { name: 'Name' }
    ],
    idProperty: 'Id',
    defaultValuesExist: true
});
Ext.define('App.store.BalanceHistory', {
    extend: 'Ext.data.Store',
    autoLoad: true,
    autoSync: true,
    remoteFilter: true,
    remoteSort: true,
    fields: [
        { name: 'Id', type: 'int' },
        { name: 'ObjectCreateDate', type: 'string' },
        { name: 'DateTo', type: 'date' },
        { name: 'DateFrom', type: 'date' },
        { name: 'Amount', type: 'number' }
    ],
    proxy: {
        type: 'ajax',
        url: '/Operator/BalanceHistory',
        method: 'GET',

        reader: {
            rootProperty: 'data',
            totalProperty: 'totalCount'
        }
    }
});
Ext.define('App.store.Message', {
    extend: 'Ext.data.Store',
    autoLoad: true,
    autoSync: true,
    remoteFilter: true,
    remoteSort: true,
    fields: [
        { name: 'Id', type: 'int' },
        { name: 'ObjectCreateDate', type: 'string' },
        { name: 'OperatorFrom', type: 'string' },
        { name: 'Date', type: 'date' },
        { name: 'Name', type: 'auto' }
    ],
    proxy: {
        type: 'ajax',
        url: '/Message/List',
        method: 'GET',

        reader: {
            rootProperty: 'data',
            totalProperty: 'totalCount'
        }
    }
});
Ext.define('App.store.Operator', {
    extend: 'Ext.data.Store',
    autoLoad: false,
    autoSync: false,
    remoteFilter: true,
    remoteSort: true,
    fields: [
        { name: 'Id', type: 'int' },
        { name: 'FIO', type: 'string' },
        { name: 'Login', type: 'string' },
        { name: 'Status', type: 'auto' },
        { name: 'IsFavorite', type: 'auto' }
    ],
    proxy: {
        type: 'ajax',
        url: '/Operator/List',
        method: 'GET',

        reader: {
            rootProperty: 'data',
            totalProperty: 'totalCount'
        }
    }
});
Ext.define('App.store.Payment', {
    extend: 'Ext.data.Store',
    autoLoad: true,
    autoSync: true,
    remoteFilter: true,
    remoteSort: true,
    fields: [
        { name: 'Id', type: 'int' },
        { name: 'ObjectCreateDate', type: 'string' },
        { name: 'From', type: 'string' },
        { name: 'Date', type: 'date' },
        { name: 'Amount', type: 'number' },
        { name: 'BalanceAmount', type: 'number' }, 
        { name: 'Type', type: 'auto' }
    ],
    proxy: {
        type: 'ajax',
        url: '/Payment/List',
        method: 'GET',

        reader: {
            rootProperty: 'data',
            totalProperty: 'totalCount'
        }
    }
});
Ext.define('App.store.PaymentTransfer', {
    extend: 'Ext.data.Store',
    autoLoad: true,
    autoSync: true,
    remoteFilter: true,
    remoteSort: true,
    fields: [
        { name: 'Id', type: 'int' },
        { name: 'ObjectCreateDate', type: 'string' },
        { name: 'OperatorFrom', type: 'string' },
        { name: 'OperatorTo', type: 'string' },
        { name: 'Date', type: 'date' },
        { name: 'Amount', type: 'number' },
        { name: 'Decision', type: 'auto' },
        { name: 'IsMyTransaction', type: 'auto' },
        
    ],
    proxy: {
        type: 'ajax',
        url: '/PaymentTransfer/List',
        method: 'GET',

        reader: {
            rootProperty: 'data',
            totalProperty: 'totalCount'
        }
    }
});
Ext.define('App.store.Role', {
    extend: 'Ext.data.Store',
    autoLoad: true,
    autoSync: true,
    remoteFilter: true,
    remoteSort: true,
    fields: [
        { name: 'Id', type: 'int' },
        { name: 'ObjectCreateDate', type: 'string' },
        { name: 'Name', type: 'string' }
    ],
    proxy: {
        type: 'ajax',
        url: '/Role/List',
        method: 'GET',

        reader: {
            rootProperty: 'data',
            totalProperty: 'totalCount'
        }
    }
});
Ext.define('App.base.Controller', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.base',

    controllerName: '',
    editWindow: '',
    
    onShowWindow: function(component, eOpts) { },

    onTbarFilterChange: function (me, newValue, oldValue, eOpts) {
        if (me.filterName) {
            var grid = me.up('grid') || me.up('panel');
            var store = grid.getStore();
            store.getProxy().setExtraParam(me.filterName, newValue);
            store.reload();
        }
    },

    /* Методы по оброботке грида */
    onGridSelectionChange: function (selModel, records) {
        var grid = selModel.view.up('grid');
        var editButton = grid.down('button[action=edit]');
        if (records.length > 1) {
            editButton.disable();
        }
        else {
            if (editButton) editButton.enable();
            if (records[0]) {
                var panel = grid.up('panel');
                if (panel && panel.getForm) {
                    var form = panel.getForm();
                    if (form)
                        form.loadRecord(records[0]);
                }
            }
        }
    },

    /**/
    onCellDBClick: function (me, td, cellIndex, record, tr, rowIndex, e, eOpts) {
        var selWnd = me.up('window');
        if (!selWnd || !selWnd.forbitEdit) {
            this.onGridEdit(Ext.create(this.formModel, { Id: record.get('Id') }), me.ownerCt);
        }
    },

    onEditBtnClick: function (grid) {
        var values = grid.getSelectionModel().getSelection().map(function (x) { return x; });
        if (values && values[0]) {
            var id = values[0].get('Id');
            if (id) {
                this.onGridEdit(Ext.create(this.formModel, { Id: id }), grid);
            }
        }
    },

    onSaveBtnClick: function (wnd) {
        wnd.down('button[action=Save]').disable();
        wnd.down('button[action=Cancel]').disable();
        this.onSaveClick(wnd);
    },

    onCancelBtnClick: function (wnd) {
        //Изменился ли хотя бы один store у multiupload в окне
        var isMultiuploadStoresModified = false;
        //Получить все multiupload в окне
        var multiuploadArray = wnd.query('multiupload');
        if (multiuploadArray.length > 0) {
            for (var i = 0; i < multiuploadArray.length; i++) {
                var multiuploadStore = multiuploadArray[i].getStore();
                if (multiuploadStore.getRejectRecords().length > 0 || multiuploadStore.getRemovedRecords().length > 0 || multiuploadStore.getRange().some(function (record, index, array) { return record.crudState === 'R'; })) {
                    isMultiuploadStoresModified = true;
                    break;
                }
            }
        }

        if (isMultiuploadStoresModified) {
            Ext.Msg.show({
                title: 'Предупреждение',
                msg: 'Вы действительно хотите закрыть не сохранив изменения по файлам?',
                buttons: Ext.Msg.YESNO,
                fn: function (button) {
                    if (button === 'yes') {
                        wnd.close();
                    }
                }
            });
        }
        else {
            wnd.close();
        }
    },

    /* Сохранение записи */
    onSaveClick: function (wnd) {
        var form = wnd.down('form');
        var formTemp = form.getForm();
        var me = this;
        var saveBtn = wnd.down('button[action=Save]'),
            cancelBtn = wnd.down('button[action=Cancel]');
        if (formTemp.isValid()) {
            var record = form.getRecord();
            form.updateRecord(record);
            record = me.setExtraOnSave(record, wnd);
            var jsonValues = Ext.JSON.encode(record.data);

            Ext.Ajax.request({
                url: ('/' + me.controllerName + '/Save'),
                jsonData: jsonValues,
                success: function (response, options) {
                    var data = Ext.decode(response.responseText);
                    if (data.success) {
                        if (!wnd.cantCloseAfterSave) wnd.close();
                        me.onGridRefresh(wnd.mainComponent);
                    }
                    else {
                        saveBtn.enable();
                        if (cancelBtn) cancelBtn.enable();
                        Ext.Msg.alert('Ошибка при сохранении карточки', data ? data.message : 'Неизвестная ошибка');
                    }
                },
                failure: function (response) {
                    saveBtn.enable();
                    if (cancelBtn) cancelBtn.enable();
                    var data = Ext.decode(response.responseText);
                    Ext.Msg.alert('Ошибка при сохранении карточки', data ? data.message : 'Неизвестная ошибка');
                },
                timeout: 60000 //60 секунд (по умолчанию 30)
            });
        }
        else {
            saveBtn.enable();
            if (cancelBtn) cancelBtn.enable();
            var message = "";
            var first = true;
            Ext.each(formTemp.getFields().items, function (f) {
                if (!f.validate()) {
                    message += (first ? f.fieldLabel : (", " + f.fieldLabel));
                    first = false;
                }
            });
            Ext.Msg.alert("Проверьте корректность полей:", message);
        }
    },

    setExtraOnSave: function (jsonValue, wnd) { return jsonValue; },

    onGridViewReady: function (grid) {
        this.onGridRefresh(grid);
    },

    onGridRefresh: function (grid) {
        if (grid && grid.getStore) {
            grid.getStore().load();
            grid.getView().refresh(true);
        }
    },

    onDeleteBtnClick: function (grid) {
        var me = this;
        var values = grid.getSelectionModel().getSelection().map(function (x) { return x.data.Id; });
        if (values.length > 0) {
            Ext.Msg.show({
                title: 'Предупреждение',
                msg: 'Вы действительно хотите удалить?',
                buttons: Ext.Msg.YESNO,
                fn: function (button) {
                    if (button === 'yes') {
                        Ext.Ajax.request({
                            url: ('/' + me.controllerName + '/Delete'),
                            proxy: { writer: { type: 'json' } },
                            params: { ids: Ext.JSON.encode(values) },
                            success: function (response, options) {
                                var result = Ext.decode(response.responseText);
                                if (!result.success) {
                                    Ext.Msg.alert('Ошибка при удалении', result.message);
                                }
                                me.onGridRefresh(grid);
                            },
                            failure: function (response) {
                                Ext.msg("Ошибка при удалении", Ext.decode(response.statusText).message);
                            },
                            timeout: 60000 //60 секунд (по умолчанию 30)
                        });
                    }
                }
            });
        }
    },

    onCreateBtnClick: function (grid) {
        var me = this;
        var editWindow = Ext.create(('widget.' + this.editWindow), { mainComponent: grid, modal: true });
        editWindow.isEdit = false;
        var renderToCmp = grid.up("panel[module != '']") || Ext.ComponentQuery.query('tabpanel[type=mainpanel]')[0].getActiveTab();
        renderToCmp.add(editWindow);
        editWindow.show();
        editWindow.center();
        var form = editWindow.down('form');
        form.getForm().isValid();
        var currRec = grid.selection && grid.selection.data ? grid.selection.data : null;
        var defRecord = currRec ? { Id: 0, Parent: { Id: currRec.Id, Name: currRec.Name } } : { Id: 0 };
        var record = Ext.create(this.formModel, defRecord);
        form.loadRecord(record);
        var params = null;
        me.onAfterShowEditWindowWhenCreate(record, editWindow, grid, params);
    },

    onGridEdit: function (record, grid) {
        if (record && record.data && record.data.Id) {
            var editWindow = Ext.create(('widget.' + this.editWindow), { mainComponent: grid, modal: true });
            editWindow.objectId = record.data.Id;
            editWindow.isEdit = true;
            var form = editWindow.down('form');
            form.getForm().isValid();
            grid.up("panel[module != '']").add(editWindow);
            editWindow.show();
            editWindow.center();
            var me = this;
            Ext.Ajax.request({
                url: ('/' + me.controllerName + '/Get'),
                params: {
                    id: record.data.Id
                },
                success: function (response) {
                    var text = response.responseText;
                    record.data = Ext.decode(text);
                    form.loadRecord(record);

                    //TODO проверить нужны ли setValue для datefield
                    //#region datefield setValue
                    var datefields = form.query('datefield');
                    for (var i = 0; i < datefields.length; i++) {
                        var value = record.data[datefields[i].name];
                        if (value) {
                            var valueToSet = new Date(value);
                            datefields[i].setValue(valueToSet);
                        }
                    }
                    //#endregion datefield setValue

                    //#region filefield setValue
                    var filefields = form.query('filefield');
                    for (i = 0; i < filefields.length; i++) {
                        var filefieldValue = record.data[filefields[i].name];
                        if (filefieldValue) {
                            filefields[i].setRawValue(filefieldValue);
                        }
                    }
                    //#endregion filefield setValue

                    me.onAfterGridGet(record, editWindow, grid);
                    form.getForm().isValid();
                },
                failure: function (response) {
                    Ext.msg("Ошибка при получении", Ext.decode(response.statusText).message);
                }
            });
        }
    },

    //Функция, отрабатывающая после того, как покажется окно редактирования при редактировании сущности, а также уже придут данные с метода Get
    onAfterGridGet: function (record, editWindow, grid) { },

    //Функция, отрабатывающая после того, как покажется окно редактирования при создании сущности
    //Выполнения запроса на получение значений по умолчанию если в модели установлено defaultValuesExist = true
    onAfterShowEditWindowWhenCreate: function (record, editWindow, grid, params) {
        var me = this;
        if (record.defaultValuesExist) {
            Ext.Ajax.request({
                url: ('/' + me.controllerName + '/GetDefaultValues'),
                params: params,
                success: function (response) {
                    var text = response.responseText;
                    record.data = Ext.decode(text);
                    var form = editWindow.down('form');
                    form.loadRecord(record);

                    //TODO проверить нужны ли setValue для datefield
                    //#region datefield setValue
                    var datefields = form.query('datefield');
                    for (var i = 0; i < datefields.length; i++) {
                        var value = record.data[datefields[i].name];
                        if (value) {
                            var valueToSet = new Date(value);
                            datefields[i].setValue(valueToSet);
                        }
                    }
                    //#endregion datefield setValue

                    //#region filefield setValue
                    var filefields = form.query('filefield');
                    for (i = 0; i < filefields.length; i++) {
                        var filefieldValue = record.data[filefields[i].name];
                        if (filefieldValue) {
                            filefields[i].setRawValue(filefieldValue);
                        }
                    }
                    //#endregion filefield setValue
                },
                failure: function (response) {
                    Ext.msg("Ошибка при получении значений по умолчанию", Ext.decode(response.statusText).message);
                }
            });
        }
    }
});
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
Ext.define('App.base.Window', {
    extend: 'Ext.window.Window',
    layout: 'fit',
    maxHeight: 530,
    width: 530,
    scrollable: true,
    autoScroll: true,
    defaults: { autoScroll: true },
    closable: false,
    plain: true,
    constrain: true,
    listeners: {
        onSaveBtnClick: 'onSaveBtnClick',
        onCancelBtnClick: 'onCancelBtnClick',
        onPrintFormBtnClick: 'onPrintFormBtnClick',
        show: 'onShowWindow'
    },
    buttons: [
        {
            action: 'Save',
            text: 'Сохранить',
            iconCls: 'fa fa-floppy-o',
            listeners: {
                click: function (btn) {
                    var wnd = btn.up('window');
                    wnd.fireEvent('onSaveBtnClick', wnd);
                }
            }
        },
        {
            action: 'Cancel',
            text: 'Отменить',
            iconCls: 'fa fa-undo si-red',
            listeners: {
                click: function (btn) {
                    var wnd = btn.up('window');
                    wnd.fireEvent('onCancelBtnClick', wnd);
                }
            }
        }
    ]
});
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
Ext.define('App.view.role.Grid', {
    extend: 'App.base.Grid',
    alias: 'widget.rolepanel',
    controller: 'role',
    requires: ['App.store.Role'],
    viewConfig: {
        stripeRows: true
    },

    initComponent: function () {
        this.store = Ext.create('App.store.Role', {
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
                    text: 'Имя',
                    flex: 1,
                    dataIndex: 'Name',
                    filter: true
                }
            ]
        });

        this.callParent();
    }
});
Ext.define('App.view.message.Window', {
    extend: 'App.base.Window',
    alias: 'widget.messagewindow',
    controller: 'message',

    title: 'Сообщение',
    items: [
        {
            xtype: 'form',
            bodyPadding: '5',
            fieldDefaults: {
                labelWidth: 100,
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
                    xtype: 'textfield',
                    fieldLabel: 'Сообщение',
                    name: 'Name'
                },
                {
                    xtype: 'textarea',
                    fieldLabel: 'Текст',
                    name: 'Text'
                }
            ]
        }
    ],
    buttons: [
        {
            action: 'Save',
            text: 'Отправить',
            iconCls: 'fa fa-floppy-o',
            listeners: {
                click: function (btn) {
                    var wnd = btn.up('window');
                    wnd.fireEvent('onSaveBtnClick', wnd);
                }
            }
        },
        {
            action: 'Cancel',
            text: 'Закрыть',
            iconCls: 'fa fa-undo si-red',
            listeners: {
                click: function (btn) {
                    var wnd = btn.up('window');
                    wnd.fireEvent('onCancelBtnClick', wnd);
                }
            }
        }
    ]
});
Ext.define('App.view.operator.Window',
    {
        extend: 'App.base.Window',
        alias: 'widget.operatorwindow',
        controller: 'operator',

        title: 'Сотрудник',

        items: [
            {
                xtype: 'form',
                bodyPadding: '5',
                fieldDefaults: {
                    labelWidth: 100,
                    anchor: '100%'
                },

                items:
                [
                    {
                        xtype: 'fieldset',
                        title: 'Данные',
                        items: [
                            {
                                xtype: 'textfield',
                                fieldLabel: 'Фамилия',
                                name: 'Surname',
                                allowBlank: false,
                                maxLength: 255
                            },
                            {
                                xtype: 'textfield',
                                fieldLabel: 'Имя',
                                name: 'Name',
                                validateBlank: true,
                                allowBlank: false,
                                maxLength: 255
                            },
                            {
                                xtype: 'textfield',
                                fieldLabel: 'Отчество',
                                name: 'Patronymic',
                                maxLength: 255
                            },
                            {
                                xtype: 'textfield',
                                name: 'Phone',
                                fieldLabel: 'Телефон',
                                allowBlank: true,
                                vtype: 'phone',
                                emptyText: 'В формате 89776665544 или 88437776655',
                                maxLength: 12
                            },
                            {
                                xtype: 'textfield',
                                name: 'Email',
                                fieldLabel: 'Email',
                                vtype: 'email',
                                allowBlank: true
                            },
                        ]
                    },
                    {
                        xtype: 'fieldset',
                        title: 'Системные данные',
                        items: [
                            {
                                xtype: 'textfield',
                                fieldLabel: 'Логин',
                                name: 'Login',
                                allowBlank: false,
                                minLength: 5,
                                maxLength: 32,
                                regex: /^[a-z A-Z0-9._,-]+$/
                            },
                            {
                                xtype: 'textfield',
                                fieldLabel: 'Пароль',
                                name: 'Password',
                                allowBlank: true,
                                minLength: 8,
                                maxLength: 32,
                                regex: /^[a-z A-Z0-9._,-]+$/
                            },
                            {
                                name: 'Status',
                                xtype: 'combobox',
                                editable: false,
                                fieldLabel: 'Статус',
                                valueField: 'Value',
                                displayField: 'Name',
                                store: App.enum.OperatorStatus.getStore(),
                                value: 10,
                                allowBlank: false
                            },
                            {
                                xtype: 'apptagselectfield',
                                fieldLabel: 'Роли',
                                listView: 'App.view.role.Grid',
                                textProperty: 'Name',
                                name: 'Roles',
                                model: 'App.model.Role',
                                triggerAction: 'all',
                                store: Ext.create('Ext.data.Store',
                                    {
                                        autoLoad: true,
                                        autoSync: true,
                                        fields: [
                                            { name: 'Id', type: 'int' },
                                            { name: 'ObjectCreateDate', type: 'string' },
                                            { name: 'Name', type: 'string' }
                                        ],
                                        proxy: {
                                            type: 'ajax',
                                            url: '/Role/List',
                                            method: 'GET',
                                            reader: {
                                                rootProperty: 'data',
                                                totalProperty: 'totalCount'
                                            }
                                        }
                                    }),
                                viewStore: 'App.store.Role',
                                allowBlank: false
                            }
                        ]
                    }
                ]
            }
        ]
    });
Ext.define('App.view.payment.Window', {
    extend: 'App.base.Window',
    alias: 'widget.paymentwindow',
    controller: 'payment',

    title: 'Пополнить баланс',
    items: [
        {
            xtype: 'form',
            bodyPadding: '5',
            fieldDefaults: {
                labelWidth: 100,
                anchor: '100%'
            },

            items: [
                {
                    xtype: 'numberfield',
                    fieldLabel: 'Сумма',
                    name: 'Amount'
                }
            ]
        }
    ]
});
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
Ext.define('App.view.role.Window', {
    extend: 'App.base.Window',
    alias: 'widget.rolewindow',
    controller: 'role',

    title: 'Роль',
    items: [
        {
            xtype: 'form',
            bodyPadding: '5',
            fieldDefaults: {
                labelWidth: 100,
                anchor: '100%'
            },

            items: [
                {
                    xtype: 'fieldset',
                    title: 'Муниципалитет',
                    items: [
                        {
                            xtype: 'appselectfield',
                            fieldLabel: 'Муниципалитет',
                            listView: 'App.view.region.Grid',
                            textProperty: 'Name',
                            name: 'Subdivision',
                            model: 'App.model.Subdivision',
                            store: 'App.store.Subdivision',
                            readOnly: true
                        },
                        {
                            xtype: 'textfield',
                            fieldLabel: 'Имя',
                            name: 'Name',
                            maxLength: 256
                        }
                    ]
                }
            ]
        }
    ]
});
Ext.define('App.view.message.Controller', {
    extend: 'App.base.Controller',
    alias: 'controller.message',
    requires: [
        'Ext.data.Store',
        'App.model.Message',
        'App.view.message.Grid',
        'App.view.message.Window'
    ],
    formModel: 'App.model.Message',
    PermissionPath: 'App.Messages',
    controllerName: 'Message',
    editWindow: 'messagewindow'
});
Ext.define('App.view.operator.Controller', {
    extend: 'App.base.Controller',
    alias: 'controller.operator',
    requires: [
        'Ext.data.Store',
        'App.model.Operator',
        'App.view.operator.Grid',
        'App.view.operator.Window'
    ],
    formModel: 'App.model.Operator',
    controllerName: 'Operator',
    editWindow: 'operatorwindow',
    PermissionPath: 'App.Operators',
    routes: {
        'operators': 'openGrid'
    },

    //Кнопка "Сохранить" при изменении пароля текущего пользователя (в левом нижнем углу системы)
    onChangePasswordSaveButtonClick: function (changePasswordWindow) {
        var form = changePasswordWindow.down('form').getForm();
        if (form.isValid()) {
            var oldPassword = form.findField('OldPassword').getValue();
            var newPassword = form.findField('NewPassword').getValue();
            Ext.Ajax.request({
                url: ('/Operator/ChangePassword'),
                jsonData: { oldPassword: oldPassword, newPassword: newPassword },
                success: function (response, options) {
                    var data = Ext.decode(response.responseText);
                    if (data.success) {
                        changePasswordWindow.hide();
                        Ext.Msg.alert('Сообщение', 'Пароль успешно изменен.');
                    }
                    else {
                        Ext.Msg.alert('Ошибка при смене пароля', data ? data.message : 'Неизвестная ошибка.');
                    }
                },
                failure: function (response) {
                    Ext.Msg.alert('Ошибка при смене пароля', 'Неизвестная ошибка.');
                },
                timeout: 60000 //60 секунд (по умолчанию 30)
            });
        }
        else {
            Ext.Msg.alert('Ошибка', 'Заполните поля');
        }
    },

    //Кнопка "Отмена" при изменении пароля текущего пользователя (в левом нижнем углу системы)
    onChangePasswordCancelButtonClick: function (changePasswordWindow) {
        changePasswordWindow.hide();
    },

    onAfterGridGet: function (record, wnd, grid) {
        this.documentStoreReload(record, wnd);
    },

    onAfterShowEditWindowWhenCreate: function (record, wnd, grid, params) {
        this.superclass.onAfterShowEditWindowWhenCreate.call(this, record, wnd, grid, params);
        this.documentStoreReload(record, wnd);
    },

    setExtraOnSave: function (jsonValue, wnd) {
        jsonValue.data.SignAccesDocument = this.getDocumentValues(wnd, 'SignAccesDocument');

        return jsonValue;
    },

    getDocumentValues: function (wnd, gridName) {
        var multiuploadDocument = wnd.down('multiupload[name=' + gridName + ']');
        if (multiuploadDocument) {
            var documentStore = multiuploadDocument.getStore();
            var documentData = documentStore.getRange();
            var fileIdArray = Ext.Array.map(documentData, function (x) { return x.data.FileId; });
            return fileIdArray + "";
        }
    },

    //Обновить store Образцов документов
    documentStoreReload: function (record, wnd) {
        this.setExtraParamToDocumentGrid(record, wnd, 'SignAccesDocument');
    },

    setExtraParamToDocumentGrid: function (record, wnd, gridName) {
        var multiuploadDocument = wnd.down('multiupload[name=' + gridName + ']');
        if (multiuploadDocument) {
            var documentStore = multiuploadDocument.getStore();
            documentStore.getProxy().setExtraParam('id', record.getId());
            documentStore.load();
        }
    }
});
Ext.define('App.view.payment.Controller', {
    extend: 'App.base.Controller',
    alias: 'controller.payment',
    requires: [
        'Ext.data.Store',
        'App.model.Payment',
        'App.view.payment.Grid',
        'App.view.payment.Window'
    ],
    formModel: 'App.model.Payment',
    PermissionPath: 'App.Payments',
    controllerName: 'Payment',
    editWindow: 'paymentwindow'
});
Ext.define('App.view.paymenttransfer.Controller', {
    extend: 'App.base.Controller',
    alias: 'controller.paymenttransfer',
    requires: [
        'Ext.data.Store',
        'App.model.PaymentTransfer',
        'App.view.paymenttransfer.Grid',
        'App.view.paymenttransfer.Window'
    ],
    formModel: 'App.model.PaymentTransfer',
    PermissionPath: 'App.PaymentTransfers',
    controllerName: 'PaymentTransfer',
    editWindow: 'paymenttransferwindow',

    onRollbackBtnClick: function (grid) {
        var record = grid.getSelectionModel().selected.items[0];
        Ext.Ajax.request({
            url: ('/PaymentTransfer/RollbackTransfer'),
            params: { transferId: record.get('Id') },
            success: function (response, options) {
                var data = Ext.decode(response.responseText);
                if (data.success) {
                    grid.store.reload();
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
    },
    onAcceptBtnClick: function (grid) {
        var record = grid.getSelectionModel().selected.items[0];
        Ext.Ajax.request({
            url: ('/PaymentTransfer/AcceptTransfer'),
            params: { transferId: record.get('Id') },
            success: function (response, options) {
                var data = Ext.decode(response.responseText);
                if (data.success) {
                    grid.store.reload();
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
    },
    onDeclineBtnClick: function (grid) {
        var record = grid.getSelectionModel().selected.items[0];
        Ext.Ajax.request({
            url: ('/PaymentTransfer/DeclineTransfer'),
            params: { transferId: record.get('Id') },
            success: function (response, options) {
                var data = Ext.decode(response.responseText);
                if (data.success) {
                    grid.store.reload();
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
    },

    /* Методы по оброботке грида */
    onGridSelectionChange: function (selModel, records) {
        var record = records[0];
        var grid = selModel.view.up('grid');
        var acceptButton = grid.down('button[action=accept]');
        var declineButton = grid.down('button[action=decline]');
        var rollbackButton = grid.down('button[action=rollback]');
        if (records.length == 1) {
            record.get('CanEdit') && !record.get('IsMyTransaction') ?
                acceptButton.enable() : acceptButton.disable();
            record.get('CanEdit') && !record.get('IsMyTransaction') ?
                declineButton.enable() : declineButton.disable();
            record.get('CanEdit') && record.get('IsMyTransaction') ?
                rollbackButton.enable() : rollbackButton.disable();
        }
        else {
            acceptButton.disable();
            declineButton.disable();
            rollbackButton.disable();
        }
    },

});
Ext.define('App.view.personalarea.Controller', {
    extend: 'App.base.Controller',
    alias: 'controller.personalarea',
    requires: [
        'Ext.data.Store',
        'App.view.personalarea.Panel',
        'App.view.personalarea.BalanceHistoryGrid'
        //'App.model.Role',
        //'App.view.personalarea.Grid',
        //'App.view.personalarea.Window'
    ],
    formModel: 'App.model.Operator',
    PermissionPath: 'App.Operator',
    controllerName: 'Operator',
    editWindow: 'personalareapanel',

    onPanelRendered: function (panel) {
        var me = this;
        var form = panel.down('form');
        var record = Ext.create(this.formModel, { Id: 0 });
        Ext.Ajax.request({
            url: ('/Operator/GetCurrent'),
            success: function (response) {
                var text = response.responseText;
                record.data = Ext.decode(text);
                form.loadRecord(record);
                //#region datefield setValue
                var datefields = form.query('datefield');
                for (var i = 0; i < datefields.length; i++) {
                    var value = record.data[datefields[i].name];
                    if (value) {
                        var valueToSet = new Date(value);
                        datefields[i].setValue(valueToSet);
                    }
                }
                //#endregion datefield setValue

                //#region filefield setValue
                var filefields = form.query('filefield');
                for (i = 0; i < filefields.length; i++) {
                    var filefieldValue = record.data[filefields[i].name];
                    if (filefieldValue) {
                        filefields[i].setRawValue(filefieldValue);
                    }
                }
                //#endregion filefield setValue

                form.getForm().isValid();
            },
            failure: function (response) {
                Ext.msg("Ошибка при получении", Ext.decode(response.statusText).message);
            }
        });
    },
    onRemoveAccountBtnClick: function(panel) {
        var me = this;
        Ext.MessageBox.show({
            title: 'Внимание!',
            msg: 'Будет удален ваш аккунт! Вы уверены?',
            buttons: Ext.MessageBox.OKCANCEL,
            icon: Ext.MessageBox.WARNING,
            fn: function(btn) {
                if (btn === 'ok') {
                    Ext.Ajax.request({
                        url: ('/Operator/RemoveCurrentAccount'),
                        success: function (response, options) {
                            var data = Ext.decode(response.responseText);
                            if (data.success) {
                                Ext.Ajax.request({
                                    method: 'GET',
                                    url: 'Login/Logout',
                                    success: function (response) {
                                        window.location.href = 'Home/Index';
                                        //loadMask.hide();
                                    },
                                    failure: function (response) {
                                        Ext.Msg.alert('Ошибка!', Ext.isString(response.responseData) ? response.responseData : response.responseData.message);
                                        //loadMask.hide();
                                    }
                                });
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
            }
        });
    }
});
Ext.define('App.view.role.Controller', {
    extend: 'App.base.Controller',
    alias: 'controller.role',
    requires: [
        'Ext.data.Store',
        'App.model.Role',
        'App.view.role.Grid',
        'App.view.role.Window'
    ],
    formModel: 'App.model.Role',
    PermissionPath: 'App.Roles',
    controllerName: 'Role',
    editWindow: 'rolewindow',
    onShowWindow: function (component, eOpts) {
        component.down('[name=Subdivision]').setReadOnly(!Permission.Access('CanEditSundivision'));
    },
});
Ext.define('App.view.Main', {
    extend: 'Ext.container.Viewport',
    alias: 'widget.main',
    layout: 'border',
    controller: 'main',
    items:
        [
            {
                region: 'west',
                xtype: 'treepanel',
                title: '<b>Меню</b>',
                width: 220,
                buttonAlign: 'left',
                rootVisible: false,
                autoScroll: true,
                store: Ext.create('Ext.data.TreeStore', {
                    proxy: {
                        type: 'ajax',
                        method: 'GET',
                        url: 'MenuItems/GetAll'
                    },
                    listeners: {
                        load: function (store, records, successful, operation, node, eOpts) {
                            if (records && records.length > 0) {
                                var treepanel = node.getOwnerTree();
                                treepanel.fireEvent('itemclick', treepanel, records[0]);
                            }
                        }
                    }
                }),
                listeners: {
                    itemclick: 'createTab',
                    afterlayout: function () {
                        var height = Ext.getBody().getViewSize().height;
                        this.setHeight(height);
                    }
                },
                fbar: [
                    {
                        xtype: "container",
                        height: 19,
                        layout: { type: "hbox" },
                        items: [
                            {
                                xtype: 'label',
                                width: 194,
                                listeners: {
                                    beforerender: function (label, eOpts) {
                                        Ext.Ajax.request({
                                            url: ('/Operator/GetCurrentOperatorSurnameAndName'),
                                            success: function (response, opts) {
                                                var result = Ext.decode(response.responseText);
                                                if (result && result.surnameAndName) {
                                                    label.setHtml("<a href='#'>" + result.surnameAndName + "</a>");
                                                }
                                            }
                                        });
                                    },
                                    render: function (component) {
                                        component.getEl().on('click', function () {
                                            var changePasswordWindow = Ext.create('widget.changepasswordwindow');
                                            var form = changePasswordWindow.down('form');
                                            form.getForm().isValid();
                                            changePasswordWindow.show();
                                        }, component);
                                    }
                                }
                            },
                            {
                                xtype: 'button',
                                iconCls: 'fa fa-sign-out si-red',
                                tooltip: 'Выйти из системы',
                                scale: 'huge',
                                handler: function (button, e, eOpts) {
                                    //Закомментировал маску при выходе из системы
                                    //var viewport = button.up('viewport');
                                    //var loadMask = new Ext.LoadMask({ target: viewport, msg: "Выход из системы" });
                                    //loadMask.show();
                                    Ext.Ajax.request({
                                        method: 'GET',
                                        url: 'Login/Logout',
                                        success: function (response) {
                                            window.location.href = 'Home/Index';
                                            //loadMask.hide();
                                        },
                                        failure: function (response) {
                                            Ext.Msg.alert('Ошибка!', Ext.isString(response.responseData) ? response.responseData : response.responseData.message);
                                            //loadMask.hide();
                                        }
                                    });
                                }
                            }
                        ]
                    }
                ]
            },
            {
                region: 'center',
                xtype: 'tabpanel',
                type: 'mainpanel',
                reference: 'tabPanelCenter'
            }
        ]
});
Ext.define('App.view.MainController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.main',
    requires: [
        'Ext.tab.Panel',
        'Ext.tree.Panel'
    ],

    createTab: function (tree, record) {
        var me = this,
            tabPanel = me.lookupReference('tabPanelCenter'),
            tabOpen;

        if (record.get('leaf')) {
            tabOpen = tabPanel.items.findBy(function (tab) {
                return tab.title === record.get('text');
            });
            if (!tabOpen) {
                var module = record.get('module');
                var closable = module === "desktop" ? false : true;
                tabOpen = tabPanel.add({
                    xtype: 'panel',
                    module: module,
                    title: record.get('text'),
                    autoShow: true,
                    closable: closable,
                    layout: 'fit',
                    items: [
                        {
                            xtype: module + 'panel'
                        }
                    ]
                });
            }

            tabPanel.setActiveTab(tabOpen);
        }
    }
});
Ext.define('App.view.desktop.Panel', {
    extend: 'Ext.panel.Panel',

    alias: 'widget.desktoppanel',

    html: '<div style="text-align: center; width: 100%;"><h3>Добро пожаловать!</h3></div>'
});
Ext.define('App.view.operator.ChangePasswordWindow', {
    extend: 'App.base.Window',
    alias: 'widget.changepasswordwindow',
    controller: 'operator',

    title: 'Смена пароля',
    modal: true,
    width: 500,

    listeners: {
        onChangePasswordSaveButtonClick: 'onChangePasswordSaveButtonClick',
        onChangePasswordCancelButtonClick: 'onChangePasswordCancelButtonClick'
    },
    buttons: [
        {
            action: 'Save',
            text: 'Сохранить',
            iconCls: 'fa fa-floppy-o',
            listeners: {
                click: function (btn) {
                    var wnd = btn.up('window');
                    wnd.fireEvent('onChangePasswordSaveButtonClick', wnd);
                }
            }
        },
        {
            action: 'Cancel',
            text: 'Отменить',
            iconCls: 'fa fa-undo si-red',
            listeners: {
                click: function (btn) {
                    var wnd = btn.up('window');
                    wnd.fireEvent('onChangePasswordCancelButtonClick', wnd);
                }
            }
        }
    ],

    items: [
        {
            xtype: 'form',
            bodyPadding: '5',
            fieldDefaults: {
                labelWidth: 170,
                anchor: '100%'
            },

            items:
                [
                    {
                        xtype: 'fieldset',
                        title: 'Смена пароля',
                        items: [
                            {
                                xtype: 'textfield',
                                fieldLabel: 'Старый пароль',
                                name: 'OldPassword',
                                allowBlank: false,
                                minLength: 8,
                                maxLength: 32,
                                regex: /^[a-z A-Z0-9._,-]+$/
                            },
                            {
                                xtype: 'textfield',
                                fieldLabel: 'Новый пароль',
                                name: 'NewPassword',
                                allowBlank: false,
                                minLength: 8,
                                maxLength: 32,
                                regex: /^[a-z A-Z0-9._,-]+$/
                            }
                        ]
                    }
                ]
        }
    ]
});
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
Ext.define('App.view.personalarea.Panel', {
    extend: 'Ext.panel.Panel',
    
    controller: 'personalarea',
    alias: 'widget.personalareapanel',

    layout: 'hbox',
    defaults: {
        flex: 1,
        autoHeight: true,
        layout: 'vbox'
    },
    listeners: {
        afterrender: 'onPanelRendered',
        onSaveClick: 'onSaveClick',
        onRemoveAccountBtnClick: 'onRemoveAccountBtnClick'
    },
    cantCloseAfterSave: true,
    autoScroll: true,
    items: [
    //    {
    //        xtype: 'container'
    //    },
    //    {
    //        flex: 2,
    //        xtype: 'container',
    //        items: [
                {
                    id: 'mainForm',
                    xtype: 'form',
                    layout: 'form',
                    maxWidth: 800,
                    border: false,
                    bodyPadding: '5',
                    fieldDefaults: {
                        labelWidth: 100,
                        anchor: '100%'
                    },
                    items:
                    [
                        {
                            xtype: 'fieldset',
                            title: 'Общая информация',
                            items: [
                                {
                                    xtype: 'textfield',
                                    fieldLabel: 'Фамилия',
                                    name: 'Surname',
                                    allowBlank: false,
                                    maxLength: 255
                                },
                                {
                                    xtype: 'textfield',
                                    fieldLabel: 'Имя',
                                    name: 'Name',
                                    validateBlank: true,
                                    allowBlank: false,
                                    maxLength: 255
                                },
                                {
                                    xtype: 'textfield',
                                    fieldLabel: 'Отчество',
                                    name: 'Patronymic',
                                    maxLength: 255
                                },
                                {
                                    xtype: 'textfield',
                                    name: 'Phone',
                                    fieldLabel: 'Телефон',
                                    allowBlank: true,
                                    vtype: 'phone',
                                    emptyText: 'В формате 89776665544 или 88437776655',
                                    maxLength: 12
                                },
                                {
                                    xtype: 'textfield',
                                    name: 'Email',
                                    fieldLabel: 'Email',
                                    vtype: 'email',
                                    allowBlank: true
                                },
                            ]
                        },
                        {
                            xtype: 'fieldset',
                            title: 'Системные данные',
                            items: [
                                {
                                    xtype: 'textfield',
                                    fieldLabel: 'Логин',
                                    name: 'Login',
                                    allowBlank: false,
                                    minLength: 5,
                                    maxLength: 32,
                                    readOnly: true,
                                    regex: /^[a-z A-Z0-9._,-]+$/
                                },
                                {
                                    name: 'Status',
                                    xtype: 'combobox',
                                    readOnly: true,
                                    editable: false,
                                    fieldLabel: 'Статус',
                                    valueField: 'Value',
                                    displayField: 'Name',
                                    store: App.enum.OperatorStatus.getStore(),
                                    value: 10,
                                    allowBlank: false
                                }
                            ]
                        },
                        {
                            title: 'История баланса',
                            xtype: 'balancehistorypanel',
                            minHeight: 300,
                            flex: 1
                        }
                    ],
                    tbar: [
                        {
                            action: 'Save',
                            text: 'Сохранить',
                            iconCls: 'fa fa-floppy-o',
                            listeners: {
                                click: function (btn) {
                                    var panel = btn.up('personalareapanel');
                                    panel.fireEvent('onSaveClick', panel);
                                }
                            }
                        },
                        {
                            action: 'RemoveAccount',
                            text: 'Удалить аккаунт',
                            iconCls: 'fa fa-trash si-red',
                            listeners: {
                                click: function (btn) {
                                    var panel = btn.up('personalareapanel');
                                    panel.fireEvent('onRemoveAccountBtnClick', panel);
                                }
                            }
                        }
                    ]
                }
                
        //    ]
        //},
        //{
        //    xtype: 'container'
        //}
    ]
});
Ext.define('App.Application', {
    extend: 'Ext.app.Application',
    requires:
    [
        //TODO Ильшату тянуть сразу все найденные Controller в папке view
        'App.view.MainController',
        'App.view.role.Controller',
        'App.view.operator.Controller',
        'App.view.personalarea.Controller',
        'App.view.payment.Controller',
        'App.view.paymenttransfer.Controller',
        'App.view.message.Controller',
        'App.enum.Enums'
    ],

    name: 'App',

    autoCreateViewport: 'App.view.Main'
});
Ext.application({
    name: 'App',
    appFolder: '/js/Application/app',
    paths: {
        'Ext': '/js/ext',
        'App.view': '/js/Application/app/view'
    },

    extend: 'App.Application',

    autoCreateViewport: 'App.view.Main'
});