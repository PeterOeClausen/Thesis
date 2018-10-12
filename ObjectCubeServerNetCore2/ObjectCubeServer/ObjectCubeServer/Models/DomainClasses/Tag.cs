using System.Collections.Generic;

namespace ObjectCubeServer.Models.DomainClasses
{
    public class Tag
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public List<ObjectTagRelation> ObjectTags { get; set; }
        public List<TagTagsetRelation> TagSets { get; set; }

        /*
        public Tag(string Name)
        {
            this.Name = Name;
            this.ObjectTags = new List<ObjectTagRelation>();
            this.TagSets = new List<TagTagsetRelation>();
        }
        */
    }
}