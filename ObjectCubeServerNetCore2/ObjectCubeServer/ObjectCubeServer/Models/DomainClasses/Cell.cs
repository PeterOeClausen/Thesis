using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ObjectCubeServer.Models.DomainClasses
{
    public class Cell
    {
        public int x { get; set; }
        public int y { get; set; }
        public int z { get; set; }
        public List<CubeObject> CubeObjects { get; set; }
    }
}
