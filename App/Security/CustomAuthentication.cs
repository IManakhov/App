namespace App.Security
{
    using Ninject;
    using System;
    using System.Linq;
    using System.Security.Principal;
    using System.Web;
    using System.Web.Security;
    using App.Models.Core;
    using App.DataLayer.Extension;
    using App.DataLayer.Repository;

    public class CustomAuthentication : IAuthentication
    {
        private const string cookieName = "__AUTH_COOKIE";

        public HttpContext HttpContext { get; set; }
    
        [Inject]
        public DefaultContext DefaultContext { get; set; }

        #region IAuthentication Members

        //TODO Сразу Operator можно доставать
        public User Login(string login, string password, bool isPersistent)
        {
            string encryptedPassword = CommonExtension.EncryptPassword(password);
            User retUser = DefaultContext.UserItems.SingleOrDefault(x => x.Login == login && x.Password == encryptedPassword);
            if (retUser != null)
            {
                Operator oper = DefaultContext.OperatorItems.FirstOrDefault(x => x.IsDeleted != 1 && x.UserId == retUser.Id && x.Status != OperatorStatus.Удалился && x.IsLastVersion == 1);
                if (oper != null)
                    CreateCookie(login, isPersistent);
                else
                    return null;
            }
            return retUser;
        }

        //TODO нужен ли этот метод?
        public User Login(string login)
        {
            User retUser = DefaultContext.UserItems.SingleOrDefault(x => x.Login == login);
            if (retUser != null)
            {
                CreateCookie(login);
            }
            return retUser;
        }

        private void CreateCookie(string userName, bool isPersistent = false)
        {
            FormsAuthenticationTicket ticket = new FormsAuthenticationTicket(
                  1,
                  userName,
                  DateTime.Now,
                  DateTime.Now.Add(FormsAuthentication.Timeout),
                  isPersistent,
                  string.Empty,
                  FormsAuthentication.FormsCookiePath);

            // Encrypt the ticket.
            string encTicket = FormsAuthentication.Encrypt(ticket);

            // Create the cookie.
            HttpCookie authCookie = new HttpCookie(cookieName)
            {
                Value = encTicket,
                Expires = DateTime.Now.Add(FormsAuthentication.Timeout)
            };
            HttpContext.Response.Cookies.Set(authCookie);
        }

        public void LogOut()
        {
            HttpCookie httpCookie = HttpContext.Response.Cookies[cookieName];
            if (httpCookie != null)
            {
                httpCookie.Value = string.Empty;
            }
        }

        private IPrincipal _principal;

        public IPrincipal Principal
        {
            get
            {
                if (_principal == null)
                {
                    try
                    {
                        HttpCookie httpCookie = HttpContext.Request.Cookies.Get(cookieName);
                        if (string.IsNullOrEmpty(httpCookie?.Value) == false)
                        {
                            FormsAuthenticationTicket ticket = FormsAuthentication.Decrypt(httpCookie.Value);
                            _principal = new Principal(ticket.Name, DefaultContext);
                        }
                        else
                        {
                            _principal = new Principal(null, null);
                        }
                    }
                    catch(Exception e)
                    {
                        _principal = new Principal(null, null);
                    }
                }
                return _principal;
            }
        }
        #endregion
    }
}