Ext.define('ZC0Url', {

    singleton: true,
    loadedCss: {},

    /**
     * Добавляет rootUrl к переданному параметру url
     * @param {String} url
     * относительный url
     */
    content: function (url) {
        return window.location.host + url;
    },

    /**
     * Возвращает сформированный по имени контроллера, метода и передаваемым параметрам url.
     * @param {String} action Имя метода вызываемого контроллера.
     * @param {String} controller Имя вызываемого контроллера.
     * @param {Object} params Объект, содержащий параметры в виде ключ-значение.
     * @return {String} Сформированный url.
     */
    action: function (action, controller, params) {
        var paramStr = Ext.urlEncode(params);
        var url = '';
        if (Ext.isEmpty(controller)) {
            url = /*window.location.host +*/ action;
        } else {
            url = /*window.location.host +*/ Ext.String.format('/{0}/{1}', controller, action);
        }
        return Ext.String.urlAppend(url, paramStr);
    },

    /**
     * Подгружает css-файл.
     * @param {String} url Относительный путь до css-файла.
     */
    loadCss: function (url) {
        if (B4.Url.loadedCss[url])
            return;

        var link = document.createElement("link");
        link.type = "text/css";
        link.rel = "stylesheet";
        link.href = url;
        document.getElementsByTagName("head")[0].appendChild(link);
        B4.Url.loadedCss[url] = true;
    }
});