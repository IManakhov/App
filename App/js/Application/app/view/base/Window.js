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