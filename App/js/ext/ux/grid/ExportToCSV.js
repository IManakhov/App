Ext.define('Ext.ux.grid.ExportToCSV', {
	extend: 'Ext.AbstractPlugin',
	alias: 'plugin.exportToCSV',
	uses: [
		'Ext.button.Button'
	],
	mixins: {
		observable: 'Ext.util.Observable'
	},

	// private
	init: function (grid) {
		var me = this;
		me.currentGrid = grid;
		var btn = Ext.create('Ext.button.Button',
	        {
	            action: 'exportToCSV',
	            iconCls: ' fa fa-file-excel-o',
	            style: 'color: #4BB155;',
	            text: 'Экспорт в CSV'
	        }
	    );
		btn.on({
		    click: me.onExportToCSVClick,
		    scope: me
		});
		grid.down('toolbar').add(btn);
	},
	
	onExportToCSVClick: function () {
        var me = this;
        var downloader = Ext.getCmp('FileDownloader');
	    var filter = [],
	        columnModel = [];
	    Ext.each(me.currentGrid.getStore().filters.items, function(item) {
	        filter.push({	            
	            operator: item.operator,
	            property: item.property,
	            type: item.type,
	            value: item.value
	        });
	    });
	    Ext.each(me.currentGrid.columns, function (column) {
	        columnModel.push({
	            text: column.text,
	            dataIndex: column.dataIndex
	        });
	    });
	    var extraParams = '';
	    Ext.each(me.currentGrid.query('[filterName]'), function (item) {
	        var itemValue = item.getValue();
	        if (itemValue) {
	            extraParams = extraParams + '&' + item.filterName + '=' + itemValue.toLocaleDateString();
	        }
	    });
	    var methodName = me.currentGrid.getStore().proxy.extraParams.methodName;
        downloader.load({
            url: '/' + me.currentGrid.getStore().proxy.url.split('/')[1] + '/ExportToCSV?methodName=' + (methodName ? methodName : '') + '&title=' + (me.currentGrid.title || me.currentGrid.up('panel').title) + '&filter=' + Ext.encode(filter) + '&columnModel=' + Ext.encode(columnModel) + extraParams
        });
    }
});