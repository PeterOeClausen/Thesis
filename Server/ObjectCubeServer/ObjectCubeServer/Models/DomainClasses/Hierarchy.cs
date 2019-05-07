using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace ObjectCubeServer.Models.DomainClasses
{
    /// <summary>
    /// Repressents a Hiearchy in the M^3 model.
    /// Has a name.
    /// Belongs to a Tagset.
    /// Has a collection of nodes.
    /// Has a root node.
    /// </summary>
    public class Hierarchy
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
        
        public Tagset Tagset { get; set; }
        public int TagsetId { get; set; }
        
        public List<Node> Nodes { get; set; }

        public int RootNodeId { get; set; }
    }
}
