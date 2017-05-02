namespace App.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class ChangeColumnsNames1 : DbMigration
    {
        public override void Up()
        {
            RenameColumn(table: "dbo.PaymentTransfers", name: "PaymentFrom_Id", newName: "PaymentFromId");
            RenameColumn(table: "dbo.PaymentTransfers", name: "PaymentTo_Id", newName: "PaymentToId");
            RenameIndex(table: "dbo.PaymentTransfers", name: "IX_PaymentFrom_Id", newName: "IX_PaymentFromId");
            RenameIndex(table: "dbo.PaymentTransfers", name: "IX_PaymentTo_Id", newName: "IX_PaymentToId");
            DropColumn("dbo.PaymentTransfers", "PayementFromId");
            DropColumn("dbo.PaymentTransfers", "PayementToId");
        }
        
        public override void Down()
        {
            AddColumn("dbo.PaymentTransfers", "PayementToId", c => c.Long());
            AddColumn("dbo.PaymentTransfers", "PayementFromId", c => c.Long());
            RenameIndex(table: "dbo.PaymentTransfers", name: "IX_PaymentToId", newName: "IX_PaymentTo_Id");
            RenameIndex(table: "dbo.PaymentTransfers", name: "IX_PaymentFromId", newName: "IX_PaymentFrom_Id");
            RenameColumn(table: "dbo.PaymentTransfers", name: "PaymentToId", newName: "PaymentTo_Id");
            RenameColumn(table: "dbo.PaymentTransfers", name: "PaymentFromId", newName: "PaymentFrom_Id");
        }
    }
}
