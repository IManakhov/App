namespace App.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddEntities : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Messages",
                c => new
                    {
                        Id = c.Long(nullable: false, identity: true),
                        OperatorFromId = c.Long(nullable: false),
                        OperatorToId = c.Long(nullable: false),
                        Text = c.String(),
                        Name = c.String(),
                        ObjectCreateDate = c.DateTime(nullable: false),
                        ObjectEditDate = c.DateTime(nullable: false),
                        Version = c.Int(nullable: false),
                        IsDeleted = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Operators", t => t.OperatorFromId)
                .ForeignKey("dbo.Operators", t => t.OperatorToId)
                .Index(t => t.OperatorFromId)
                .Index(t => t.OperatorToId);
            
            CreateTable(
                "dbo.OperatorBalances",
                c => new
                    {
                        Id = c.Long(nullable: false, identity: true),
                        OperatorId = c.Long(nullable: false),
                        IsCurrent = c.Boolean(nullable: false),
                        Amount = c.Decimal(nullable: false, precision: 18, scale: 2),
                        DateFrom = c.DateTime(nullable: false),
                        DateTo = c.DateTime(),
                        ObjectCreateDate = c.DateTime(nullable: false),
                        ObjectEditDate = c.DateTime(nullable: false),
                        Version = c.Int(nullable: false),
                        IsDeleted = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Operators", t => t.OperatorId)
                .Index(t => t.OperatorId);
            
            CreateTable(
                "dbo.Payments",
                c => new
                    {
                        Id = c.Long(nullable: false, identity: true),
                        PersonalAccountBalanceId = c.Long(nullable: false),
                        OperatorFromId = c.Long(nullable: false),
                        OperatorToId = c.Long(nullable: false),
                        Amount = c.Decimal(nullable: false, precision: 18, scale: 2),
                        Date = c.DateTime(nullable: false),
                        Type = c.Int(nullable: false),
                        ObjectCreateDate = c.DateTime(nullable: false),
                        ObjectEditDate = c.DateTime(nullable: false),
                        Version = c.Int(nullable: false),
                        IsDeleted = c.Int(nullable: false),
                        OperatorBalance_Id = c.Long(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.OperatorBalances", t => t.OperatorBalance_Id)
                .ForeignKey("dbo.Operators", t => t.OperatorFromId)
                .ForeignKey("dbo.Operators", t => t.OperatorToId)
                .Index(t => t.OperatorFromId)
                .Index(t => t.OperatorToId)
                .Index(t => t.OperatorBalance_Id);
            
            CreateTable(
                "dbo.PaymentTransfers",
                c => new
                    {
                        Id = c.Long(nullable: false, identity: true),
                        PayemenFromtId = c.Long(nullable: false),
                        PayemenTotId = c.Long(nullable: false),
                        OperatorFromId = c.Long(nullable: false),
                        OperatorToId = c.Long(nullable: false),
                        AmountFrom = c.Decimal(nullable: false, precision: 18, scale: 2),
                        AmountTo = c.Decimal(nullable: false, precision: 18, scale: 2),
                        Comission = c.Decimal(nullable: false, precision: 18, scale: 2),
                        OperatorDecisionId = c.Long(),
                        Decision = c.Int(nullable: false),
                        ObjectCreateDate = c.DateTime(nullable: false),
                        ObjectEditDate = c.DateTime(nullable: false),
                        Version = c.Int(nullable: false),
                        IsDeleted = c.Int(nullable: false),
                        PaymentFrom_Id = c.Long(),
                        PaymentTo_Id = c.Long(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Operators", t => t.OperatorDecisionId)
                .ForeignKey("dbo.Operators", t => t.OperatorFromId)
                .ForeignKey("dbo.Operators", t => t.OperatorToId)
                .ForeignKey("dbo.Payments", t => t.PaymentFrom_Id)
                .ForeignKey("dbo.Payments", t => t.PaymentTo_Id)
                .Index(t => t.OperatorFromId)
                .Index(t => t.OperatorToId)
                .Index(t => t.OperatorDecisionId)
                .Index(t => t.PaymentFrom_Id)
                .Index(t => t.PaymentTo_Id);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.PaymentTransfers", "PaymentTo_Id", "dbo.Payments");
            DropForeignKey("dbo.PaymentTransfers", "PaymentFrom_Id", "dbo.Payments");
            DropForeignKey("dbo.PaymentTransfers", "OperatorToId", "dbo.Operators");
            DropForeignKey("dbo.PaymentTransfers", "OperatorFromId", "dbo.Operators");
            DropForeignKey("dbo.PaymentTransfers", "OperatorDecisionId", "dbo.Operators");
            DropForeignKey("dbo.Payments", "OperatorToId", "dbo.Operators");
            DropForeignKey("dbo.Payments", "OperatorFromId", "dbo.Operators");
            DropForeignKey("dbo.Payments", "OperatorBalance_Id", "dbo.OperatorBalances");
            DropForeignKey("dbo.OperatorBalances", "OperatorId", "dbo.Operators");
            DropForeignKey("dbo.Messages", "OperatorToId", "dbo.Operators");
            DropForeignKey("dbo.Messages", "OperatorFromId", "dbo.Operators");
            DropIndex("dbo.PaymentTransfers", new[] { "PaymentTo_Id" });
            DropIndex("dbo.PaymentTransfers", new[] { "PaymentFrom_Id" });
            DropIndex("dbo.PaymentTransfers", new[] { "OperatorDecisionId" });
            DropIndex("dbo.PaymentTransfers", new[] { "OperatorToId" });
            DropIndex("dbo.PaymentTransfers", new[] { "OperatorFromId" });
            DropIndex("dbo.Payments", new[] { "OperatorBalance_Id" });
            DropIndex("dbo.Payments", new[] { "OperatorToId" });
            DropIndex("dbo.Payments", new[] { "OperatorFromId" });
            DropIndex("dbo.OperatorBalances", new[] { "OperatorId" });
            DropIndex("dbo.Messages", new[] { "OperatorToId" });
            DropIndex("dbo.Messages", new[] { "OperatorFromId" });
            DropTable("dbo.PaymentTransfers");
            DropTable("dbo.Payments");
            DropTable("dbo.OperatorBalances");
            DropTable("dbo.Messages");
        }
    }
}
