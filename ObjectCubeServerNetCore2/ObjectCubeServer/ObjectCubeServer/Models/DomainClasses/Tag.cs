using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ObjectCubeServer.Models.DomainClasses
{
    public class Tag
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }

        public Tagset Tagset { get; set; }
        public int TagsetId { get; set; }

        public List<ObjectTagRelation> ObjectTagRelations { get; set; }
    }
}