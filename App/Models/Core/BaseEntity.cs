namespace App.Models.Core
{
    /// <summary> Базовая сущность (Id, Name, ObjectCreateDate, ObjectEditDate, Version, IsDeleted) </summary>
    public abstract class BaseEntity : PersistentEntity
    {
        /// <summary> Наименование </summary>
        public string Name { get; set; }
    }
}