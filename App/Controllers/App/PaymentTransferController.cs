namespace App.Controllers.Core
{
    using App.DTO.Core;
    using App.Models.Core;
    using System.Linq;
    using System.Web.Mvc;
    using App.DataLayer.Extension;
    using DataLayer.DataService.Implementation;
    using System.Collections.Generic;
    using System;
    using App.Models.App;
    using App.DataLayer.Filters;
    using App.Services.Payment;
    using Ninject;

    public class PaymentTransferController : BaseCrudViewController<PaymentTransfer, PaymentTransferDTO>
    {
        [Inject]
        public PaymentTransferOperationService PaymentTransferOperService { get; set; }

        /// <summary> Принятие перевода денег </summary>
        public ActionResult AcceptTransfer(long transferId)
        {
            try
            {
                PaymentTransferOperService.AcceptTransfer(transferId);
                return JsonNetResult.Success;
            }
            catch (Exception e)
            {
                return JsonNetResult.Failure(e.Message);
            }
        }

        /// <summary> Принятие перевода денег </summary>
        public ActionResult DeclineTransfer(long transferId)
        {
            try
            {
                PaymentTransferOperService.DeclineTransfer(transferId);
                return JsonNetResult.Success;
            }
            catch (Exception e)
            {
                return JsonNetResult.Failure(e.Message);
            }
        }

        /// <summary> Отмена перевода денег </summary>
        public ActionResult RollbackTransfer(long transferId)
        {
            try
            {
                PaymentTransferOperService.RollbackTransfer(transferId);
                return JsonNetResult.Success;
            }
            catch (Exception e)
            {
                return JsonNetResult.Failure(e.Message);
            }
        }

        /// <summary> Получить значения по умолчанию </summary>
        public ActionResult GetDefaultValues(BaseParams baseParams)
        {
            var now = DateTime.Now;
            var currentOperator = OperatorIndentity.Operator;
            object data = new
            {
                OperatorFrom = new HasIdNameDTO { Id = currentOperator.Id, Name = currentOperator.Name },
                Date = DateTime.Now.Date
            };
            return new JsonNetResult(data);
        }
    }
}