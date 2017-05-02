using App.DTO.Core;
using App.Models.Core;

namespace App.Models.App
{
    public class MessageDTO : HasIdNameDTO
    {
        /// <summary> Кто отправил </summary>
        public HasIdNameDTO OperatorFrom { get; set; }

        /// <summary> Кому отправил </summary>
        public HasIdNameDTO OperatorTo { get; set; }

        /// <summary> Текст сообщения </summary>
        public string Text { get; set; }
    }
}