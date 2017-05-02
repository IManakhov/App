namespace App.Controllers.Core
{
    using App.Security;
    using Ninject;
    using System.Web.Mvc;

    public class DefaultController : Controller
    {
        [Inject]
        public IAuthentication Authentication { get; set; }

        public IOperatorIndentity OperatorIndentity => (IOperatorIndentity)Authentication.Principal.Identity;

        protected T Resolve<T>()
        {
            return DependencyResolver.Current.GetService<T>();
        }
    } 
}