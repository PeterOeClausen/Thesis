using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ObjectCubeServer.Models.DomainClasses
{
    /// <summary>
    /// Repressents a Tagset in the M^3 model.
    /// Has a name.
    /// Has a collection of tags.
    /// Has a collection of Hierarchies.
    /// </summary>
    public class Tagset
    {
        public int Id { get; set; }
        public string Name{ get; set; }
        public List<Tag> Tags { get; set; }
        public List<Hierarchy> Hierarchies { get; set; }
    }
}
