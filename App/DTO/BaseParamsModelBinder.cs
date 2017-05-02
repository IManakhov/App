namespace App.DTO
{
    using System.Collections.Generic;
    using System.Collections.Specialized;
    using System.Web;
    using System.Web.Mvc;
    using App.DataLayer.Filters;

    public class BaseParamsModelBinder : IModelBinder
    {
        public object BindModel(ControllerContext controllerContext, ModelBindingContext bindingContext)
        {
            HttpRequestBase request = controllerContext.HttpContext.Request;
            BaseParams result = new BaseParams {Params = NameValueCollectionToDictionary(request.Params)};
            return result;
        }

        private IDictionary<string, object> NameValueCollectionToDictionary(NameValueCollection nameValueCollection)
        {
            IDictionary<string, object> dictionary = new Dictionary<string, object>();
            foreach (string key in nameValueCollection.AllKeys)
            {
                dictionary.Add(key, nameValueCollection[key]);
            }
            return dictionary;
        }
    }
}