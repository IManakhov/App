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