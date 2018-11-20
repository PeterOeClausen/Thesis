using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace ObjectCubeServer.Models.DomainClasses
{
    public class Hierarchy
    {
        public int Id { get; set; }
        public string Name { get; set; }

        [ForeignKey("TagId")]
        public Tag Tag { get; set; }
        public int TagId { get; set; }

        [ForeignKey("TagsetId")]
        public Tagset Tagset { get; set; }
        public int TagsetId { get; set; }

        [ForeignKey("ParentHierarchyId")]
        public Hierarchy ParentHierarchy { get; set; } //Is null if Hierarchy is null
        public int? ParentHierarchyId { get; set; } 

        public List<Hierarchy> ChildHierarchies { get; set; }
    }
}
