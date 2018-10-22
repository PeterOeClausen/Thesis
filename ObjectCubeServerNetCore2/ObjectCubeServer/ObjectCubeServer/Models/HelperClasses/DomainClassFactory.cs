using ObjectCubeServer.Models.DomainClasses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ObjectCubeServer.Models
{
    public class DomainClassFactory
    {
        public static CubeObject NewCubeObject()
        {
            return null;
        }

        public static Tag NewTag(string name)
        {
            return new Tag()
            {
                Name = name,
                ObjectTagRelations = new List<ObjectTagRelation>(),
                TagTagsetRelations = new List<TagTagsetRelation>()
            };
        }

        public static Tagset NewTagSet(string name)
        {
            return new Tagset()
            {
                Name = name,
                Hierarchy = new Hierarchy(),
                TagTagsetRelations = new List<TagTagsetRelation>()
            };
        }

        public static TagTagsetRelation NewTagTagsetRelation(Tag tag, Tagset tagset)
        {
            return new TagTagsetRelation()
            {
                Tag = tag,
                Tagset = tagset
            };
        }
    }
}
