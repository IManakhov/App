namespace App.Security
{
    using App.Models.Core;
    using System.Security.Principal;
    using System.Web;

    public interface IAuthentication
    {
        /// <summary> Конекст (тут мы получаем доступ к запросу и кукисам) </summary>
        HttpContext HttpContext { get; set; }

        User Login(string login, string password, bool isPersistent);

        //TODO нужен ли этот метод?
        User Login(string login);

        void LogOut();

        IPrincipal Principal { get; }
    }
}