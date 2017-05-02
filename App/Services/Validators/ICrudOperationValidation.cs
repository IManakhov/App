using App.Models.Core;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace App.Services.Validators
{
    public interface ICrudOperationValidation<T> where T : PersistentEntity
    {
        void Create(T entity);
    }
}