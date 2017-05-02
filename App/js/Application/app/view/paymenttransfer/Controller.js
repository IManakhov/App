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