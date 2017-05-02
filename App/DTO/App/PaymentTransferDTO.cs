using App.DTO.Core;
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
    public class PaymentTransferDTO : HasIdDTO
    {
        /// <summary> Баланс </summary>
        public HasIdDTO PaymentFrom { get; set; }

        /// <summary> Баланс </summary>
        public HasIdDTO PaymentTo { get; set; }

        /// <summary> Кто перевел </summary>
        public HasIdNameDTO OperatorFrom { get; set; }

        /// <summary> Кому перевели </summary>
        public HasIdNameDTO OperatorTo { get; set; }

        /// <summary> Сумма перевода (с учетом коммисии)</summary>
        public decimal AmountFrom { get; set; }

        /// <summary> Сумма перевода (получателю) </summary>
        public decimal AmountTo { get; set; }

        /// <summary> Комиссия перевода </summary>
        public decimal Comission { get; set; }

        /// <summary> Текст к переводу </summary>
        public string Text { get; set; }

        /// <summary> Решение </summary>
        public PaymentTransferDecision Decision { get; set; }
    }
    
}