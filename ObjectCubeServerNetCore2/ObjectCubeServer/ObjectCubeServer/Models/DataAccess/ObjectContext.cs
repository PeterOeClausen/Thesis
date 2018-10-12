using Microsoft.EntityFrameworkCore;
using ObjectCubeServer.Models.DomainClasses;
using System.Collections.Generic;

namespace ObjectCubeServer.Models.DataAccess
/*
* Before you can use the database, change the value of 'AttachDbFileName' to a valid directory on your machine.
* Eg: C:\\Databases\\ObjectDB.mdf
* You also need to run the following command in the Package Manager Console inside visual studio:
* Update-Database
* To apply the schema to the database.
* 
* Setup test data:
* TODO.
* 
* To clear database and migrations:
* - Delete the Migrations folder.
* - Run the command "drop-database" from the PMC.
* - Check this issue for more information: https://github.com/aspnet/EntityFramework.Docs/issues/1048
*/

{
    public class ObjectContext : DbContext
    {
        /*
         * Exposing which DBSets are available to be manipulated with
         */ 
        public DbSet<CubeObject> CubeObjects { get; set; }
        public DbSet<Tag> Tags { get; set; }
        public DbSet<Tagset> Tagsets { get; set; }
        public DbSet<Hierarchy> Hierarchies { get; set; }
        
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            //Specifying keys:
            modelBuilder.Entity<ObjectTagRelation>().HasKey(ot => new { ot.ObjectId, ot.TagId }); //Tells EF that ObjectTag's primary key is composed of ObjectId and TagId.
            modelBuilder.Entity<TagTagsetRelation>().HasKey(ttr => new { ttr.TagId, ttr.TagsetId }); //Tells EF that TagTagsetRelations's primary key is composed of TagId and TagsetId.

            /*
            //Seeding database:
            //Creating friends and family tags:
            var FriendsTag = new Tag("Friends");
            var AliceTag = new Tag("Alice");
            var BobTag = new Tag("Bob");
            var PeterTag = new Tag("Peter");
            var SaraTag = new Tag("Sara");
            
            var FamilyTag = new Tag("Family");
            var CharlieTag = new Tag("Charlie");
            var DanielTag = new Tag("Daniel");

            //Creating people tagset:
            var PeopleTagset = new Tagset("People");

            //Creating relations:
            var FriendsRelations = new TagTagsetRelation[] {
                new TagTagsetRelation(FriendsTag, PeopleTagset),
                new TagTagsetRelation(AliceTag, PeopleTagset),
                new TagTagsetRelation(BobTag, PeopleTagset),
                new TagTagsetRelation(PeterTag, PeopleTagset),
                new TagTagsetRelation(SaraTag, PeopleTagset),
                new TagTagsetRelation(FamilyTag, PeopleTagset),
                new TagTagsetRelation(CharlieTag, PeopleTagset),
                new TagTagsetRelation(DanielTag, PeopleTagset),
            };
            FriendsTag.TagSets.AddRange(FriendsRelations);

            //Creating hirarchies:

            modelBuilder.Entity<Tagset>().HasData();
            */

            //Calling on model creating:
            base.OnModelCreating(modelBuilder);
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            //base.OnConfiguring(optionsBuilder);
            optionsBuilder.UseSqlServer("Server = (localdb)\\mssqllocaldb; Database = ObjectData; Trusted_Connection = True; AttachDbFileName=D:\\Databases\\ObjectDB.mdf"); //Change location if pushed.
        }
    }
}
