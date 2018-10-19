using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ObjectCubeServer.Models.DomainClasses
{
    public class Photo
    {
        public int Id { get; set; }
        public byte[] Image { get; set; }
        public string FileName{ get; set; }
    }
}
