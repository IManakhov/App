namespace App.Models.Core
{
    using System.ComponentModel.DataAnnotations;
    // Общие перечисления приложения

    /// <summary> Да или Нет </summary>
    public enum YesOrNo : int
    {
        [Display(Name = "Да")]
        Да = 20,

        [Display(Name = "Нет")]
        Нет = 10
    }

    /// <summary> Месяца </summary>
    public enum Month : int
    {
        [Display(Name = "Январь")]
        Январь = 1,

        [Display(Name = "Февраль")]
        Февраль = 2,

        [Display(Name = "Март")]
        Март = 3,

        [Display(Name = "Апрель")]
        Апрель = 4,

        [Display(Name = "Май")]
        Май = 5,

        [Display(Name = "Июнь")]
        Июнь = 6,

        [Display(Name = "Июль")]
        Июль = 7,

        [Display(Name = "Август")]
        Август = 8,

        [Display(Name = "Сентябрь")]
        Сентябрь = 9,

        [Display(Name = "Октябрь")]
        Октябрь = 10,

        [Display(Name = "Ноябрь")]
        Ноябрь = 11,

        [Display(Name = "Декабрь")]
        Декабрь = 12
    }
}