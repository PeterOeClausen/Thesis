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
        public ObjectContext()
        {

        }

        public ObjectContext(DbContextOptions<ObjectContext> options) : base(options)
        {

        }

        /*
         * Exposing which DBSets are available to be manipulated with
         */
        public DbSet<CubeObject> CubeObjects { get; set; }
        public DbSet<Photo> Photos { get; set; }
        public DbSet<Thumbnail> Thumbnails { get; set; }
        public DbSet<Tagset> Tagsets { get; set; }
        public DbSet<Tag> Tags { get; set; }
        public DbSet<ObjectTagRelation> ObjectTagRelations { get; set; }
        public DbSet<Hierarchy> Hierarchies { get; set; }
        public DbSet<Node> Nodes { get; set; }
        
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            //If CubeObject is deleted, then photo is also deleted.
            modelBuilder.Entity<CubeObject>()
                .HasOne<Photo>(co => co.Photo)
                .WithOne(p => p.CubeObject)
                .HasForeignKey<CubeObject>(co => co.PhotoId);

            modelBuilder.Entity<CubeObject>()
                .HasOne<Thumbnail>(co => co.Thumbnail)
                .WithOne(t => t.CubeObject)
                .HasForeignKey<CubeObject>(co => co.ThumbnailId);

            //Tells EF that ObjectTag's primary key is composed of ObjectId and TagId:
            modelBuilder.Entity<ObjectTagRelation>()
                .HasKey(ot => new { ot.ObjectId, ot.TagId });
            //Tells EF that there is a one-to-many relationsship between ObjectTagRelation and CubeObject:
            modelBuilder.Entity<ObjectTagRelation>() 
                .HasOne(otr => otr.CubeObject)
                .WithMany(co => co.ObjectTagRelations)
                .HasForeignKey(otr => otr.ObjectId);
            //Tells EF that there is a one-to-many relationsship between ObjectTagRelation and Tag:
            modelBuilder.Entity<ObjectTagRelation>()
                .HasOne(otr => otr.Tag)
                .WithMany(t => t.ObjectTagRelations)
                .HasForeignKey(otr => otr.TagId);

            //Tells EF Core that tagset's name should be unique.
            modelBuilder.Entity<Tagset>()
                .HasIndex(ts => ts.Name)
                .IsUnique();

            //Many-to-one relationship, if tagset is deleted, then tags are also deleted.
            modelBuilder.Entity<Tagset>()
                .HasMany(ts => ts.Tags)
                .WithOne(t => t.Tagset)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Tag>()
               .Property(t => t.Id)
               .ValueGeneratedOnAdd();

            //Many-to-one relationship, if tagset is deleted, then hierarchies are also deleted.
            modelBuilder.Entity<Tagset>()
                .HasMany(ts => ts.Hierarchies)
                .WithOne(h => h.Tagset)
                .OnDelete(DeleteBehavior.Cascade);

            //Many-to-one relationship, if hierarchy is deleted, then nodes are also deleted.
            modelBuilder.Entity<Hierarchy>()
                .HasMany(h => h.Nodes)
                .WithOne(n => n.Hierarchy)
                .OnDelete(DeleteBehavior.Cascade);

            //If a tag is deleted, then so is the node:
            modelBuilder.Entity<Node>()
                .HasOne(n => n.Tag)
                .WithMany()
                .OnDelete(DeleteBehavior.Restrict);

            //Calling on model creating:
            base.OnModelCreating(modelBuilder);
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            //base.OnConfiguring(optionsBuilder);
            optionsBuilder
                .UseSqlServer("Server = (localdb)\\mssqllocaldb; Database = ObjectData; Trusted_Connection = True; AttachDbFileName=D:\\Databases\\ObjectDB.mdf"); //Change location if pushed.
                //.UseSqlServer(@"Server=(localdb)\mssqllocaldb;Database=EFProviders.InMemory;Trusted_Connection=True;ConnectRetryCount=0");
        }
    }
}
