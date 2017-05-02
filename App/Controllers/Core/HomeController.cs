namespace App.Controllers.Core
{
    using System.Web.Mvc;

    [Authorize]
    public class HomeController : DefaultController
    {
        public ActionResult Index()
        {
            return View();
        }
    }
}