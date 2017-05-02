namespace App.DataLayer.Extension.Filter
{
    using System;
    using System.Collections.Generic;
    using System.Web.Mvc;
    using Newtonsoft.Json;

    public class JsonFilterParam : ActionFilterAttribute
    {
        public string Param { get; set; }
        public Type JsonDataType { get; set; }

        public override void OnActionExecuting(ActionExecutingContext actionExecutingContext)
        {
            if (Param == "filter")
            {
                string paramValue = actionExecutingContext.HttpContext.Request[Param];
                List<FilterColumn> deserzdFilter = string.IsNullOrEmpty(paramValue) ? new List<FilterColumn>() : JsonConvert.DeserializeObject<List<FilterColumn>>(paramValue);
                actionExecutingContext.ActionParameters[Param] = deserzdFilter;
            }
        }
    }
}