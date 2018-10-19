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
        public Hierarchy Hierarchy { get; set; }
        public List<TagTagsetRelation> TagTagsetRelations { get; set; }

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
