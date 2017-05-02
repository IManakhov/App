namespace App.DataLayer.Extension
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Linq.Expressions;
    using System.Reflection;
    using App.DataLayer.Filters;

    public static class StoreDataExtension
    {
        public static IQueryable<T> Order<T>(this IQueryable<T> source, StoreLoadParams storeLoadParams)
        {
            return Order(source, storeLoadParams.sort);
        }

        public static IQueryable<T> Order<T>(this IQueryable<T> source, List<OrderColumn> orderColumnList)
        {
            if (orderColumnList.Any() == false)
            {
                orderColumnList.Add(new OrderColumn { direction = "DESC", property = "Id" }); //Entity Framework может применить Paging только для сортированных запросов
            }
            return (from orderColumn in orderColumnList let propertyInfo = typeof (T).GetProperty(orderColumn.property) where propertyInfo != null select orderColumn).Aggregate(source, (current, orderColumn) => current.ExtOrderBy(orderColumn.property, orderColumn.direction));
        }

        private static IQueryable<T> ExtOrderBy<T>(this IQueryable<T> source, string sortProperty, string sortOrder)
        {
            Type type = typeof(T);
            PropertyInfo propertyInfo = type.GetProperty(sortProperty);
            ParameterExpression parameterExpression = Expression.Parameter(type, "p");
            MemberExpression memberExpression = Expression.MakeMemberAccess(parameterExpression, propertyInfo);
            LambdaExpression lambdaExpression = Expression.Lambda(memberExpression, parameterExpression);
            Type[] typeArguments = { type, propertyInfo.PropertyType };
            string methodName = sortOrder == "ASC" ? "OrderBy" : "OrderByDescending";
            MethodCallExpression methodCallExpression = Expression.Call(typeof(Queryable), methodName, typeArguments, source.Expression, Expression.Quote(lambdaExpression));

            return source.Provider.CreateQuery<T>(methodCallExpression);
        }

        // TODO Ильшату
        public static IQueryable<T> FilterByProperty<T>(this IQueryable<T> source, StoreLoadParams storeLoadParams)
        {
            return FilterByProperty(source, storeLoadParams.filter);
        }

        public static IQueryable<T> FilterByProperty<T>(this IQueryable<T> source, List<FilterColumn> filterColumnList)
        {
            foreach (FilterColumn filterColumn in filterColumnList)
            {
                PropertyInfo propertyInfo = typeof(T).GetProperty(filterColumn.property);
                if (propertyInfo != null)
                {
                    if (filterColumn.type == "int")
                    {
                        if (filterColumn.@operator == "eq")
                        {
                            source = source.Where(PropertyEquals<T, int>(propertyInfo, int.Parse(filterColumn.value)));
                        }
                        else if (filterColumn.@operator == "gte")
                        {
                            source = source.Where(PropertyGreaterThanOrEqual<T, int>(propertyInfo, int.Parse(filterColumn.value)));
                        }
                        else if (filterColumn.@operator == "lte")
                        {
                            source = source.Where(PropertyLessThanOrEqual<T, int>(propertyInfo, int.Parse(filterColumn.value)));
                        }
                        else if (filterColumn.@operator == "ne")
                        {
                            source = source.Where(PropertyNotEquals<T, int>(propertyInfo, int.Parse(filterColumn.value)));
                        }
                        continue;
                    }
                    if (filterColumn.type == "date")
                    {
                        DateTime dateValue = DateTime.Parse(filterColumn.value).Date;
                        if (filterColumn.@operator == "eq")
                        {
                            source = source.Where(PropertyEquals<T, DateTime>(propertyInfo, dateValue));
                        }
                        else if (filterColumn.@operator == "gte")
                        {
                            source = source.Where(PropertyGreaterThanOrEqual<T, DateTime>(propertyInfo, dateValue));
                        }
                        else if (filterColumn.@operator == "lte")
                        {
                            source = source.Where(PropertyLessThanOrEqual<T, DateTime>(propertyInfo, dateValue));
                        }
                        else if (filterColumn.@operator == "ne")
                        {
                            source = source.Where(PropertyNotEquals<T, DateTime>(propertyInfo, dateValue));
                        }
                        continue;
                    }

                    if (filterColumn.type == "list")
                    {
                        if (filterColumn.value != null && (filterColumn.value.ToLower() == "true" || filterColumn.value.ToLower() == "false"))
                        { 
                            source = source.Where(PropertyEquals<T, bool>(propertyInfo, Convert.ToBoolean(filterColumn.value)));
                        }
                        else if (filterColumn.value != null)
                        {
                            source = source.Where(PropertyEquals<T, string>(propertyInfo, filterColumn.value.ToLower()));
                        }
                        
                        continue;
                    }
                    source = source.Where(PropertyContains<T>(propertyInfo, filterColumn.value.ToLower()));
                }
            }
            return source;
        }

        #region FILTER property filters
        private static Expression<Func<TItem, bool>> PropertyEquals<TItem, TValue>(PropertyInfo propertyInfo, TValue value)
        {
            ParameterExpression parameterExpression = Expression.Parameter(typeof(TItem));
            MethodInfo methodInfoToLower = typeof(string).GetMethod("ToLower", Type.EmptyTypes);
            Type propertyType = typeof(TValue);

            //TODO проверить сортировки по датам, у которых есть время
            MemberExpression memberExpression = Expression.Property(parameterExpression, propertyInfo);
            /*
            if (propertyType == typeof(DateTime))
                prop = Expression.Property(Expression.Property(parameterExpression, propertyInfo), "Date");
            else
                prop = Expression.Property(parameterExpression, propertyInfo);
            */

            Expression expression;
            ConstantExpression constantExpression;
            if (propertyInfo.PropertyType.IsEnum)
            {
                constantExpression = Expression.Constant(Convert.ChangeType(Enum.Parse(propertyInfo.PropertyType, value.ToString(), true), propertyInfo.PropertyType));
            }
            else
            {
                object objectWithSpecifiedType = Convert.ChangeType(value, propertyInfo.PropertyType);
                constantExpression = Expression.Constant(objectWithSpecifiedType);
            }
            Expression expressionLeft = (propertyType != typeof(DateTime) && memberExpression.Expression.NodeType == ExpressionType.MemberAccess) ? memberExpression.Expression : memberExpression;
            if (propertyType == typeof(string) && !propertyInfo.PropertyType.IsEnum)
            {
                expression = Expression.Equal(Expression.Call(memberExpression, methodInfoToLower), constantExpression);
            }
            else
            {
                expression = Expression.Equal(expressionLeft, constantExpression);
            }
            return Expression.Lambda<Func<TItem, bool>>(expression, parameterExpression);
        }

        private static Expression<Func<TItem, bool>> PropertyNotEquals<TItem, TValue>(PropertyInfo propertyInfo, TValue value)
        {
            ParameterExpression parameterExpression = Expression.Parameter(typeof(TItem));
            MemberExpression memberExpression = typeof(TValue) != typeof(DateTime) ? Expression.Property(parameterExpression, propertyInfo) : Expression.Property(Expression.Property(parameterExpression, propertyInfo), "Date");
            Expression expressionLeft = memberExpression.Expression.NodeType == ExpressionType.MemberAccess ? memberExpression.Expression : memberExpression;
            BinaryExpression binaryExpression = Expression.NotEqual(expressionLeft, Expression.Constant(value));
            return Expression.Lambda<Func<TItem, bool>>(binaryExpression, parameterExpression);
        }

        private static Expression<Func<TItem, bool>> PropertyLessThan<TItem, TValue>(PropertyInfo propertyInfo, TValue value)
        {
            ParameterExpression parameterExpression = Expression.Parameter(typeof(TItem));
            MemberExpression memberExpression = typeof(TValue) != typeof(DateTime) ? Expression.Property(parameterExpression, propertyInfo) : Expression.Property(Expression.Property(parameterExpression, propertyInfo), "Date");
            Expression expressionLeft = memberExpression.Expression.NodeType == ExpressionType.MemberAccess ? memberExpression.Expression : memberExpression;
            BinaryExpression binaryExpression = Expression.LessThan(expressionLeft, Expression.Constant(value));
            return Expression.Lambda<Func<TItem, bool>>(binaryExpression, parameterExpression);
        }

        private static Expression<Func<TItem, bool>> PropertyLessThanOrEqual<TItem, TValue>(PropertyInfo propertyInfo, TValue value)
        {
            ParameterExpression parameterExpression = Expression.Parameter(typeof(TItem));
            MemberExpression memberExpression = typeof(TValue) != typeof(DateTime) ? Expression.Property(parameterExpression, propertyInfo) : Expression.Property(Expression.Property(parameterExpression, propertyInfo), "Date");
            Expression expressionLeft = memberExpression.Expression.NodeType == ExpressionType.MemberAccess ? memberExpression.Expression : memberExpression;
            BinaryExpression binaryExpression = Expression.LessThanOrEqual(expressionLeft, Expression.Constant(value));
            return Expression.Lambda<Func<TItem, bool>>(binaryExpression.Conversion, parameterExpression);
        }

        private static Expression<Func<TItem, bool>> PropertyGreaterThan<TItem, TValue>(PropertyInfo propertyInfo, TValue value)
        {
            ParameterExpression parameterExpression = Expression.Parameter(typeof(TItem));
            MemberExpression memberExpression = typeof(TValue) != typeof(DateTime) ? Expression.Property(parameterExpression, propertyInfo) : Expression.Property(Expression.Property(parameterExpression, propertyInfo), "Date");
            Expression expressionLeft = memberExpression.Expression.NodeType == ExpressionType.MemberAccess ? memberExpression.Expression : memberExpression;
            BinaryExpression binaryExpression = Expression.GreaterThan(expressionLeft, Expression.Constant(value));
            return Expression.Lambda<Func<TItem, bool>>(binaryExpression, parameterExpression);
        }

        private static Expression<Func<TItem, bool>> PropertyGreaterThanOrEqual<TItem, TValue>(PropertyInfo propertyInfo, TValue value)
        {
            ParameterExpression parameterExpression = Expression.Parameter(typeof(TItem));
            MemberExpression memberExpression = typeof(TValue) != typeof(DateTime) ? Expression.Property(parameterExpression, propertyInfo) : Expression.Property(Expression.Property(parameterExpression, propertyInfo), "Date");
            Expression expressionLeft = memberExpression.Expression.NodeType == ExpressionType.MemberAccess ? memberExpression.Expression : memberExpression;
            BinaryExpression binaryExpression = Expression.GreaterThanOrEqual(expressionLeft, Expression.Constant(value));
            return Expression.Lambda<Func<TItem, bool>>(binaryExpression, parameterExpression);
        }

        private static Expression<Func<T, bool>> PropertyContains<T>(PropertyInfo propertyInfo, string propertyValue)
        {
            ParameterExpression parameterExpression = Expression.Parameter(typeof(T));
            MemberExpression memberExpression = Expression.Property(parameterExpression, propertyInfo);
            MethodInfo methodInfo = typeof(string).GetMethod("Contains", new[] { typeof(string) });
            MethodInfo methodInfoToLower = typeof(string).GetMethod("ToLower", Type.EmptyTypes);
            ConstantExpression constantExpression = Expression.Constant(propertyValue, typeof(string));
            MethodCallExpression methodCallExpression = Expression.Call(Expression.Call(memberExpression, methodInfoToLower), methodInfo, constantExpression);

            return Expression.Lambda<Func<T, bool>>(methodCallExpression, parameterExpression);
        }
        #endregion


        public static IQueryable<T> Paging<T>(this IQueryable<T> source, StoreLoadParams storeLoadParams)
        {
            if (storeLoadParams.limit <= 0)
            {
                return source;
            }
            return source.Skip(storeLoadParams.start).Take(storeLoadParams.limit);
        }

        #region Методы расширения типа IQueryable
        /// <summary> Условная сортировка последовательности. </summary>
        /// <param name="query"> </param>
        /// <param name="condition"> Проводить или нет сортировку.  </param>
        /// <param name="acs"> Сортировать по возрастанию или убыванию.  </param>
        /// <param name="keySelector"> Выражение для вычисления ключа.  </param>
        /// <typeparam name="T"> Тип элементов последовательности. </typeparam>
        /// <typeparam name="TKey"> Тип ключей. </typeparam>
        public static IQueryable<T> OrderIf<T, TKey>(this IQueryable<T> query, bool condition, bool acs, Expression<Func<T, TKey>> keySelector)
        {
            if (condition == false)
            {
                return query;
            }

            return acs ? query.OrderBy(keySelector) : query.OrderByDescending(keySelector);
        }

        /// <summary> Дополнительная условная сортировка последовательности. </summary>
        /// <param name="query"> </param>
        /// <param name="condition"> Проводить или нет сортировку.  </param>
        /// <param name="acs"> Сортировать по возрастанию или убыванию.  </param>
        /// <param name="keySelector"> Выражение для вычисления ключа.  </param>
        /// <typeparam name="T"> Тип элементов последовательности. </typeparam>
        /// <typeparam name="TKey"> Тип ключей. </typeparam>
        public static IQueryable<T> OrderThenIf<T, TKey>(this IQueryable<T> query, bool condition, bool acs, Expression<Func<T, TKey>> keySelector)
        {
            if (condition == false)
            {
                return query;
            }

            return acs ? ((IOrderedQueryable<T>)query).ThenBy(keySelector) : ((IOrderedQueryable<T>)query).ThenByDescending(keySelector);
        }

        /// <summary> Условная фильтрация последовательности. </summary>
        /// <param name="query"> </param>
        /// <param name="condition"> Проводить или нет фильтрацию.  </param>
        /// <param name="predicate"> Предикат для отбора элементов.  </param>
        /// <typeparam name="T"> Тип элементов последовательности. </typeparam>
        public static IQueryable<T> WhereIf<T>(this IQueryable<T> query, bool condition, Expression<Func<T, bool>> predicate)
        {
            return condition ? query.Where(predicate) : query;
        }

        /// <summary>Условная фильтрация последовательности</summary>
        /// <typeparam name="T">Тип элементов последовательности</typeparam>
        /// <param name="query">Запрос</param>
        /// <param name="condition">Проводить или нет фильтрацию</param>
        /// <param name="predicateIfTrue">Предикат для отбора элементов true</param>
        /// <param name="predicateIfFalse">Предикат для отбора элементов false</param>
        /// <returns></returns>
        public static IQueryable<T> WhereIfElse<T>(this IQueryable<T> query, bool condition, Expression<Func<T, bool>> predicateIfTrue, Expression<Func<T, bool>> predicateIfFalse)
        {
            return condition ? query.Where(predicateIfTrue) : query.Where(predicateIfFalse);
        }

        /// <summary> Принадлежит ли элемент массиву. Если элемент равен null, возвращается false. </summary>
        /// <param name="value"></param>
        /// <param name="values"></param>
        /// <typeparam name="T"></typeparam>
        public static bool In<T>(this T @value, params T[] values)
        {
            return values != null && values.Contains(@value);
        }

        /// <summary> Принадлежит ли элемент последовательности. Если элемент равен null, возвращается false. </summary>
        /// <param name="value"></param>
        /// <param name="values"></param>
        /// <typeparam name="T"></typeparam>
        public static bool In<T>(this T @value, IQueryable<T> values)
        {
            return values != null && values.Contains(@value);
        }

        /// <summary> Принадлежит ли элемент последовательности. Если элемент равен null, возвращается false. </summary>
        /// <param name="value"></param>
        /// <param name="values"></param>
        /// <typeparam name="T"></typeparam>
        public static bool In<T>(this T @value, IEnumerable<T> values)
        {
            return values != null && values.Contains(@value);
        }

        /// <summary> Проверяет не принадлежит ли элемент массиву. Если элемент или коллекция равны null, возвращается true. </summary>
        /// <param name="value"></param>
        /// <param name="values"></param>
        /// <typeparam name="T"></typeparam>
        public static bool NotIn<T>(this T @value, params T[] values)
        {
            return values == null || !values.Contains(@value);
        }

        /// <summary> Проверяет не принадлежит ли элемент последовательности. Если элемент или коллекция равны null, возвращается true. </summary>
        /// <param name="value"></param>
        /// <param name="values"></param>
        /// <typeparam name="T"></typeparam>
        public static bool NotIn<T>(this T @value, IQueryable<T> values)
        {
            return values == null || !values.Contains(@value);
        }

        /// <summary> Проверяет не принадлежит ли элемент последовательности. Если элемент или коллекция равны null, возвращается true. </summary>
        /// <param name="value"></param>
        /// <param name="values"></param>
        /// <typeparam name="T"></typeparam>
        public static bool NotIn<T>(this T @value, IEnumerable<T> values)
        {
            return values == null || !values.Contains(@value);
        }
        #endregion
    }
}