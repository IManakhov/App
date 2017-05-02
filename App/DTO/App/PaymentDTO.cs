using App.DTO.Core;
using App.Models.Core;
using System;

namespace App.Models.App
{
    /// <summary>
    /// Денежная оплата
    /// </summary>
    public class PaymentDTO : HasIdDTO
    {
        /// <summary> Кто перевел </summary>
        public virtual Operator OperatorFrom { get; set; }

        /// <summary> Кому перевели </summary>
        public virtual Operator OperatorTo { get; set; }
        
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
}