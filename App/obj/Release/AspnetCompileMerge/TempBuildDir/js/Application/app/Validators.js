// custom Vtype for vtype:'phone' 
// Vtype for phone number validation
Ext.apply(Ext.form.VTypes, {
    'phoneText': 'Телефон должен состоять из 11 или 12 цифр',
    'phoneMask': /[\-\+0-9\(\)\s\.Ext]/,
    'phoneRe': /^(^(\d{11})|^(\d{12}))$/,
    'phone': function (v) {
        return this.phoneRe.test(v);
    },
    phoneEmptyText: '89776665544 или 88437776655',
});

// Function to format a phone number
Ext.apply(Ext.util.Format, {
    phoneNumber: function (value) {
        var phoneNumber = value.replace(/\./g, '').replace(/-/g, '').replace(/[^0-9]/g, '');

        if (phoneNumber !== '' && phoneNumber.length === 10) {
       //     return '' + phoneNumber.substr(0, 3) + '' + phoneNumber.substr(3, 3) + '-' + phoneNumber.substr(6, 4);
        } else {
            return value;
        }
        return value;
    }
});