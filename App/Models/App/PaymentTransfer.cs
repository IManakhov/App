using App.Models.Core;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace App.Models.App
{
    /// <summary>
    /// Операция по переводу денег
    /// </summary>
    public class PaymentTransfer : PersistentEntity
    {
        /// <summary> Баланс </summary>
        public virtual Payment PaymentFrom { get; set; }

        /// <summary> Id Баланс </summary>
        public long? PaymentFromId { get; set; }

        /// <summary> Баланс </summary>
        public virtual Payment PaymentTo { get; set; }

        /// <summary> Id Баланс </summary>
        public long? PaymentToId { get; set; }

        /// <summary> Кто перевел </summary>
        public virtual Operator OperatorFrom { get; set; }

        /// <summary> Id Кто перевел </summary>
        public long OperatorFromId { get; set; }

        /// <summary> Кому перевели </summary>
        public virtual Operator OperatorTo { get; set; }

        /// <summary> Id Кому перевели </summary>
        public long OperatorToId { get; set; }

        /// <summary> Сумма перевода (с учетом коммисии)</summary>
        public decimal AmountFrom { get; set; }

        /// <summary> Сумма перевода (получателю) </summary>
        public decimal AmountTo { get; set; }

        /// <summary> Комиссия перевода </summary>
        public decimal Comission { get; set; }

        /// <summary> Решение </summary>
        public PaymentTransferDecision Decision { get; set; }

        /// <summary> Id переписки </summary>
        public Guid CorrespondenceId { get; set; }
    }

    public enum PaymentTransferDecision
    {
        [Display(Name = "Отсутствует")]
        Отсутствует = 0,

        [Display(Name = "Отменил отправитель")]
        ОтменилОтправитель = 10,
        
        [Display(Name = "Отменил получатель")]
        ОтменилПолучатель = 20,

        [Display(Name = "Получил получатель")]
        ПолучилПолучатель = 30
    }
}