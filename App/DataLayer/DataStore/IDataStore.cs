namespace App.DataLayer.Repository
{
    using App.Models.Core;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using App.Security;

    public interface IDataStore : IDisposable
    {
        DefaultContext DefaultContext { get; set; }
        IAuthentication Authentication { get; set; }
        IOperatorIndentity OperatorIndentity { get; }

        /// <summary> Получить список объектов (без удалённых) </summary>
        IQueryable<T> GetAll<T>() where T : PersistentEntity;

        /// <summary> Получить список объектов (с удалёнными) </summary>
        IQueryable<T> GetAllWithDeleted<T>() where T : PersistentEntity;

        /// <summary> Получить список только удалённых объектов </summary>
        IQueryable<T> GetAllOnlyDeleted<T>() where T : PersistentEntity;

        /// <summary> Получить сущность по id </summary>
        T Get<T>(long id) where T : PersistentEntity;

        /// <summary> Создать сущность </summary>
        void Create<T>(T entity) where T : PersistentEntity;

        /// <summary> Создать список сущностей </summary>
        void Create<T>(List<T> entity) where T : PersistentEntity;

        /// <summary> Обновить сущность </summary>
        void Update<T>(T entity) where T : PersistentEntity;

        /// <summary> Обновить список сущностей </summary>
        void Update<T>(List<T> entity) where T : PersistentEntity;

        /// <summary> Удалить сущность по id (Мягкое удаление (IsDeleted = 1), Базовая реализация (в DataStore) с логированием) </summary>
        void Delete<T>(long id) where T : PersistentEntity;

        /// <summary> Удалить сущность по id из БД навсегда (Базовая реализация (в DataStore) без логирования) </summary>
        void DeleteCompletely<T>(long id) where T : PersistentEntity; // удаление объекта по id из БД навсегда

        /// <summary> Сохранение изменений </summary>
        void Save();
    }
}