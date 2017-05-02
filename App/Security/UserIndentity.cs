namespace App.Security
{
    using App.DataLayer.Repository;
    using App.Models.Core;
    using System.Linq;
    using System.Security.Principal;

    public interface IOperatorIndentity
    {
        Operator Operator { get; set; }
    }

    public class OperatorIndentity : IIdentity, IOperatorIndentity
    {
        public string AuthenticationType => typeof(Operator).ToString();

        public bool IsAuthenticated => Operator?.User != null;

        public string Name => Operator?.User != null ? Operator.User.Login : "anonym";

        public void Init(string email, DefaultContext defaultContext)
        {
            if (string.IsNullOrEmpty(email) == false)
            {
                Operator = defaultContext.OperatorItems
                    .Single(x => x.User.Login == email && x.Status == OperatorStatus.Активный && x.IsLastVersion == 1);
            }
        }

        public IAuthentication Authentication { get; set; }

        public Operator Operator { get; set; }
    }
}