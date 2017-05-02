namespace App.Controllers.Core
{
    using System.Web.Mvc;
    using System.Collections.Generic;
    using System.Linq;
    using App.DataLayer.Extension;
    using Ninject;
    using DTO.Core;

    /// <summary> Контроллер регистрации пунктов меню </summary>
    public class MenuItemsController : DefaultController
    {
        private IList<MenuItem> RegisteredMenuItems { get; set; }
        
        [Authorize]
        public ActionResult GetAll()
        {
            InitMenuItems();
            MenuItem root = new MenuItem() { leaf = false, text = "Приложение" };
            List<MenuItem> menu = PrepareMenuChilds("/").Where(x => x.children.Any() || x.leaf).ToList();
            root.children = menu;
            return new JsonNetResult(root);
        }

        private void InitMenuItems()
        {
            RegisterMenuItem("Рабочий стол",              "desktop",            true, false,    "/",    "fa fa-desktop si-blue");
            //if (OperatorIndentity.Operator.User.Login == "admin")
            //{
            //    RegisterMenuItem("Роли", "role", true, false, "/", "fa fa-users si-blue");
            //}
            RegisterMenuItem("Денежные переводы", "paymenttransfer", true, false, "/", "fa fa-retweet si-red");
            RegisterMenuItem("Пополнение счета", "payment", true, false, "/", "fa fa-money si-green");
            RegisterMenuItem("Сообщения", "message", true, false, "/", "fa fa-comments si-yellow");
            RegisterMenuItem("Пользователи", "operator", true, false, "/", "fa fa-user si-green");
            RegisterMenuItem("Личный кабинет", "personalarea", true, false, "/", "fa fa-gear");
        }

        private List<MenuItem> PrepareMenuChilds(string path)
        {
            List<MenuItem> childs = RegisteredMenuItems.Where(x => x.treePath == path).ToList();
            foreach (MenuItem menuItem in childs)
            {
                menuItem.children = PrepareMenuChilds((menuItem.treePath == "/" ? "" : menuItem.treePath) + "/" + menuItem.module);
            }
            return childs;
        }

        private void RegisterMenuItem(string text, string module, bool leaf, bool expanded, string treePath,
            string iconCls)
        {
            if (RegisteredMenuItems == null)
            {
                RegisteredMenuItems = new List<MenuItem>();
            }
            RegisteredMenuItems.Add(new MenuItem
            {
                text = text,
                module = module,
                leaf = leaf,
                iconCls = iconCls,
                expanded = expanded,
                treePath = treePath
            });
        }

        private class MenuItem
        {
            public string treePath { get; set; }
            public string text { get; set; }
            public string module { get; set; }
            public string iconCls { get; set; }
            public bool leaf { get; set; }
            public bool expanded { get; set; }
            public IList<MenuItem> children { get; set; }
        }
    }
}