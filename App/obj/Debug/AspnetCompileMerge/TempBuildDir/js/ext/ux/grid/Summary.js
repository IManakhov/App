Ext.require('Ext.grid.feature.Summary', function() {
    Ext.override(Ext.grid.feature.Summary, {
        getSummary: function(store, type, field) {
            if (type) {
                var rawData = store.proxy.reader.rawData;
                if (rawData) {
                    var summaryData = rawData.summaryData;
                    if (summaryData)
                        return summaryData[field];
                }
            }
            return '';
        }
    });
});