using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ObjectCubeServer.Models.DomainClasses
{
    /// <summary>
    /// Used in CellController to receive a JSON object repressenting an axis:
    /// Eg: {"AxisDirection":"X","AxisType":"Hierarchy","TagsetId":0,"HierarchyNodeId":1}
    /// </summary>
    public class ParsedAxis
    {
        public string AxisDirection { get; set; }
        public string AxisType { get; set; }
        public int TagsetId { get; set; }
        public int HierarchyNodeId { get; set; }
    }
}
