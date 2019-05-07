using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ObjectCubeServer.Models.DomainClasses
{
    public class ParsedFilter
    {
        public string type { get; set; }
        public int tagId { get; set; }
        public int nodeId { get; set; }
    }
}
