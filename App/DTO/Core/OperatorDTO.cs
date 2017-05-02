namespace App.DTO.Core
{
    using Enums;
    using Models.Core;
    using System;
    using System.Web;

    /// <summary> Оператор DTO </summary>
    public class OperatorDTO : HasIdNameDTO
    {
        public long UserId { get; set; }

        /// <summary>  Логин </summary>
        public string Login { get; set; }

        /// <summary>  Пароль </summary>
        public string Password { get; set; }

        /// <summary> E-mail </summary>
        public string Email { get; set; }

        /// <summary> Телефон </summary>
        public string Phone { get; set; }

        /// <summary>  Фамилия </summary>
        public string Surname { get; set; }

        /// <summary>  Отчество </summary>
        public string Patronymic { get; set; }

        /// <summary> Роли </summary>
        public HasIdNameDTO[] Roles { get; set; }

        /// <summary> Роли строкой </summary>
        public string RolesStr { get; set; }
       
        public int IsLastVersion { get; set; }

        /// <summary> Статус Пользователь </summary>
        public OperatorStatus Status { get; set; }
    }
}