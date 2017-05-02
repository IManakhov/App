Ext.define('Ext.ux.multiupload.Multiupload', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.multiupload',

    /* @cfg {String} [accept] An optional list of file MIME types accepted by this field. This string will be rendered in to the `accept` attribute of the file input and should conform to HTML requirements: http://www.w3.org/TR/html-markup/input.file.html */
    accept: null,

    scrollable: true,
    defaults: { autoScroll: true },
    hideHeaders: true,
    viewConfig: { markDirty: false },
    bodyBorder: false,
    border: false,
    //headerBorders: false,
    store: { fields: ['id', 'Name', 'FileId'] },

    initComponent: function () {
        var me = this;
        me.tbar = [
            {
                xtype: 'form',
                layout: { type: "hbox" },
                height: 24,
                border: false,
                defaults: { border: false },
                items: [
                    {
                        xtype: 'filefield',
                        width: 120,
                        align: 'left',
                        name: 'files',
                        buttonText: 'Добавить файл',
                        msgTarget: 'side',
                        allowBlank: true,
                        buttonOnly: true,
                        listeners: {
                            afterrender: function (cmp) {
                                if (me.accept) {
                                    cmp.fileInputEl.set({ accept: me.accept, multiple: '' });
                                }
                                else {
                                    cmp.fileInputEl.set({ accept: '*', multiple: '' });
                                }
                            },
                            change: function (field, value) {
                                if (field && field.isFileUpload() && field.getValue()) {
                                    var multiuploadForm = field.ownerCt.getForm();
                                    multiuploadForm.submit({
                                        url: '/File/Upload',
                                        timeout: 60000,
                                        success: function (response, options) {
                                            if (options && options.response && options.response.responseText) {
                                                var data = Ext.decode(options.response.responseText);
                                                if (data && data.success && data.files && data.files.length > 0) {
                                                    var store = me.getStore();
                                                    for (var i = 0; i < data.files.length; i++) {
                                                        var file = data.files[i];
                                                        store.add({
                                                            id: file.FileId,
                                                            Name: file.Name,
                                                            FileId: file.FileId
                                                        });
                                                    }
                                                }
                                            }

                                            field.reset();
                                        },
                                        failure: function (response, options) {
                                            Ext.Msg.alert('Ошибка', 'Файл(ы) не загружены.');
                                            field.reset();
                                        }
                                    });
                                }
                                else {
                                    Ext.Msg.alert('Ошибка', 'Файл(ы) не загружены.');
                                    field.reset();
                                }
                            }
                        }
                    },
                    {
                        xtype: 'button',
                        align: 'left',
                        width: 120,
                        text: 'Скачать все',
                        iconCls: 'fa fa-floppy-o',
                        listeners: {
                            click: function (button) {
                                var store = me.getStore();
                                if (store.getCount() > 0) 
                                {
                                    var fileIdArray = Ext.Array.map(store.getRange(), function (x) { return x.data.FileId; });
                                    var url = '/File/DownloadZip?fileIdArray=' + (fileIdArray + "");
                                    window.open(url);
                                }
                            }
                        }
                    }
                ]
            }
        ];

        me.columns = [
            {
                header: 'Удалить',
                menuText: 'Удалить',
                menuDisabled: true,
                resizable: false,
                draggable: false,
                sortable: false,
                xtype: 'actioncolumn',
                flex: 1,
                align: 'center',
                items:
                    [
                        {
                            iconCls: 'fa fa-remove si-red',
                            tooltip: 'Удалить',
                            handler: function (grid, rowIndex, colIndex) {
                                Ext.Msg.show({
                                    title: 'Предупреждение',
                                    msg: 'Вы действительно хотите удалить файл?',
                                    buttons: Ext.Msg.YESNO,
                                    fn: function (button) {
                                        if (button === 'yes') {
                                            var store = grid.getStore();
                                            var record = store.getAt(rowIndex);
                                            store.remove(record);
                                        }
                                    }
                                });
                            }
                        }
                    ]
            },
            {
                header: 'Наименование', dataIndex: 'Name', menuDisabled: true, resizable: false, draggable: false, sortable: false, flex: 7,
                renderer: function (value, record, dataIndex, cell, column) {
                    if (value && record && record.record && record.record.data && record.record.data.FileId && record.record.data.FileId > 0) {
                        return '<a href="/File/Download?id=' + record.record.data.FileId + '" target="_blank">' + value + '</a>';
                    }
                    return value;
                }
            }
        ];

        me.callParent(arguments);
    }
});