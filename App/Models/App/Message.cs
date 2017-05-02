using App.Models.Core;
using System;

namespace App.Models.App
{
    /// <summary>
    /// Сообщения
    /// </summary>
    public class Message : BaseEntity
    {
        /// <summary> Кто перевел </summary>
        public virtual Operator OperatorFrom { get; set; }

        /// <summary> Id Кто перевел </summary>
        public long OperatorFromId { get; set; }

        /// <summary> Кому перевели </summary>
        public virtual Operator OperatorTo { get; set; }

        /// <summary> Id Кому перевели </summary>
        public long OperatorToId { get; set; }

        /// <summary> Текст сообщения </summary>
        public string Text { get; set; }

        /// <summary> Id переписки </summary>
        public Guid CorrespondenceId { get; set; }
    }
}