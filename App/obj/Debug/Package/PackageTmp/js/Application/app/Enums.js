Ext.define('App.enum.Enums', {

    items: {},

    getItems: function () {
        var data = [];
        for (var i in this.items) {
            data.push({ "Name": this.items[i], "Value": i });
        }
        return data;
    },

    getRenderer: function (val) {
        return this.items[val] || "";
    },

    getFilter: function () {
        return {
                    xtype: 'combobox',
                    type: 'list',
                    store: this.getStore(true),
                    multiSelect: false,
                    displayField: 'Name',
                    valueField: 'Value'
                }
    },

    getStore: function(isFilter) {
        return Ext.create('Ext.data.Store',
        {
            fields: ['Value', 'Name'],
            data: isFilter ? [{ "Name": '-', "Value": null }].concat(this.getItems()) : this.getItems()
        });
    }
});

//Месяцы
Ext.define('App.enum.Month', {
    extend: 'App.enum.Enums',
    singleton: true,

    items: {
        1: "Январь",
        2: "Февраль",
        3: "Март",
        4: "Апрель",
        5: "Май",
        6: "Июнь",
        7: "Июль",
        8: "Август",
        9: "Сентябрь",
        10: "Октябрь",
        11: "Ноябрь",
        12: "Декабрь"
    },
    getRenderer: function (val) {
        return App.enum.Month.items[val] || "";
    },
    getStore: function (isFilter) {
        return Ext.create('Ext.data.Store',
        {
            fields: ['Id', 'Name'],
            data: isFilter ? [{ "Name": '-', "Id": null }].concat(this.getItems()) : this.getItems()
        });
    },

    getItems: function () {
        var data = [];
        for (var i in this.items) {
            data.push({ "Name": this.items[i], "Id": i });
        }
        return data;
    }
});

Ext.define('App.enum.OperatorStatus', {
    extend: 'App.enum.Enums',
    singleton: true,

    items: {
        10: "Активный",
        20: "Удалился"
    },
    getRenderer: function (val) {
        return App.enum.OperatorStatus.items[val] || "";
    }
});

Ext.define('App.enum.YesOrNo', {
    extend: 'App.enum.Enums',
    singleton: true,

    items: {
        10: "Нет",
        20: "Да"
    },
    getRenderer: function (val) {
        return App.enum.YesOrNo.items[val] || "";
    }
});

Ext.define('App.enum.ActiveStatus', {
    extend: 'App.enum.Enums',
    singleton: true,

    items: {
        0: "Не активен",
        10: "Активен"
    },

    getRenderer: function (val) {
        return App.enum.ActiveStatus.items[val] || "";
    }
});

Ext.define('App.enum.PaymentTransferDecision', {
    extend: 'App.enum.Enums',
    singleton: true,

    items: {
        0: "Отсутствует",
        10: "Отменил отправитель",
        20: "Отменил получатель",
        30: "Получил получатель"
    },
    getRenderer: function (val) {
        return App.enum.PaymentTransferDecision.items[val] || "";
    }
});

Ext.define('App.enum.PaymentType', {
    extend: 'App.enum.Enums',
    singleton: true,

    items: {
        0: "Отсутствует",
        10: "Пополнение cчета",
        20: "Перевод счета на счет"
    },
    getRenderer: function (val) {
        return App.enum.PaymentType.items[val] || "";
    }
});