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
        public DbSet<TagTagsetRelation> TagTagsetRelations { get; set; }
        public DbSet<Tagset> Tagsets { get; set; }
        public DbSet<Hierarchy> Hierarchies { get; set; }
        public DbSet<Photo> Photos { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            //Specifying keys:
            modelBuilder.Entity<ObjectTagRelation>().HasKey(ot => new { ot.ObjectId, ot.TagId }); //Tells EF that ObjectTag's primary key is composed of ObjectId and TagId.
            modelBuilder.Entity<ObjectTagRelation>() //Tells EF that there is a one-to-many relationsship between ObjectTagRelation and CubeObject
                .HasOne(otr => otr.CubeObject)
                .WithMany(co => co.ObjectTagRelations)
                .HasForeignKey(otr => otr.ObjectId);
            modelBuilder.Entity<ObjectTagRelation>() //Tells EF that there is a one-to-many relationsship between ObjectTagRelation and Tag
                .HasOne(otr => otr.Tag)
                .WithMany(t => t.ObjectTagRelations)
                .HasForeignKey(otr => otr.TagId);

            modelBuilder.Entity<TagTagsetRelation>().HasKey(ttr => new { ttr.TagId, ttr.TagsetId }); //Tells EF that TagTagsetRelations's primary key is composed of TagId and TagsetId.
            modelBuilder.Entity<TagTagsetRelation>() //Tells EF that there is a one-to-many relationsship between TagTagsetRelation and Tag
                .HasOne(ttr => ttr.Tag)
                .WithMany(t => t.TagTagsetRelations)
                .HasForeignKey(ttr => ttr.TagId);
            modelBuilder.Entity<TagTagsetRelation>() //Tells EF that there is a one-to-many relationsship between TagTagsetRelation and Tagset
                .HasOne(ttr => ttr.Tagset)
                .WithMany(ts => ts.TagTagsetRelations)
                .HasForeignKey(ttr => ttr.TagsetId);
            
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
