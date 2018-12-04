using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace ObjectCubeServer.Models.DomainClasses
{
    public class Hierarchy
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
        
        public Tagset Tagset { get; set; }
        public int TagsetId { get; set; }

        //The rootnode has the same name as tagset by convention.
        public List<Node> Nodes { get; set; }
    }
}
