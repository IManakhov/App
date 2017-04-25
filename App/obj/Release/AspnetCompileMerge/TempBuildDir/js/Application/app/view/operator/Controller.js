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