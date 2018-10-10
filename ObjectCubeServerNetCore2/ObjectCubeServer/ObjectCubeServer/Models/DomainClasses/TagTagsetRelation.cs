using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ObjectCubeServer.Models.DomainClasses
{
    public class TagTagsetRelation
    {
        public int TagId { get; set; }
        public Tag Tag { get; set; }
        public int TagsetId { get; set; }
        public Tagset Tagset { get; set; }
    }
}
