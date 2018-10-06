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
        public DbSet<ObjectTag> ObjectTags { get; set; }
        public DbSet<Tag> Tags{ get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<ObjectTag>().HasKey(ot => new { ot.ObjectId, ot.TagId }); //Tells EF that ObjectTag's primary key is composed of ObjectId and TagId.
            modelBuilder.Entity<CubeObject>().HasOne(co => co.Photo).WithOne(p => p.Object); //Tells EF That CubeObject has a one-to-one relationship with Photo.
            base.OnModelCreating(modelBuilder);
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            //base.OnConfiguring(optionsBuilder);
            optionsBuilder.UseSqlServer("Server = (localdb)\\mssqllocaldb; Database = ObjectData; Trusted_Connection = True; AttachDbFileName=D:\\Databases\\ObjectDB.mdf"); //Change location if pushed.
        }
    }
}
