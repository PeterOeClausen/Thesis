using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ObjectCubeServer.Models.DomainClasses
{
    /// <summary>
    /// Repressents a Tag in the M^3 model.
    /// Belongs to a Tagset.
    /// Has a name.
    /// Has a many-to-many relationshop with CubeObjects.
    /// </summary>
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