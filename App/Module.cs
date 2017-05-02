namespace App
{
    using App.Security;
    using App.DataLayer.DataService;
    using App.DataLayer.DataService.Implementation;
    using App.DTO.Core;
    using App.Models.Core;
    using App.DataLayer.Repository;
    using App.Map.AutoMapperMap;
    using Ninject.Modules;
    using Ninject.Web.Common;
    using AutoMapper;
    using App.Services.Balance;
    using App.Models.App;
    using App.Services.Payment;
    using App.Services.Message;

    public class Module : NinjectModule
    {
        public override void Load()
        {
            Bind(typeof(DefaultContext)).To(typeof(DefaultContext)).InRequestScope();
            Bind(typeof(IDataStore)).To(typeof(DataStore)).InRequestScope();
            Bind(typeof(IAuthentication)).To(typeof(CustomAuthentication)).InRequestScope();

            //DataServices
            Bind(typeof(IDataService<Role, RoleDTO>)).To(typeof(RoleDataService)).InRequestScope();
            Bind(typeof(IDataService<Operator, OperatorDTO>)).To(typeof(OperatorDataService)).InRequestScope();
            Bind(typeof(IDataService<Payment, PaymentDTO>)).To(typeof(PaymentDataService)).InRequestScope();
            Bind(typeof(IDataService<PaymentTransfer, PaymentTransferDTO>)).To(typeof(PaymentTransferDataService)).InRequestScope();
            Bind(typeof(IDataService<Message, MessageDTO>)).To(typeof(MessageDataService)).InRequestScope();

            // Other Services
            Bind(typeof(BalanceOperationService)).To(typeof(BalanceOperationService)).InRequestScope();
            Bind(typeof(PaymentTransferOperationService)).To(typeof(PaymentTransferOperationService)).InRequestScope();
            Bind(typeof(IMessageSender)).To(typeof(MessageSender)).InRequestScope();
           
            //Entity to DTO and DTO to Entity Binding (AutoMapper)
            Mapper.Initialize(config => { config.AddProfile<CustomProfile>(); });
            Mapper.AssertConfigurationIsValid();
            Bind<IMapper>().ToConstant(Mapper.Configuration.CreateMapper());

        }
    }
}