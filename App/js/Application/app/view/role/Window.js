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