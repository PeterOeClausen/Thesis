using System.Collections.Generic;

namespace ObjectCubeServer.Models.DomainClasses
{
    public class Tag
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public List<ObjectTagRelation> ObjectTags { get; set; }
        public List<TagTagsetRelation> TagSets { get; set; }
    }
}