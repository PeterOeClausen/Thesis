using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ObjectCubeServer.Models.DomainClasses
{
    /// <summary>
    /// Is a smaller image copy of Photo or another file type.
    /// </summary>
    public class Thumbnail
    {
        public int Id { get; set; }

        public byte[] Image { get; set; }

        public CubeObject CubeObject { get; set; }
    }
}
