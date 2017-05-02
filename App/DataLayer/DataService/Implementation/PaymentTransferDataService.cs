namespace App.DataLayer.DataService.Implementation
{
    using System.Linq;
    using App.DataLayer.Filters;
    using App.DataLayer.Extension;
    using App.Models.App;
    using App.Services.Balance;
    using Ninject;
    using AutoMapper;
    using App.Services.Payment;

    public class PaymentTransferDataService : BaseDataService<PaymentTransfer,PaymentTransferDTO>
    {
        [Inject]
        public BalanceOperationService BalanceOperationService { get; set; }

        [Inject]
        public PaymentTransferOperationService PaymentTransferOperService { get; set; }

        public override long Create(PaymentTransferDTO model)
        {
            var result = PaymentTransferOperService.CreateNewTransfer(model);
            return result;
        }
        public override DataListResult List(BaseParams baseParams)
        {
            StoreLoadParams storeParams = baseParams.GetStoreLoadParams();

            IQueryable<PaymentTransfer> query = DataStore.GetAll<PaymentTransfer>();
            var currentOperatorId = OperatorIndentity.Operator.Id;
            var data = query
                .Where(x => x.OperatorToId == OperatorIndentity.Operator.Id || x.OperatorFromId == OperatorIndentity.Operator.Id)
            .Select(x => new
            {
                Id = x.Id,
                Date = x.ObjectCreateDate,
                OperatorFrom = x.OperatorFrom.Surname + " " + x.OperatorFrom.Name + " " + x.OperatorFrom.Patronymic,
                OperatorTo = x.OperatorTo.Surname + " " + x.OperatorTo.Name + " " + x.OperatorTo.Patronymic,
                Amount = x.AmountFrom,
                IsMyTransaction = x.OperatorFromId == currentOperatorId,
                CanEdit = x.Decision == PaymentTransferDecision.Отсутствует,
                Decision = x.Decision
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