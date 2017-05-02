namespace App.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddFavoriteEntity : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.FavoriteOperators",
                c => new
                    {
                        Id = c.Long(nullable: false, identity: true),
                        OperatorFromId = c.Long(nullable: false),
                        OperatorToId = c.Long(nullable: false),
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
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.FavoriteOperators", "OperatorToId", "dbo.Operators");
            DropForeignKey("dbo.FavoriteOperators", "OperatorFromId", "dbo.Operators");
            DropIndex("dbo.FavoriteOperators", new[] { "OperatorToId" });
            DropIndex("dbo.FavoriteOperators", new[] { "OperatorFromId" });
            DropTable("dbo.FavoriteOperators");
        }
    }
}
