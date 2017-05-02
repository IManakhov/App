namespace App.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class ChangeColumnsNames : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.PaymentTransfers", "OperatorDecisionId", "dbo.Operators");
            DropIndex("dbo.PaymentTransfers", new[] { "OperatorDecisionId" });
            AddColumn("dbo.PaymentTransfers", "PayementFromId", c => c.Long());
            AddColumn("dbo.PaymentTransfers", "PayementToId", c => c.Long());
            DropColumn("dbo.PaymentTransfers", "PayemenFromtId");
            DropColumn("dbo.PaymentTransfers", "PayemenTotId");
            DropColumn("dbo.PaymentTransfers", "OperatorDecisionId");
        }
        
        public override void Down()
        {
            AddColumn("dbo.PaymentTransfers", "OperatorDecisionId", c => c.Long());
            AddColumn("dbo.PaymentTransfers", "PayemenTotId", c => c.Long(nullable: false));
            AddColumn("dbo.PaymentTransfers", "PayemenFromtId", c => c.Long(nullable: false));
            DropColumn("dbo.PaymentTransfers", "PayementToId");
            DropColumn("dbo.PaymentTransfers", "PayementFromId");
            CreateIndex("dbo.PaymentTransfers", "OperatorDecisionId");
            AddForeignKey("dbo.PaymentTransfers", "OperatorDecisionId", "dbo.Operators", "Id");
        }
    }
}
