namespace App.Models.Core
{
    /// <summary> Пользователь </summary>
    public class User : PersistentEntity
    {
        /// <summary> Логин </summary>
        public string Login { get; set; }

        /// <summary> Пароль </summary>
        public string Password { get; set; }
    }
}