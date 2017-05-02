using App.Models.App;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace App.DTO.Services
{
    /// <summary>
    /// Класс для аргументов смены значения баланса
    /// </summary>
    public class BalanceOperationMoneyChangeDTO
    {
        /// <summary>
        /// Сумма
        /// </summary>
        public decimal Amount { get; set; }

        /// <summary>
        /// Тип изменения баланса/оплаты
        /// </summary>
        public PaymentType Type { get; set; }
        /// <summary>
        ///  У кого меняем баланс
        /// </summary>
        public long BalanceOwnerOperatorId { get; set; }
        /// <summary>
        ///  Кому пришло
        /// </summary>
        public long AcceptOperatorId { get; set; }
        /// <summary>
        ///  От кого пришло
        /// </summary>
        public long ReciveOperatorId { get; set; }
    }
}