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