namespace App.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class ChangesInFields : DbMigration
    {
        public override void Up()
        {
            DropIndex("dbo.Payments", new[] { "OperatorBalance_Id" });
            RenameColumn(table: "dbo.Payments", name: "OperatorBalance_Id", newName: "OperatorBalanceId");
            AlterColumn("dbo.Payments", "OperatorBalanceId", c => c.Long(nullable: false));
            CreateIndex("dbo.Payments", "OperatorBalanceId");
            DropColumn("dbo.Payments", "PersonalAccountBalanceId");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Payments", "PersonalAccountBalanceId", c => c.Long(nullable: false));
            DropIndex("dbo.Payments", new[] { "OperatorBalanceId" });
            AlterColumn("dbo.Payments", "OperatorBalanceId", c => c.Long());
            RenameColumn(table: "dbo.Payments", name: "OperatorBalanceId", newName: "OperatorBalance_Id");
            CreateIndex("dbo.Payments", "OperatorBalance_Id");
        }
    }
}
