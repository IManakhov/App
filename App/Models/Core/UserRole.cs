namespace App.Models.Core
{
    /// <summary> Роль пользователя </summary>
    public class UserRole : PersistentEntity
    {
        /// <summary> Пользователь </summary>
        public virtual User User { get; set; }

        /// <summary> Id пользователя </summary>
        public long UserId { get; set; }

        /// <summary> Роль </summary>
        public virtual Role Role { get; set; }

        /// <summary> Id роли </summary>
        public long RoleId { get; set; }
    }
}