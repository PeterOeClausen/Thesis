using System.Collections.Generic;

namespace ObjectCubeServer.Models.DomainClasses
{
    public class CubeObject
    {
        public int Id { get; set; }
        public List<ObjectTag> ObjectTags { get; set; }
        public FileType FileType { get; set; }
        public int FileId { get; set; }
        public Photo Photo { get; set; }
    }
}
