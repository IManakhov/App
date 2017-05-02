namespace App.Controllers.Core
{
    using System;
    using System.Web.Mvc;
    using Newtonsoft.Json;
    using App.DataLayer.Filters;
    using Ninject;
    using App.DataLayer.DataService;
    using App.DTO.Core;
    using App.Models.Core;
    using DataLayer.Repository;
    using DataLayer.Extension;

    /// <summary> Базовый Controller </summary>
    [Authorize]
    public class BaseCrudViewController<T,TK> : DefaultController where T : PersistentEntity where TK : HasIdDTO 
    {
        [Inject]
        public IDataService<T, TK> DataService { get; set; }

        [Inject]
        public IDataStore DataStore { get; set; }

        /// <summary> Список всех элементов в таблице </summary>
        public virtual ActionResult List(BaseParams baseParams)
        {
            DataListResult data = DataService.List(baseParams);
            return new JsonNetResult(data);
        }

        /// <summary> Дерево всех элементов в таблице </summary>
        public virtual ActionResult TreeList(BaseParams baseParams)
        {
            object data = DataService.TreeList(baseParams);
            return new JsonNetResult(data);
        }

        /// <summary> Выдать элемент по id </summary>
        /// <param name="id"></param>
        public virtual ActionResult Get(long id)
        {
            //long id = Convert.ToInt64(baseParams.GetValue("id"));
            object data = DataService.Get(id);
            return new JsonNetResult(data);
        }

        /// <summary> Сохранить элемент в таблице </summary>
        /// <param name="entity"></param>
        public virtual ActionResult Save(TK entity)
        {
            var id = entity.Id;
            try
            {
                if (id > 0)
                {
                    DataService.Update(entity);
                }
                else
                {
                    id = DataService.Create(entity);
                }
                return new JsonNetResult(new { success = true, id = id });
            }
            catch (Exception e)
            {
                return new JsonNetResult(new { success = false, message = e.Message });
            }
        }        

        /// <summary> Удаление из базы </summary>
        /// <param name="ids"></param>
        public virtual ActionResult Delete(BaseParams baseParams)
        {
            string ids = Convert.ToString(baseParams.GetValue("ids"));
            int[] idsArray = JsonConvert.DeserializeObject<int[]>(ids);
            try
            {
                foreach (int id in idsArray)
                {
                    DataService.Delete(id);
                }
                return new JsonNetResult(new {success = true});
            }
            catch (Exception e)
            {
                return new JsonNetResult(new {success = false, message = e.Message});
            }
        }

        /// <summary> Изменение элемента в базе </summary>
        /// <param name="id"></param>
        public virtual ActionResult Edit(TK entity)
        {
            try
            {
                DataService.Update(entity);
                return new JsonNetResult(new { success = true });
            }
            catch (Exception e)
            {
                return new JsonNetResult(new { success = false, message = e.ToString() });
            }
        }        

        /// <summary>
        /// Оборачиваем ошибку в html страницу
        /// </summary>
        /// <param name="e"></param>
        /// <returns></returns>
        protected ContentResult GetErrorPage(Exception e)
        {
            return Content(string.Format("<html><h2><b>Произошла ошибка!<b></br>Причина следующая:</h2><br>{0}</html>", e.Message));
        }
    }
}