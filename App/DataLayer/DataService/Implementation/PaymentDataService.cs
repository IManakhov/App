namespace App.DataLayer.DataService.Implementation
{
    using System.Linq;
    using App.DataLayer.Filters;
    using App.DataLayer.Extension;
    using App.Models.App;
    using App.Services.Balance;
    using Ninject;

    public class PaymentDataService : BaseDataService<Payment,PaymentDTO>
    {
        [Inject]
        public BalanceOperationService BalanceOperationService { get; set; }

        /// <summary>
        /// Пополнить баланс пользователя
        /// </summary>
        public override long Create(PaymentDTO entity)
        {
            BalanceOperationService.AddMoneyToOwnAccount(entity.Amount);
            return 0;
        }

        public override DataListResult List(BaseParams baseParams)
        {
            StoreLoadParams storeParams = baseParams.GetStoreLoadParams();

            IQueryable<Payment> query = DataStore.GetAll<Payment>();

            var data = query
                .Where(x => x.OperatorToId == OperatorIndentity.Operator.Id)
            .Select(x => new
            {
                Id = x.Id,
                Date = x.ObjectCreateDate,
                From = x.OperatorFrom.Surname + " " + x.OperatorFrom.Name + " " + x.OperatorFrom.Patronymic,
                Type = x.Type,
                Amount = x.Amount,
                BalanceAmount = x.OperatorBalance.Amount,
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