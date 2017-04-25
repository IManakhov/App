Ext.define('App.view.payment.Window', {
    extend: 'App.base.Window',
    alias: 'widget.paymentwindow',
    controller: 'payment',

    title: 'Пополнить баланс',
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
                    xtype: 'numberfield',
                    fieldLabel: 'Сумма',
                    name: 'Amount'
                }
            ]
        }
    ]
});