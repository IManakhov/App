namespace App.Security
{
    using App.DataLayer.Repository;
    using System.Security.Principal;

    public class Principal : IPrincipal
    {
        private OperatorIndentity OperatorIdentity { get; set; }

        #region IPrincipal Members
        public IIdentity Identity => OperatorIdentity;

        public bool IsInRole(string role)
        {
            return OperatorIdentity.Operator?.User != null;
        }
        #endregion

        public Principal(string name, DefaultContext defaultContext)
        {
            OperatorIdentity = new OperatorIndentity();
            OperatorIdentity.Init(name, defaultContext);
        }

        public override string ToString()
        {
            return OperatorIdentity.Name;
        }

        //TODO нужен этот метод? Если нужен, то переписать
        /*
        public bool InRoles(string roles)
        {
            if (string.IsNullOrWhiteSpace(roles))
            {
                return false;
            }

            var rolesArray = roles.Split(new[] {","}, StringSplitOptions.RemoveEmptyEntries);
            foreach (var role in rolesArray)
            {
                //TODO по-другому доставать роль
                //var hasRole = OperatorIdentity.User.Roles.ToLower().Contains(role.ToLower());
                //if (hasRole)
                //{
                //    return true;
                //}
            }
            return false;
        }
        */
    }
}