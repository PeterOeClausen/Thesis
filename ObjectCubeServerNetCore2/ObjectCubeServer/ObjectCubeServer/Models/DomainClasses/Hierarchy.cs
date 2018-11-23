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

        [ForeignKey("TagsetId")]
        public Tagset Tagset { get; set; }
        public int TagsetId { get; set; }

        [ForeignKey("RootNodeId")]
        public Node RootNode { get; set; }
        public int RootNodeId { get; set; }
    }
}
