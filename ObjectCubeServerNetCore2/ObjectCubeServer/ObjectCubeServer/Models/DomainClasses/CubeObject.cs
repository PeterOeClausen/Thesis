using System.Collections.Generic;

namespace ObjectCubeServer.Models.DomainClasses
{
    public class CubeObject
    {
        public int Id { get; set; }
        public FileType FileType { get; set; }
        public Photo Photo { get; set; }
        public List<ObjectTagRelation> ObjectTagRelations { get; set; }
    }
}
