Ext.override(Ext.form.field.Tag, {
    isEqual: function (v1, v2) {
        var fromArray = Ext.Array.from,
            valueField = this.valueField,
            i, len, t1, t2;
        v1 = fromArray(v1);
        v2 = fromArray(v2);
        len = v1.length;
        if (len !== v2.length) {
            return false;
        }
        for (i = 0; i < len; i++) {
            if (v1[i]) {
                t1 = v1[i].isModel ? v1[i].get(valueField) : v1[i];
                t2 = v2[i].isModel ? v2[i].get(valueField) : v2[i];
                if (t1 !== t2) {
                    return false;
                }
            }
            else {
                return true;
            }
        }
        return true;
    },

    //listeners: {
    //    beforeselect: function (tagfield , record , index , eOpts )  {
    //        if (tagfield.valueField) {
    //            if (this.valueCollection.items && this.valueCollection.items.length > 0) {
    //                var valueField = this.valueField;
    //                var valueIdCollection = Ext.Array.map(this.valueCollection.items, function (item) { return item.data[valueField] });
    //                return valueIdCollection.indexOf(record.data[valueField]) === -1;
    //            }
    //        }
    //        return true;
    //    }
    //}
});

Ext.override(Ext.form.field.Number, {
    setValue: function (value) {
        var me = this, bind, valueBind;
        //Запрет проставления 0 у numberfield. У numberfield необходимо будет проставлять forbidZero: true
        if (me.forbidZero && !value) {
            value = null;
        }

        if (me.hasFocus) {
            bind = me.getBind();
            valueBind = bind && bind.value;
            if (valueBind && valueBind.syncing && value === me.value) {
                return me;
            }
        }
        return me.callParent([value]);
    }
});