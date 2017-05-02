namespace App.DataLayer.DataService.Implementation
{
    using System;
    using System.Linq;
    using App.DataLayer.Filters;
    using App.DTO.Core;
    using App.Models.Core;
    using Ninject;
    using App.DataLayer.Repository;
    using App.DataLayer.Extension;
    using Security;
    using AutoMapper;

    /// <summary> Базовая реализация интерфейса IDataService </summary>
    public class BaseDataService<T, TK> : IDataService<T, TK> where T : PersistentEntity where TK : HasIdDTO
    {
        [Inject]
        public IDataStore DataStore { get; set; }
        [Inject]
        public IAuthentication Authentication { get; set; }

        public IOperatorIndentity OperatorIndentity => (IOperatorIndentity)Authentication.Principal.Identity;

        public virtual long Create(TK entity)
        {
            T entityClass = Mapper.Map<T>(entity);
            DataStore.Create<T>(entityClass);
            return entityClass.Id;
        }

        public virtual void Delete(long id)
        {
            DataStore.Delete<T>(id);
        }

        public virtual object Get(long id)
        {
            return DataStore.Get<T>(id);
        }

        public virtual DataListResult List(BaseParams baseParams)
        {
            StoreLoadParams storeParams = baseParams.GetStoreLoadParams();

            var data = DataStore.GetAll<T>()
                .FilterByProperty(storeParams);
            int count = data.Count();

            return new DataListResult()
            {
                totalCount = count,
                data = data.Order(storeParams).Paging(storeParams).ToList()
            };
        }

        public virtual object TreeList(BaseParams baseParams)
        {
            throw new NotImplementedException();
        }

        public virtual void Update(TK entity)
        {
            T entityClass = Mapper.Map<T>(entity);
            DataStore.Update(entityClass);
        }

        protected IQueryable<T> GetAll()
        {
            return DataStore.GetAll<T>();
        }
    }
}