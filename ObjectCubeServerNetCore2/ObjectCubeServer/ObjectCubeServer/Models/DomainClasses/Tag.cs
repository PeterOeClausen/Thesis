using System.Collections.Generic;

namespace ObjectCubeServer.Models.DomainClasses
{
    public class Tag
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public List<ObjectTagRelation> ObjectTagRelations { get; set; }
        public List<TagTagsetRelation> TagTagsetRelations { get; set; } //Should be renamed to TagTagsetRelations

        /*
        public Tag(string Name)
        {
            this.Name = Name;
            this.ObjectTagRelations = new List<ObjectTagRelation>();
            this.TagTagsetRelations = new List<TagTagsetRelation>();
        }
        */
    }
}