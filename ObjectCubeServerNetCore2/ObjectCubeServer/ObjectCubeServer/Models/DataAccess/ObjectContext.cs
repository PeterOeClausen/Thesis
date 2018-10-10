using Microsoft.EntityFrameworkCore;
using ObjectCubeServer.Models.DomainClasses;

namespace ObjectCubeServer.Models.DataAccess
/*
* Remember to open Package Manager Console and run:
* add-migration init
* 
* And then:
* update-database
*/

{
    public class ObjectContext : DbContext
    {
        public DbSet<CubeObject> CubeObject { get; set; }
        public DbSet<ObjectTagRelation> ObjectTags { get; set; }
        public DbSet<Tag> Tags{ get; set; }

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
