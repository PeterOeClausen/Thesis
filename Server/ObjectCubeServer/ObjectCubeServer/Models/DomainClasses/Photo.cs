using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ObjectCubeServer.Models.DomainClasses
{
    /// <summary>
    /// A Photo, seperated from a CubeObject to be loaded at a later time.
    /// Image contatains the serialized image.
    /// Has a fileName.
    /// </summary>
    public class Photo
    {
        public int Id { get; set; }
        public byte[] Image { get; set; }
        public string FileName{ get; set; }
        public CubeObject CubeObject { get; set; }
    }
}
