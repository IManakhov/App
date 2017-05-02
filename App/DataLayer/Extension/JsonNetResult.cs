using System.Web;

namespace App.DataLayer.Extension
{
    using System;
    using System.Data;
    using System.Text;
    using System.Web.Mvc;
    using Newtonsoft.Json;
    using Newtonsoft.Json.Converters;

    public class JsonNetResult : ActionResult
    {
        public JsonNetResult()
        {
            SerializerSettings = new JsonSerializerSettings() {
                DateFormatHandling = DateFormatHandling.IsoDateFormat
            };
            Formatting = Formatting.None;
            StatusCode = 200;
        }

        public JsonNetResult(object data) : this()
        {
            Data = data;
        }

        public JsonNetResult(object data, string contentType) : this(data)
        {
            ContentType = contentType;
        }

        public static JsonNetResult Success => new JsonNetResult(new { success = true });

        public static JsonNetResult Failure(string message) => new JsonNetResult(new { success = false, message = message }) { StatusCode = 500 };

        public Encoding ContentEncoding { get; set; }

        public string ContentType { get; set; }

        public object Data { get; set; }

        public int StatusCode { get; set; }

        public JsonSerializerSettings SerializerSettings { get; set; }

        public Formatting Formatting { get; set; }

        public override void ExecuteResult(ControllerContext controllerContext)
        {
            if (controllerContext == null)
            {
                throw new ArgumentNullException("controllerContext");
            }
            
            HttpResponseBase response = controllerContext.HttpContext.Response;
            response.StatusCode = StatusCode;
            response.ContentType = !string.IsNullOrEmpty(ContentType) ? ContentType : "application/json";

            if (ContentEncoding != null)
            {
                response.ContentEncoding = ContentEncoding;
            }

            if (Data == null)
            {
                return;
            }

            response.StatusCode = StatusCode;

            JsonTextWriter writer = new JsonTextWriter(response.Output) { Formatting = Formatting };

            if (Data is DataTable)
            {
                SerializerSettings.Converters.Add(new DataTableConverter());
                SerializerSettings.NullValueHandling = NullValueHandling.Ignore;
                SerializerSettings.ObjectCreationHandling = Newtonsoft.Json.ObjectCreationHandling.Replace;
                SerializerSettings.MissingMemberHandling = Newtonsoft.Json.MissingMemberHandling.Ignore;
                SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
                SerializerSettings.DateFormatHandling = DateFormatHandling.IsoDateFormat;
            }

            JsonSerializer serializer = JsonSerializer.Create(SerializerSettings);
            serializer.Serialize(writer, Data);
            writer.Flush();
        }
    }
}