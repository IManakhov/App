using App.DataLayer.DataService;
using App.DataLayer.Filters;

namespace App.Controllers.Core
{
    using App.DTO.Core;
    using App.Models.Core;
    using System.Linq;
    using System.Web.Mvc;
    using App.DataLayer.Extension;
    using DataLayer.DataService.Implementation;
    using System.Collections.Generic;
    using System;

    public class OperatorController : BaseCrudViewController<Operator, OperatorDTO>
    {
        public OperatorDataService OperDataService => (OperatorDataService)DataService;

        [HttpPost]
        public ActionResult ChangePassword(string oldPassword, string newPassword)
        {
            if (CommonExtension.IsPasswordValid(newPassword) == false)
            {
                return new JsonNetResult(new { success = false, message = "Новый пароль невалиден." });
            }

            string oldEncryptedPassword = CommonExtension.EncryptPassword(oldPassword);
            User user = DataStore.OperatorIndentity.Operator.User;
            long userId = DataStore.GetAll<User>().Where(x => x.Id == user.Id && x.Password == oldEncryptedPassword).Select(x => x.Id).FirstOrDefault();
            if (userId <= 0L)
            {
                return new JsonNetResult(new { success = false, message = "Старый пароль неверен." });
            }
            
            user.Password = CommonExtension.EncryptPassword(newPassword);
            DataStore.Update<User>(user);

            return new JsonNetResult(new { success = true });
        }

        /// <summary>
        /// Получить текущего оператора
        /// </summary>
        public ActionResult GetCurrent()
        {
            object data = OperDataService.GetCurrent();
            return new JsonNetResult(data);
        }

        /// <summary>
        /// Получить текущего оператора
        /// </summary>
        public ActionResult RemoveCurrentAccount()
        {
            try
            {
                OperDataService.RemoveCurrentAccount();
                return JsonNetResult.Success;
            }
            catch (Exception e)
            {
                return JsonNetResult.Failure(e.Message);
            }
        }

        
        /// <summary> Получить Фамилию и Имя оператора </summary>
        public ActionResult GetCurrentOperatorSurnameAndName()
        {
            string surnameAndName = DataStore.OperatorIndentity.Operator.GetSurnameAndName();
            return new JsonNetResult(new { surnameAndName = surnameAndName });
        }

        public ActionResult Favorite(long favoriteId)
        {
            try {
                OperDataService.FavoriteOperator(favoriteId);
                return JsonNetResult.Success;
            }
            catch(Exception e)
            {
                return JsonNetResult.Failure(e.Message);
            }
        }

        /// <summary> Список всех элементов в таблице </summary>
        public virtual ActionResult BalanceHistory(BaseParams baseParams)
        {
            DataListResult data = OperDataService.BalanceHistory(baseParams);
            return new JsonNetResult(data);
        }
    }
}