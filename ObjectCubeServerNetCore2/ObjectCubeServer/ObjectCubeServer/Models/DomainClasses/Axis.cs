using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ObjectCubeServer.Models.DomainClasses
{
    public class ParsedAxis
    {
        public string AxisDirection { get; set; }
        public string AxisType { get; set; }
        public int TagsetId { get; set; }
        public int HierarchyNodeId { get; set; }
    }
}
