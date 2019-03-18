using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace ObjectCubeServer.Models.DomainClasses
{
    /// <summary>
    /// A Node in the Hierarchy.
    /// Has a one to one relation with a tag.
    /// Has child nodes.
    /// If Children is empty, then this node is a leaf.
    /// </summary>
    public class Node
    {
        public int Id { get; set; }

        public int TagId { get; set; }
        [ForeignKey("TagId")]
        public Tag Tag { get; set; }

        public int HierarchyId { get; set; }
        public Hierarchy Hierarchy { get; set; }

        public List<Node> Children { get; set; }
    }
}
