namespace App.DataLayer.Filters
{
    using System;
    using System.Collections.Generic;

    /// <summary> Базовые параметры запроса. </summary>
    [Serializable]
    public class BaseParams
    {
        private IDictionary<string,object> _params;

        /// <summary> Динамический словарь для параметров. </summary>
        public IDictionary<string, object> Params
        {
            get { return _params ?? (_params = new Dictionary<string, object>()); }
            set { _params = value; }
        }

        public object GetValue(string key)
        {
            if (_params.ContainsKey(key))
            {
                return _params[key];
            }
            return null;
        }

        public void setUnLimit()
        {
            if (_params.ContainsKey("limit"))
                Params["limit"] = 0;
        }

        public StoreLoadParams GetStoreLoadParams()
        {
            int start = Convert.ToInt32(Params.ContainsKey("start") ? Params["start"].ToString() : "0");
            int limit = Convert.ToInt32(Params.ContainsKey("limit") ? Params["limit"].ToString() : "0");
            string filter = Params.ContainsKey("filter") ? Params["filter"].ToString() : string.Empty;
            string sort = Params.ContainsKey("sort") ? Params["sort"].ToString() : string.Empty;
            return new StoreLoadParams(start, limit, filter, sort);
        }
    }
}