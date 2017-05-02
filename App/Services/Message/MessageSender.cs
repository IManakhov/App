using App.DataLayer.Repository;
using App.Security;
using Ninject;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace App.Services.Message
{
    /// <summary>
    /// Отправка сообщения внутри системы
    /// </summary>
    public class MessageSender : IMessageSender
    {
        [Inject]
        public IDataStore DataStore { get; set; }

        [Inject]
        public IAuthentication Authentication { get; set; }

        public IOperatorIndentity OperatorIndentity => (IOperatorIndentity)Authentication.Principal.Identity;

        /// <summary>
        /// Отправить новое собщение с новой перепиской
        /// </summary>
        /// <param name="operatorFromId"></param>
        /// <param name="operatorToId"></param>
        /// <param name="text"></param>
        /// <returns></returns>
        public void SendMail(Guid correspId, long operatorFromId, long operatorToId, string name, string text)
        {
            var message = new App.Models.App.Message()
            {
                OperatorFromId = operatorFromId,
                OperatorToId = operatorToId,
                CorrespondenceId = correspId,
                Name = name,
                Text = text
            };
            DataStore.Create(message);
        }

        /// <summary>
        /// Отправить новое собщение с новой перепиской
        /// </summary>
        /// <param name="operatorFromId"></param>
        /// <param name="operatorToId"></param>
        /// <param name="text"></param>
        /// <returns></returns>
        public Guid SendNewMail(long operatorFromId, long operatorToId, string name, string text)
        {
            Guid newCorrespId = Guid.NewGuid();
            SendMail(newCorrespId, operatorFromId, operatorToId, name, text);
            return newCorrespId;
        }
    }
}