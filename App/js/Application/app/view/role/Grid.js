Ext.define('App.view.role.Grid', {
    extend: 'App.base.Grid',
    alias: 'widget.rolepanel',
    controller: 'role',
    requires: ['App.store.Role'],
    viewConfig: {
        stripeRows: true
    },

    initComponent: function () {
        this.store = Ext.create('App.store.Role', {
            listeners: {
                beforeload: function (store, opeation) {
                    opeation.params = opeation.params || {};
                    opeation.params.IsOther = true;
                }
            }
        });

        Ext.apply(this, {
            store: this.store,

            columns: [
                {
                    text: 'Имя',
                    flex: 1,
                    dataIndex: 'Name',
                    filter: true
                }
            ]
        });

        this.callParent();
    }
});