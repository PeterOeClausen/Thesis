using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace ObjectCubeServer.Models.DomainClasses
{
    public class Node
    {
        public int Id { get; set; }

        public int TagId { get; set; }
        [ForeignKey("TagId")]
        public Tag Tag { get; set; }

        public int HierarchyId { get; set; }
        public Hierarchy Hierarchy { get; set; }

        public int? ParentId { get; set; }
        public Node Parent { get; set; } //Is null if root
    }
}
