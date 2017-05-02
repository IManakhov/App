namespace App.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class RemoveOperatorColumns : DbMigration
    {
        public override void Up()
        {
            DropColumn("dbo.Operators", "Position");
            DropColumn("dbo.Operators", "CanSetSign");
            DropColumn("dbo.Operators", "SignDateEnd");
            DropColumn("dbo.Operators", "SignPosition");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Operators", "SignPosition", c => c.String());
            AddColumn("dbo.Operators", "SignDateEnd", c => c.DateTime());
            AddColumn("dbo.Operators", "CanSetSign", c => c.Int(nullable: false));
            AddColumn("dbo.Operators", "Position", c => c.Int(nullable: false));
        }
    }
}
