namespace App.DataLayer.Repository
{
    using System;
    using App.Models.Core;
    using System.Data.Entity;
    using System.Data.Entity.ModelConfiguration.Conventions;
    using App.Models.App;

    public class DefaultContext : DbContext
    {
        public DefaultContext() : base("DefaultConnection")
        {
            //Configuration.AutoDetectChangesEnabled = false;
            Database.SetInitializer<DefaultContext>(null);
        }
        
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.HasDefaultSchema("dbo");

            //отключение каскадного удаления при следующих видах отношений:
            modelBuilder.Conventions.Remove<OneToManyCascadeDeleteConvention>();
            modelBuilder.Conventions.Remove<ManyToManyCascadeDeleteConvention>();

            //TODO Собрать все map'ы через рефлексию
            //modelBuilder.Configurations.Add(new UserMap());
            //modelBuilder.Configurations.Add(new RoleMap());
            //modelBuilder.Configurations.Add(new UserRoleMap());
            //modelBuilder.Configurations.Add(new OperatorMap());

            base.OnModelCreating(modelBuilder);
        }

        //TODO Сгенерить все DbSet для всех сущностей (если это нам подойдет)
        public DbSet<User> UserItems { get; set; }
        public DbSet<Role> RoleItems { get; set; }
        public DbSet<UserRole> UserRoleItems { get; set; }
        public DbSet<Operator> OperatorItems { get; set; }
        public DbSet<Message> MessageItems { get; set; }
        public DbSet<OperatorBalance> OperatorBalanceItems { get; set; }
        public DbSet<Payment> PaymentItems { get; set; }
        public DbSet<PaymentTransfer> PaymentTransferItems { get; set; }
        public DbSet<FavoriteOperator> FavoriteOperatorItems { get; set; }

        public DbSet GetDbSet<T>() where T : PersistentEntity
        {
            Type searchType = typeof(T);
            if (searchType == typeof(User))                                       { return UserItems; }
            if (searchType == typeof(Role))                                       { return RoleItems; }
            if (searchType == typeof(UserRole))                                   { return UserRoleItems; }
            if (searchType == typeof(Operator))                                   { return OperatorItems; }
            if (searchType == typeof(Message))                                    { return MessageItems; }
            if (searchType == typeof(OperatorBalance))                            { return OperatorBalanceItems; }
            if (searchType == typeof(Payment))                                    { return PaymentItems; }
            if (searchType == typeof(PaymentTransfer))                            { return PaymentTransferItems; }
            if (searchType == typeof(FavoriteOperator))                           { return FavoriteOperatorItems; }
            
            return null;
        }
    }
}