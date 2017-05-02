using App.DataLayer.DataService;
using App.DTO.Core;
using Ninject;

namespace App.Controllers.Core
{
    using App.Models.Core;
    using App.DataLayer.Extension;
    using System.ComponentModel.DataAnnotations;
    using System.Web.Mvc;
    using App.DataLayer.DataService.Implementation;
    using AutoMapper;
    using System;

    public class LoginController : DefaultController
    {
        [Inject]
        public IDataService<Operator, OperatorDTO> OperatorDataService { get; set; }

        [HttpGet]
        public ActionResult Register()
        {
            return View();
        }

        [HttpGet]
        public ActionResult Index()
        {
            return View(new LoginView());
        }

        [HttpPost]
        public ActionResult Index(LoginView loginView)
        {
            ViewBag.ErrorMessage = string.Empty;
            LoginModel loginModel = Login(loginView);
            if (loginModel.success == false)
            {
                ViewBag.ErrorMessage = "Неправильный логин или пароль";
                ModelState["Password"].Errors.Add(loginModel.message);
                return View(new LoginView());
            }
            return RedirectToAction("Index", "Home");
        }

        [HttpPost]
        public ActionResult Register(RegisterView registerView)
        {
            ViewBag.ErrorMessage = string.Empty;
            if (registerView.Password != registerView.PasswordRepeat)
            {
                ViewBag.ErrorMessage = "Пароли не совпадают";
                registerView.Password = string.Empty;
                registerView.PasswordRepeat = string.Empty;
                return View(registerView);
            }

            OperatorDTO operModel = Mapper.Map<OperatorDTO>(registerView);
            try
            {
                OperatorDataService.Create(operModel);
            }
            catch (Exception e) {
                ViewBag.ErrorMessage = e.Message;
                registerView.Password = string.Empty;
                registerView.PasswordRepeat = string.Empty;
                return View(registerView);
            }
            Authentication.Login(operModel.Login);
            
            return RedirectToAction("Index", "Home");
        }

        
        public ActionResult Logout()
        {
            Authentication.LogOut();
            ViewBag.ErrorMessage = string.Empty;
            return RedirectToAction("Index", "Home");
        }

        #region AuthMethods
        protected LoginModel Login(LoginView loginView)
        {
            ViewBag.ErrorMessage = string.Empty;
            string message = string.Empty;
            User user = null;
            if (ModelState.IsValid)
            {
                //if (CommonExtension.IsPasswordValid(loginView.Password) == false)
                //{
                //    ViewBag.ErrorMessage = "Неправильный логин или пароль";
                //    message = "Неправильный логин или пароль";
                //}
                //else
                //{
                    user = Authentication.Login(loginView.Login, loginView.Password, loginView.IsPersistent);
                    if (user == null)
                    {
                        ViewBag.ErrorMessage = "Неправильный логин или пароль";
                        message = "Неправильный логин или пароль";
                    }
                //}
            }
            else
            {
                ViewBag.ErrorMessage = "Неправильный логин или пароль";
                message = "Неправильный логин или пароль";
            }

            LoginModel loginModel = new LoginModel
            {
                message = message,
                success = string.IsNullOrEmpty(message),
                User = user
            };
            return loginModel;
        }
        #endregion
    }

    #region AuthViewModels
    public class LoginView
    {
        [Required(ErrorMessage = "Введите логин")]
        public string Login { get; set; }

        [Required(ErrorMessage = "Введите пароль")]
        public string Password { get; set; }

        public bool IsPersistent { get; set; }
    }

    public class RegisterView
    {
        [Required(ErrorMessage = "Укажите Фамилию")]
        public string Surname { get; set; }

        [Required(ErrorMessage = "Укажите Имя")]
        public string Name { get; set; }

        [Required(ErrorMessage = "Укажите Отчество")]
        public string Patronymic { get; set; }

        [Required(ErrorMessage = "Укажите Телефон")]
        public string Phone { get; set; }

        [Required(ErrorMessage = "Укажите Email")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Укажите Логин")]
        public string Login { get; set; }

        [Required(ErrorMessage = "Укажите Пароль")]
        public string Password { get; set; }
        
        public string PasswordRepeat { get; set; }
    }

    public class LoginModel
    {
        public bool success { get; set; }
        public string message { get; set; }
        public User User { get; set; }
    }
    #endregion
}