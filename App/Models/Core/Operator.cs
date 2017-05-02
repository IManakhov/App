namespace App.Models.Core
{
    using DTO.Enums;
    using System;
    using System.ComponentModel.DataAnnotations;

    /// <summary> Оператор </summary>
    public class Operator : BaseEntity
    {
        /// <summary> Фамилия </summary>
        public string Surname { get; set; }

        /// <summary> Отчество </summary>
        public string Patronymic { get; set; }

        /// <summary> E-mail </summary>
        public string Email { get; set; }

        /// <summary> Телефон </summary>
        public string Phone { get; set; }
        
        /// <summary> Пользователь </summary>
        public virtual User User { get; set; }

        /// <summary> Id Пользователь </summary>
        public long UserId { get; set; }

        public int IsLastVersion { get; set; }

        /// <summary> Статус Пользователь </summary>
        public OperatorStatus Status { get; set; }
        
        /// <summary> Получить Фамилию и Имя оператора </summary>
        public string GetSurnameAndName()
        {
            return Surname + " " + Name;
        }
    }

    /// <summary> Статус Пользователь </summary>
    public enum OperatorStatus
    {
        [Display(Name = "Активный")]
        Активный = 10,

        [Display(Name = "Удален")]
        Удалился = 20
    }
}