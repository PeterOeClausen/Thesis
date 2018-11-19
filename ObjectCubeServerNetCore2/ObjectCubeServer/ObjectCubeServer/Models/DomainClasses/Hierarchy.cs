using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ObjectCubeServer.Models.DomainClasses
{
    public class Hierarchy
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public Tag Tag { get; set; }
        public int TagId { get; set; }
        public Tagset Tagset { get; set; }
        public int TagsetId { get; set; }
        public Hierarchy ParentHierarchy { get; set; }
        public List<Hierarchy> ChildHierarchies { get; set; }
    }
}
