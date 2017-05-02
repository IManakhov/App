using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Services.Message
{
    /// <summary>
    /// Сервси отправки писем
    /// </summary>
    public interface IMessageSender
    {
        /// <summary>
        /// Отправить новое собщение с новой перепиской
        /// </summary>
        Guid SendNewMail(long operatorFromId, long operatorToId,string name, string text);

        /// <summary>
        /// Отправить новое собщение
        /// </summary>
        void SendMail(Guid correspId, long operatorFromId, long operatorToId, string name, string text);
    }
}
