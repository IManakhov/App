using System;
using App.DataLayer.Repository;
using App.DTO.Services;
using App.Models.App;
using App.Security;
using App.Services.Balance;
using App.Services.Message;
using AutoMapper;
using Ninject;

namespace App.Services.Payment
{
    /// <summary>
    /// Сервис работы с переводами денег
    /// </summary>
    public class PaymentTransferOperationService
    {
        [Inject]
        public IDataStore DataStore { get; set; }

        [Inject]
        public IAuthentication Authentication { get; set; }

        public IOperatorIndentity OperatorIndentity => (IOperatorIndentity)Authentication.Principal.Identity;

        [Inject]
        public BalanceOperationService BalanceOperService { get;set;}

        [Inject]
        public IMessageSender MessageSender { get; set; }

        /// <summary>
        /// Создание нового перевода
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        public long CreateNewTransfer(PaymentTransferDTO model)
        {
            PaymentTransfer entity = Mapper.Map<PaymentTransfer>(model);

            var reciverBalance = BalanceOperService.GetCurrentBalance(model.OperatorFrom.Id);
            if (reciverBalance - model.AmountFrom < 0)
                throw new Exception($"Нельзя перевести больше чем есть на счету. Доступно: {reciverBalance}");

            // блокируем(списываем деньги со счета)
            var param = new BalanceOperationMoneyChangeDTO()
            {
                Amount = -model.AmountFrom,
                Type = PaymentType.ПереводСчетаНаСчет,
                BalanceOwnerOperatorId = model.OperatorFrom.Id,
                AcceptOperatorId = model.OperatorTo.Id,
                ReciveOperatorId = model.OperatorFrom.Id
            };
            var paymentFromId = BalanceOperService.ChangeMoneyToOwnAccount(param);
            // отправляем уведомление
            var correspId = MessageSender.SendNewMail(model.OperatorFrom.Id, model.OperatorTo.Id,
                "Перевод денег",
                $"Вам переводят деньги на сумму {param.Amount} пользователь - {model.OperatorFrom.Name}");
            // отправляем текст от отправителя
            MessageSender.SendMail(correspId, model.OperatorFrom.Id, model.OperatorTo.Id,
                $"Сообщение к переводу денег от {model.OperatorFrom.Name}",
                model.Text);
            entity.CorrespondenceId = correspId;
            entity.PaymentFromId = paymentFromId;
            DataStore.Create<PaymentTransfer>(entity);
            return entity.Id;
        }

        /// <summary>
        /// Отменить перевод
        /// </summary>
        /// <param name="transferId"></param>
        public void RollbackTransfer(long transferId)
        {
            var entity = DataStore.Get<PaymentTransfer>(transferId);
            // разблокируем(возвращаем деньги на счет) отправителя
            var param = new BalanceOperationMoneyChangeDTO()
            {
                Amount = entity.AmountFrom,
                Type = PaymentType.ПереводСчетаНаСчет,
                BalanceOwnerOperatorId = entity.OperatorFrom.Id,
                AcceptOperatorId = entity.OperatorTo.Id,
                ReciveOperatorId = entity.OperatorFrom.Id
            };
            var paymentFromId = BalanceOperService.ChangeMoneyToOwnAccount(param);
            MessageSender.SendNewMail(entity.OperatorFrom.Id, entity.OperatorTo.Id,
                "Перевод денег",
                $"Перевод ID = {entity.Id} на сумму {param.Amount} ОТМЕНЕН пользователем - {entity.OperatorFrom.GetSurnameAndName()}");

            entity.Decision = PaymentTransferDecision.ОтменилОтправитель;
            DataStore.Update(entity);
        }

        /// <summary>
        /// Отказ от получения перевода
        /// </summary>
        /// <param name="transferId"></param>
        public void DeclineTransfer(long transferId)
        {
            var entity = DataStore.Get<PaymentTransfer>(transferId);
            // разблокируем(возвращаем деньги на счет) отправителя
            var param = new BalanceOperationMoneyChangeDTO()
            {
                Amount = entity.AmountFrom,
                Type = PaymentType.ПереводСчетаНаСчет,
                BalanceOwnerOperatorId = entity.OperatorFrom.Id,
                AcceptOperatorId = entity.OperatorTo.Id,
                ReciveOperatorId = entity.OperatorFrom.Id
            };
            var paymentFromId = BalanceOperService.ChangeMoneyToOwnAccount(param);
            MessageSender.SendNewMail(entity.OperatorTo.Id, entity.OperatorFrom.Id,
                "Перевод денег",
                $"Перевод ID = {entity.Id} на сумму {param.Amount} ОТКЛОНЕН ПОЛУЧАТЕЛЕМ - {entity.OperatorTo.GetSurnameAndName()}");

            entity.Decision = PaymentTransferDecision.ОтменилПолучатель;
            DataStore.Update(entity);
        }

        /// <summary>
        /// Принятие получения перевода
        /// </summary>
        /// <param name="transferId"></param>
        public void AcceptTransfer(long transferId)
        {
            var entity = DataStore.Get<PaymentTransfer>(transferId);
            // переводим деньги получателю
            var param = new BalanceOperationMoneyChangeDTO()
            {
                Amount = entity.AmountTo,
                Type = PaymentType.ПереводСчетаНаСчет,
                BalanceOwnerOperatorId = entity.OperatorTo.Id,
                AcceptOperatorId = entity.OperatorTo.Id,
                ReciveOperatorId = entity.OperatorFrom.Id
            };
            var paymentFromId = BalanceOperService.ChangeMoneyToOwnAccount(param);
            MessageSender.SendNewMail(entity.OperatorTo.Id, entity.OperatorFrom.Id,
                "Перевод денег",
                $"Перевод ID = {entity.Id} на сумму {param.Amount} ПРИНЯТ ПОЛУЧАТЕЛЕМ - {entity.OperatorTo.GetSurnameAndName()}");

            entity.Decision = PaymentTransferDecision.ПолучилПолучатель;
            DataStore.Update(entity);
        }
    }
}