using System.ComponentModel.DataAnnotations;

namespace App.DTO.Enums
{
    /// <summary> Перечисление Да/Нет </summary>
    public enum YesNoEnum
    {
        [Display(Name = "Нет")]
        No = 10,

        [Display(Name = "Да")]
        Yes = 20
    }
}