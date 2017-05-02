using System.Data.Entity;

namespace App.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class FirstMigration : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Operators",
                c => new
                    {
                        Id = c.Long(nullable: false, identity: true),
                        Surname = c.String(),
                        Patronymic = c.String(),
                        Email = c.String(),
                        Phone = c.String(),
                        UserId = c.Long(nullable: false),
                        IsLastVersion = c.Int(nullable: false),
                        Status = c.Int(nullable: false),
                        Name = c.String(),
                        ObjectCreateDate = c.DateTime(nullable: false),
                        ObjectEditDate = c.DateTime(nullable: false),
                        Version = c.Int(nullable: false),
                        IsDeleted = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Users", t => t.UserId)
                .Index(t => t.UserId);
            
            CreateTable(
                "dbo.Users",
                c => new
                    {
                        Id = c.Long(nullable: false, identity: true),
                        Login = c.String(),
                        Password = c.String(),
                        ObjectCreateDate = c.DateTime(nullable: false),
                        ObjectEditDate = c.DateTime(nullable: false),
                        Version = c.Int(nullable: false),
                        IsDeleted = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.Roles",
                c => new
                    {
                        Id = c.Long(nullable: false, identity: true),
                        Name = c.String(),
                        ObjectCreateDate = c.DateTime(nullable: false),
                        ObjectEditDate = c.DateTime(nullable: false),
                        Version = c.Int(nullable: false),
                        IsDeleted = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.UserRoles",
                c => new
                    {
                        Id = c.Long(nullable: false, identity: true),
                        UserId = c.Long(nullable: false),
                        RoleId = c.Long(nullable: false),
                        ObjectCreateDate = c.DateTime(nullable: false),
                        ObjectEditDate = c.DateTime(nullable: false),
                        Version = c.Int(nullable: false),
                        IsDeleted = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Roles", t => t.RoleId)
                .ForeignKey("dbo.Users", t => t.UserId)
                .Index(t => t.UserId)
                .Index(t => t.RoleId);
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.UserRoles", "UserId", "dbo.Users");
            DropForeignKey("dbo.UserRoles", "RoleId", "dbo.Roles");
            DropForeignKey("dbo.Operators", "UserId", "dbo.Users");
            DropIndex("dbo.UserRoles", new[] { "RoleId" });
            DropIndex("dbo.UserRoles", new[] { "UserId" });
            DropIndex("dbo.Operators", new[] { "UserId" });
            DropTable("dbo.UserRoles");
            DropTable("dbo.Roles");
            DropTable("dbo.Users");
            DropTable("dbo.Operators");
        }
    }
}
