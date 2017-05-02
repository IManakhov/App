using App.Models.Core;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace App.Models.App
{
    /// <summary>
    /// Денежная оплата
    /// </summary>
    public class Payment : PersistentEntity
    {
        /// <summary> Баланс </summary>
        public virtual OperatorBalance OperatorBalance { get; set; }

        /// <summary> Id Баланс </summary>
        public long OperatorBalanceId { get; set; }

        /// <summary> Кто перевел </summary>
        public virtual Operator OperatorFrom { get; set; }

        /// <summary> Id Кто перевел </summary>
        public long OperatorFromId { get; set; }

        /// <summary> Кому перевели </summary>
        public virtual Operator OperatorTo { get; set; }

        /// <summary> Id Кому перевели </summary>
        public long OperatorToId { get; set; }

        /// <summary>
        /// Сумма перевода
        /// </summary>
        public decimal Amount { get; set; }

        /// <summary>
        /// Дата операции
        /// </summary>
        public DateTime Date { get; set; }

        /// <summary>
        /// Тип
        /// </summary>
        public PaymentType Type { get; set; }
    }

    public enum PaymentType
    {
        [Display(Name = "Пополнение счета")]
        ПополнениеСчета = 10,

        [Display(Name = "Перевод счета на счет")]
        ПереводСчетаНаСчет = 20
    }
}