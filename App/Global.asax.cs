namespace App
{
    using System.Web.Mvc;
    using System.Web.Optimization;
    using System.Web.Routing;
    using Newtonsoft.Json;
    using App.DataLayer.Filters;
    using App.DTO;

    public class MvcApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);
            DependencyResolver.SetResolver(new NinjectDependencyResolver());
            ModelBinders.Binders.Add(typeof(BaseParams), new BaseParamsModelBinder());
            JsonConvert.DefaultSettings = () => new JsonSerializerSettings
            {
                DateFormatHandling = DateFormatHandling.IsoDateFormat
            };
        }
    }
}