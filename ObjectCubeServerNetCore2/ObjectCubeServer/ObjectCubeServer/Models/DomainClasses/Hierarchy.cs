using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ObjectCubeServer.Models.DomainClasses
{
    public class Hierarchy
    {
        public int Id { get; set; }
        public List<Hierarchy> SubHierarchies { get; set; }
        public List<Hierarchy> SuperHierarchies { get; set; }
    }
}
