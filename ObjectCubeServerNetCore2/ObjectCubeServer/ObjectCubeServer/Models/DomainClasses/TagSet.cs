using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ObjectCubeServer.Models.DomainClasses
{
    public class Tagset
    {
        public int Id { get; set; }
        public string Name{ get; set; }
        public List<Tag> Tags { get; set; }
        public List<Hierarchy> HierarchyRoots { get; set; }

        /*
        public Tagset(string name)
        {
            this.Name = name;
            this.Hierarchy = new List<Hierarchy>();
            this.TagTagsetRelations = new List<TagTagsetRelation>();
        }
        */
    }
}
