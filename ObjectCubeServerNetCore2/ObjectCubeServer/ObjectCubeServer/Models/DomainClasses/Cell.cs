using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ObjectCubeServer.Models.DomainClasses
{
    /// <summary>
    /// Repressents a cell in the cube.
    /// Has x,y,z coordinates and the CubeObjects associated with the Cell 
    /// (based on which tags are on position x,y,z on X,Y,Z-axis.
    /// </summary>
    public class Cell
    {
        public int x { get; set; }
        public int y { get; set; }
        public int z { get; set; }
        public List<CubeObject> CubeObjects { get; set; }
    }
}
