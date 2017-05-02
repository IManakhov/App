namespace App.Security
{
    using System;
    using System.Web;
    using System.Web.Mvc;

    public class AuthHttpModule : IHttpModule
    {
        public void Init(HttpApplication context)
        {
            context.AuthenticateRequest += Authenticate;
        }

        private void Authenticate(Object source, EventArgs e)
        {
            HttpApplication httpApplication = source as HttpApplication;
            if (httpApplication?.Context != null)
            {
                IAuthentication authentication = DependencyResolver.Current.GetService<IAuthentication>();
                if (authentication != null)
                {
                    authentication.HttpContext = httpApplication.Context;
                    httpApplication.Context.User = authentication.Principal;
                }
            }
        }

        public void Dispose()
        {
        }
    }
}