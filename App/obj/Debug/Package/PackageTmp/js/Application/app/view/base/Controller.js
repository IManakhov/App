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