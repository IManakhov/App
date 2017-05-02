namespace App
{
    using System.Web.Mvc;

    public class FilterConfig
    {
        public static void RegisterGlobalFilters(GlobalFilterCollection globalFilterCollection)
        {
            globalFilterCollection.Add(new HandleErrorAttribute());
        }
    }
}