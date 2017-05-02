namespace App.DataLayer.DataService.Implementation
{
    using System.Linq;
    using App.DataLayer.Filters;
    using App.DTO.Core;
    using App.DataLayer.Extension;
    using App.Models.Core;
    using App.Models.App;

    public class MessageDataService : BaseDataService<Message,MessageDTO>
    {        
        public override long Create(MessageDTO entity)
        {
            Message model = new Message
            {
                Name = entity.Name,
                OperatorFromId = OperatorIndentity.Operator.Id,
                OperatorToId = entity.OperatorTo.Id,
                Text = entity.Text
            };
            DataStore.Create(model);
            return model.Id;
        }
        
        public override object Get(long id)
        {
            var entity = DataStore.GetAll<Message>()
                .Where(x => x.Id == id)
                .Select(x => new
                {
                    Id = x.Id,
                    Date = x.ObjectCreateDate,
                    OperatorTo = new HasIdNameDTO() { Id = x.OperatorTo.Id, Name = x.OperatorTo.Name },
                    OperatorFrom = new HasIdNameDTO() { Id = x.OperatorFrom.Id, Name = x.OperatorFrom.Name },
                    Name = x.Name,
                    Text = x.Text
                })
                .Single();
            return entity;
        }

        public override DataListResult List(BaseParams baseParams)
        {
            StoreLoadParams storeParams = baseParams.GetStoreLoadParams();

            IQueryable<Message> query = DataStore.GetAll<Message>();

            var data = query
                .Where(x => x.OperatorToId == OperatorIndentity.Operator.Id)
            .Select(x => new
            {
                Id = x.Id,
                Date = x.ObjectCreateDate,
                OperatorFrom = x.OperatorFrom.Surname + " " + x.OperatorFrom.Name + " " + x.OperatorFrom.Patronymic,
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
    }
}