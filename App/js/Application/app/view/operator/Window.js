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