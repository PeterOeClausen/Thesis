using Microsoft.EntityFrameworkCore;
using ObjectCubeServer.Models.DomainClasses;

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
* 1) Open the 'SQL Server Object Explorer' in Visual Studio.
* 2) There should be one called something like: "(localdb)\MSSQLLocalDB (SQL Server)...". Open that one, open Databases. You should be able to find the database in there. Open the your database there, then tables. Now delete all tables by right-clicking each one and clicking 'Delete'. Also 'dbo.__EFMigrationsHistory'.
* 3) Delete the 'Migrations' folder in your Solution.
* 4) Run 'Add-Migration yourMigrationNameHere' in the Package Manager Console.
* 5) Run 'Update-Database' in the Package Manager Console.
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
            modelBuilder.Entity<ObjectTagRelation>().HasKey(ot => new { ot.ObjectId, ot.TagId }); //Tells EF that ObjectTag's primary key is composed of ObjectId and TagId.
            modelBuilder.Entity<TagTagsetRelation>().HasKey(ttr => new { ttr.TagId, ttr.TagsetId }); //Tells EF that TagTagsetRelations's primary key is composed of TagId and TagsetId.
            base.OnModelCreating(modelBuilder);
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            //base.OnConfiguring(optionsBuilder);
            optionsBuilder.UseSqlServer("Server = (localdb)\\mssqllocaldb; Database = ObjectData; Trusted_Connection = True; AttachDbFileName=D:\\Databases\\ObjectDB.mdf"); //Change location if pushed.
        }
    }
}
