namespace App.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddCorrespondenceId : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Messages", "CorrespondenceId", c => c.Guid(nullable: false));
            AddColumn("dbo.PaymentTransfers", "CorrespondenceId", c => c.Guid(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.PaymentTransfers", "CorrespondenceId");
            DropColumn("dbo.Messages", "CorrespondenceId");
        }
    }
}
