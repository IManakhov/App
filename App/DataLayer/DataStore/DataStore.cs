namespace App.DataLayer.Repository
{
    using App.Models.Core;
    using System;
    using System.Collections.Generic;
    using System.Data.Entity;
    using System.Linq;
    using App.Security;
    using Ninject;

    public class DataStore : IDataStore
    {
        [Inject]
        public DefaultContext DefaultContext { get; set; }

        [Inject]
        public IAuthentication Authentication { get; set; }
        
        public IOperatorIndentity OperatorIndentity => (IOperatorIndentity)Authentication.Principal.Identity;

        private DbSet<T> GetDbSet<T>() where T : PersistentEntity
        {
            return DefaultContext.GetDbSet<T>().Cast<T>();
        }

        /// <summary> Получить список неудаленных  </summary>
        public IQueryable<T> GetAll<T>() where T : PersistentEntity
        {
            return GetDbSet<T>().Where(x => x.IsDeleted == 0);
        }

        /// <summary> Получить список объектов (с удалёнными) </summary>
        public IQueryable<T> GetAllWithDeleted<T>() where T : PersistentEntity
        {
            return GetDbSet<T>();
        }

        /// <summary> Получить список только удалённых объектов </summary>
        public IQueryable<T> GetAllOnlyDeleted<T>() where T : PersistentEntity
        {
            return GetDbSet<T>().Where(x => x.IsDeleted == 1);
        }

        /// <summary> 
        /// Получить сущность по id.
        /// Обнаруживает сущность с указанными значениями первичного ключа.
        /// Если сущность с указанными значениями первичного ключа содержится в контексте, 
        /// она возвращается немедленно без выполнения запроса к хранилищу.
        /// В противном случае выполняется запрос к хранилищу в поисках сущности с указанными значениями первичного ключа. 
        /// Если такая сущность обнаружена, она добавляется к контексту и возвращается вызывающей стороне.
        /// Если сущность не обнаружена в контексте или в хранилище, возвращается значение NULL. 
        /// </summary>
        public T Get<T>(long id) where T : PersistentEntity
        {
            return GetDbSet<T>().Find(id);
        }
        
        /// <summary> Создать сущность </summary>
        public void Create<T>(T item) where T : PersistentEntity
        {
            DateTime now = DateTime.Now;
            item.ObjectCreateDate = now;
            item.ObjectEditDate = now;
            item.Version = 1; 
            item.IsDeleted = 0;
            DefaultContext.Set<T>().Add(item);
            Save();
        }

        /// <summary> Создать список сущностей </summary>
        public void Create<T>(List<T> items) where T : PersistentEntity
        {
            DateTime now = DateTime.Now;
            items.ForEach(x =>
            {
                x.ObjectCreateDate = now;
                x.ObjectEditDate = now;
                x.Version = 1;
                x.IsDeleted = 0;
                GetDbSet<T>().Add(x);
            });
            Save();
        }

        /// <summary> Обновить сущность </summary>
        public void Update<T>(T item) where T : PersistentEntity
        {
            item.ObjectEditDate = DateTime.Now;
            item.Version++;
            DefaultContext.Entry(item).State = EntityState.Modified;
            Save();
        }

        /// <summary> Обновить список сущностей </summary>
        public void Update<T>(List<T> items) where T : PersistentEntity
        {
            DateTime now = DateTime.Now;
            foreach (T item in items)
            {
                item.ObjectEditDate = now;
                item.Version++;
            }
            DefaultContext.Entry(items).State = EntityState.Modified;
            Save();
        }

        /// <summary> Удалить сущность по id (Мягкое удаление (IsDeleted = 1), реализация с логированием) </summary>
        public void Delete<T>(long id) where T : PersistentEntity
        {
            T item = Get<T>(id);
            if (item != null)
            {
                item.ObjectEditDate = DateTime.Now;
                item.IsDeleted = 1;
                DefaultContext.Entry(item).State = EntityState.Modified;
                Save();
            }
        }

        /// <summary> Удалить сущность по id из БД навсегда (реализация без логирования) </summary>
        public void DeleteCompletely<T>(long id) where T : PersistentEntity
        {
            T item = Get<T>(id);
            if (item != null)
            {
                GetDbSet<T>().Remove(item);
                Save();
            }
        }

        /// <summary> Сохранение изменений </summary>
        public void Save()
        {
            DefaultContext.SaveChanges();
        }

        private bool disposed = false;

        public virtual void Dispose(bool disposing)
        {
            if (disposed == false)
            {
                if (disposing)
                {
                    DefaultContext.Dispose();
                }
            }
            disposed = true;
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }
    }
}