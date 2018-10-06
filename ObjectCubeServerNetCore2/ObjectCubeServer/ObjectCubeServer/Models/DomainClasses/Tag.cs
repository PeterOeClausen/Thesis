using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ObjectCubeServer.Models.DomainClasses
{
    public class Tag
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public List<ObjectTag> ObjectTags { get; set; }

    }
}
