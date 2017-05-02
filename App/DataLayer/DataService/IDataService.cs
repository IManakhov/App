namespace App.DataLayer.DataService
{
    using App.DataLayer.Filters;
    using App.DTO.Core;
    using App.Models.Core;

    /// <summary> Базовый интерфейс IDataService </summary>
    public interface IDataService<T, TK> where T : PersistentEntity where TK : HasIdDTO
    {
        /// <summary> Получить список объектов </summary>
        DataListResult List(BaseParams baseParams);

        /// <summary> Получить древовидный список объектов </summary>
        object TreeList(BaseParams baseParams);

        /// <summary> Получить сущность по id </summary>
        object Get(long id);

        /// <summary> Создать сущность </summary>
        long Create(TK entity);

        /// <summary> Обновить сущность </summary>
        void Update(TK entity);

        /// <summary> Удалить сущность по id </summary>
        void Delete(long id);
    }

    public class DataListResult
    {
        public dynamic data { get; set; }
        public dynamic summaryData { get; set; }
        public int totalCount { get; set; }
    }
}