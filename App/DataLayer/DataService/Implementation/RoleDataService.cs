namespace App.DataLayer.DataService.Implementation
{
    using System.Linq;
    using App.DataLayer.Filters;
    using App.DTO.Core;
    using App.DataLayer.Extension;
    using App.Models.Core;

    public class RoleDataService : BaseDataService<Role,RoleDTO>
    {        
        public override long Create(RoleDTO entity)
        {
            Role model = new Role
            {
                Name = entity.Name,
            };
            DataStore.Create(model);
            return model.Id;
        }
        
        public override object Get(long id)
        {
            RoleDTO entity = DataStore.GetAll<Role>()
                .Where(x => x.Id == id)
                .Select(x => new RoleDTO
                {
                    Id = x.Id,
                    Name = x.Name
                })
                .Single();
            return entity;
        }

        public override DataListResult List(BaseParams baseParams)
        {
            StoreLoadParams storeParams = baseParams.GetStoreLoadParams();

            IQueryable<Role> query = DataStore.GetAll<Role>();

            var data = query.Select(x => new
            {
                Id = x.Id,
                Name = x.Name,
            })
            .FilterByProperty(storeParams);
            int count = data.Count();

            return new DataListResult()
            {
                totalCount = count,
                data = data.Order(storeParams).Paging(storeParams).ToArray()
            };
        }

        public override void Update(RoleDTO entity)
        {
            Role model = DataStore.GetAll<Role>().Single(x => x.Id == entity.Id);
            model.Name = entity.Name;
            DataStore.Update(model);
        }
    }
}