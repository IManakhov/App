namespace App.DataLayer.DataService.Implementation
{
    using System;
    using System.Linq;
    using App.DataLayer.Filters;
    using App.DTO.Core;
    using App.DataLayer.Extension;
    using App.Models.Core;
    using System.Collections.Generic;
    using App.Models.App;

    public class OperatorDataService : BaseDataService<Operator, OperatorDTO>
    {
        public override long Create(OperatorDTO entity)
        {
            //if (entity.UserId != 0 && CommonExtension.IsPasswordValid(entity.Password) == false)
            //{
            //    throw new Exception("Неправильный логин или пароль");
            //}

            long withSameLoginUserId = DataStore.GetAll<User>().Where(x => x.Login == entity.Login).Select(x => x.Id).FirstOrDefault();
            if (entity.UserId == 0 && withSameLoginUserId > 0L)
            {
                throw new Exception("Данный логин уже занят.");
            }

            DateTime now = DateTime.Now;
            Operator oper = new Operator()
            {
                Name = entity.Name,
                Surname = entity.Surname,
                Patronymic = entity.Patronymic,
                
                Email = entity.Email,
                Phone = entity.Phone,
                Status = entity.Status,
                IsLastVersion = 1,
            };

            User user = DataStore.GetAll<User>().FirstOrDefault(x => x.Login == entity.Login);

            if (user == null)
            {
                user = new User
                {
                    Login = entity.Login,
                    Password = CommonExtension.EncryptPassword(entity.Password)
                };

                DataStore.Create(user);

                // если нет роли то ставим роль по умолчанию Пользователь
                // это нужно в основном при регистрации
                if (entity.Roles == null || entity.Roles.Length == 0)
                {
                    var currentRole = DataStore.GetAll<Role>()
                        .FirstOrDefault(x => x.Name.ToUpper() == "ПОЛЬЗОВАТЕЛЬ");
                    if (currentRole != null)
                    {
                        UserRole operatorRole = new UserRole()
                        {
                            UserId = user.Id,
                            RoleId = currentRole.Id
                        };
                        DataStore.Create(operatorRole);
                    }
                }
                else
                {
                    //Сохранить роли пользователя
                    foreach (HasIdNameDTO roleItem in entity.Roles)
                    {
                        UserRole operatorRole = new UserRole()
                        {
                            UserId = user.Id,
                            RoleId = roleItem.Id
                        };
                        DataStore.Create(operatorRole);
                    }
                }
            }

            oper.UserId = user.Id;
            DataStore.Create(oper);

            return oper.Id;
        }

        public override object Get(long id)
        {
            OperatorDTO oper = DataStore.GetAll<Operator>().Where(x => x.Id == id).Select(x => new OperatorDTO()
            {
                Id = x.Id,
                Login = x.User.Login,
                Email = x.Email,
                Phone = x.Phone,
                Name = x.Name,
                Surname = x.Surname,
                Patronymic = x.Patronymic,
                UserId = x.UserId,
                Status = x.Status,
            })
            .Single();
            oper.Roles = DataStore.GetAll<UserRole>().Where(x => x.UserId == oper.UserId).Select(x => new HasIdNameDTO() { Id = x.Role.Id, Name = x.Role.Name }).ToArray();
           
            return oper;
        }

        /// <summary>
        /// Получить текущего оператора
        /// </summary>
        /// <returns></returns>
        public object GetCurrent()
        {
            var currentOperatorId = OperatorIndentity.Operator.Id;
            return Get(currentOperatorId);
        }

        public override DataListResult List(BaseParams baseParams)
        {
            StoreLoadParams storeParams = baseParams.GetStoreLoadParams();
            
            IQueryable<Operator> query = DataStore.GetAll<Operator>()
                .Where(x => x.IsLastVersion == 1);
            if (baseParams.Params.ContainsKey("Status"))
            {
                int statusValue = Convert.ToInt32(baseParams.Params["Status"]);
                query = query.Where(x => x.Status == (OperatorStatus)statusValue);
            }

            var favoriteQuery = DataStore.GetAll<FavoriteOperator>()
                .Where(x => x.OperatorToId == OperatorIndentity.Operator.Id);

            var data = query.Select(x => new 
            {
                Id = x.Id,
                FIO = x.Surname + " " + x.Name +" " + x.Patronymic,
                Name = x.Surname + " " + x.Name + " " + x.Patronymic,
                Login = x.User.Login,
                Status = x.Status,
                IsFavorite = favoriteQuery.Any(y => y.OperatorFromId == x.Id)
            })
            .FilterByProperty(storeParams);
            int count = data.Count();
            var result = data.Order(storeParams).Paging(storeParams).ToList();

            return new DataListResult()
            {
                totalCount = count,
                data = result
            };
        }

        public DataListResult BalanceHistory(BaseParams baseParams)
        {
            StoreLoadParams storeParams = baseParams.GetStoreLoadParams();

            var currentOperatorId = OperatorIndentity.Operator.Id;
            var query = DataStore.GetAll<OperatorBalance>()
                .Where(x => x.OperatorId == currentOperatorId);
            var data = query.Select(x => new
                {
                    Id = x.Id,
                    DateFrom = x.DateFrom,
                    DateTo = x.DateTo,
                    Amount = x.Amount
                })
            .FilterByProperty(storeParams);

            int count = data.Count();
            var result = data.Order(storeParams).Paging(storeParams).ToList();

            return new DataListResult()
            {
                totalCount = count,
                data = result
            };
        }

        public override void Update(OperatorDTO entity)
        {
            if (entity == null/* || entity.Login == "admin"*/)
            {
                throw new ArgumentNullException(nameof(entity), "Ошибка обновления сотрудника");
            }

            DateTime now = DateTime.Now;
            Operator oper = DataStore.GetAll<Operator>().Single(x => x.Id == entity.Id);
            User user = DataStore.Get<User>(oper.UserId);

            long withSameLoginUserId = DataStore.GetAll<User>()
                .Where(x => x.Id != user.Id && x.Login == entity.Login)
                .Select(x => x.Id)
                .FirstOrDefault();
            if (withSameLoginUserId > 0L)
            {
                throw new Exception("Данный логин уже занят.");
            }

            oper.ObjectEditDate = now;
            oper.Version++;
            oper.Name = entity.Name;
            oper.Patronymic = entity.Patronymic;
            oper.Surname = entity.Surname;
            oper.Email = entity.Email;
            oper.Phone = entity.Phone;
            oper.Status = entity.Status;

            user.Login = entity.Login;
            if (CommonExtension.IsPasswordValid(entity.Password))
            {
                user.Password = CommonExtension.EncryptPassword(entity.Password);
            }

            #region работа с OperatorRole

            //Получить текущие OperatorRole
            List<UserRole> currentOperatorRoles = DataStore.GetAll<UserRole>()
                .Where(x => x.UserId == oper.UserId)
                .ToList();
            //Получить текущие Role
            List<long> currentRoles = currentOperatorRoles.Select(x => x.RoleId).ToList();
            //Удалить OperatorRole
            long[] roleIds = entity.Roles.Select(y => y.Id).ToArray();
            foreach (long item in currentOperatorRoles.Where(x => roleIds.Contains(x.RoleId) == false)
                .Select(x => x.Id))
            {
                DataStore.Delete<UserRole>(item);
            }

            //Создать новые OperatorRole
            List<HasIdNameDTO> rolesForAdd = entity.Roles.Where(x => currentRoles.Contains(x.Id) == false)
                .Select(x => x)
                .ToList();
            foreach (HasIdNameDTO roleItem in rolesForAdd)
            {
                UserRole operatorRole = new UserRole()
                {
                    ObjectCreateDate = now,
                    ObjectEditDate = now,
                    Version = 1,
                    UserId = oper.UserId,
                    RoleId = roleItem.Id
                };
                DataStore.Create(operatorRole);
            }

            #endregion

            DataStore.Update(oper);
        }

        /// <summary>
        /// Удаляем свой аккаунт
        /// </summary>
        public void RemoveCurrentAccount()
        {
            var currentOperatorId = OperatorIndentity.Operator.Id;
            var oper = DataStore.Get<Operator>(currentOperatorId);
            oper.Status = OperatorStatus.Удалился;
            DataStore.Update(oper);
        }

        /// <summary>
        /// Метод добавления/удаление избранных пользователей
        /// </summary>
        /// <param name="favoriteId"></param>
        public void FavoriteOperator(long favoriteId)
        {
            var currentOperator = OperatorIndentity.Operator;
            var favorite = DataStore.GetAll<FavoriteOperator>()
                .Where(x => x.OperatorFromId == favoriteId && x.OperatorToId == currentOperator.Id)
                .FirstOrDefault();

            if (favorite == null)
            {
                favorite = new Models.App.FavoriteOperator()
                {
                    OperatorFromId = favoriteId,
                    OperatorToId = currentOperator.Id
                };
                DataStore.Create(favorite);
            }
            else {
                DataStore.Delete<FavoriteOperator>(favorite.Id);
            }
        }
    }
}