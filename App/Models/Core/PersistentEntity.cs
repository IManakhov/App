namespace App.Models.Core
{
    using System;
    using Newtonsoft.Json;

    /// <summary> Базовая сущность (Id, ObjectCreateDate, ObjectEditDate, Version, IsDeleted) </summary>
    public abstract class PersistentEntity
    {
        /// <summary> Идентификатор </summary>
        public long Id { get; set; }

        /// <summary> Дата создания </summary>
        public DateTime ObjectCreateDate { get; set; }

        /// <summary> Дата изменения </summary>
        public DateTime ObjectEditDate { get; set; }

        /// <summary> Версия </summary>
        public int Version { get; set; }

        /// <summary> Удалено? (1 - удалено, 0 - не удалено) </summary>
        public int IsDeleted { get; set; }
    }
}