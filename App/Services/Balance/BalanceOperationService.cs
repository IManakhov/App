using App.DataLayer.Repository;
using App.DTO.Services;
using App.Models.App;
using App.Models.Core;
using App.Security;
using App.Services.Message;
using Ninject;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace App.Services.Balance
{
    /// <summary>
    /// Сервис работы с балансом пользователя
    /// </summary>
    public class BalanceOperationService
    {
        [Inject]
        public IDataStore DataStore { get; set; }

        [Inject]
        public IAuthentication Authentication { get; set; }

        public IOperatorIndentity OperatorIndentity => (IOperatorIndentity)Authentication.Principal.Identity;

        [Inject]
        public IMessageSender MessageSender { get; set; }

        /// <summary>
        /// Метод пополнения счета пользователя
        /// </summary>
        /// <param name="amount"></param>
        public void AddMoneyToOwnAccount(decimal amount)
        {
            var now = DateTime.Now;
            var currentOperator = OperatorIndentity.Operator;
            var param = new BalanceOperationMoneyChangeDTO()
            {
                Amount = amount,
                Type = PaymentType.ПополнениеСчета,
                BalanceOwnerOperatorId = currentOperator.Id,
                AcceptOperatorId = currentOperator.Id,
                ReciveOperatorId = currentOperator.Id
            };
            ChangeMoneyToOwnAccount(param);
        }

        /// <summary>
        /// Метод пополнения счета пользователя
        /// </summary>
        public long ChangeMoneyToOwnAccount(BalanceOperationMoneyChangeDTO moneyChange)
        {
            var now = DateTime.Now;

            // обновляем баланс пользователя
            var lastBalance = DataStore.GetAll<OperatorBalance>()
                .Where(x => x.IsCurrent && x.OperatorId == moneyChange.BalanceOwnerOperatorId)
                .FirstOrDefault();

            var previousAmount = decimal.Zero;

            if (lastBalance != null)
            {
                lastBalance.DateTo = now;
                lastBalance.IsCurrent = false;
                previousAmount = lastBalance.Amount;
                DataStore.Update(lastBalance);
            }

            var currentBalance = new OperatorBalance()
            {
                OperatorId = moneyChange.BalanceOwnerOperatorId,
                Amount = previousAmount + moneyChange.Amount,
                IsCurrent = true,
                DateFrom = now
            };
            DataStore.Create(currentBalance);
            

            // создаем запись платежа
            var payment = new Models.App.Payment()
            {
                OperatorFromId = moneyChange.ReciveOperatorId,
                OperatorToId = moneyChange.AcceptOperatorId,
                Type = moneyChange.Type,
                Amount = moneyChange.Amount,
                Date = now,
                OperatorBalanceId = currentBalance.Id
            };
            DataStore.Create(payment);

            MessageSender.SendNewMail(moneyChange.BalanceOwnerOperatorId, moneyChange.BalanceOwnerOperatorId,
                "Изменение баланса",
                $"Баланс изменен на сумму {moneyChange.Amount}, текущий баланс состовляет {currentBalance.Amount}");

            return payment.Id;
        }

        public decimal GetCurrentBalance(long operatorId)
        {
            var lastBalance = DataStore.GetAll<OperatorBalance>()
                .Where(x => x.IsCurrent && x.OperatorId == operatorId)
                .FirstOrDefault();

            if (lastBalance != null)
                return lastBalance.Amount;
            return 0;
        }
    }
}