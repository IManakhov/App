using App.Models.Core;

namespace App.Models.App
{
    /// <summary>
    /// Избранные пользователи
    /// </summary>
    public class FavoriteOperator : PersistentEntity
    {
        /// <summary> Кто избранный </summary>
        public virtual Operator OperatorFrom { get; set; }

        /// <summary> Id Кто избранный </summary>
        public long OperatorFromId { get; set; }

        /// <summary> Кому избранный </summary>
        public virtual Operator OperatorTo { get; set; }

        /// <summary> Id Кому избранный </summary>
        public long OperatorToId { get; set; }
    }
}