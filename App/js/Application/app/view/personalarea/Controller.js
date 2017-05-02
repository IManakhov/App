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