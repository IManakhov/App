using App.Models.Core;
using System;

namespace App.Models.App
{
    /// <summary>
    /// Баланс пользователя
    /// </summary>
    public class OperatorBalance : PersistentEntity
    {
        /// <summary> Пользователь </summary>
        public virtual Operator Operator { get; set; }

        /// <summary> Id пользователя </summary>
        public long OperatorId { get; set; }

        /// <summary>
        /// Текущий баланс
        /// </summary>
        public bool IsCurrent { get; set; }

        /// <summary>
        /// Сумма
        /// </summary>
        public decimal Amount {get;set;}

        /// <summary>
        /// Действует с
        /// </summary>
        public DateTime DateFrom { get; set; }

        /// <summary>
        /// Действует по
        /// </summary>
        public DateTime? DateTo { get; set; }
    }
}