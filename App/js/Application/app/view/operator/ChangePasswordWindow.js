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