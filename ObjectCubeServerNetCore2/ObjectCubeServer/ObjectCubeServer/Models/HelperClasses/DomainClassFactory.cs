using ObjectCubeServer.Models.DomainClasses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ObjectCubeServer.Models
{
    public class DomainClassFactory
    {
        public static CubeObject NewCubeObject(FileType fileType, Photo photo)
        {
            return new CubeObject()
            {
                FileType = fileType,
                Photo = photo,
                ObjectTagRelations = new List<ObjectTagRelation>()
            };
        }

        public static Tag NewTag(string name, Tagset tagset)
        {
            return new Tag()
            {
                Name = name,
                Tagset = tagset,
                TagsetId = tagset.Id,
                ObjectTagRelations = new List<ObjectTagRelation>()
            };
        }

        public static Tagset NewTagSet(string name)
        {
            return new Tagset() {
                Name = name,
                Tags = new List<Tag>(),
                HierarchyRoots = new List<Hierarchy>()
            };
        }

        public static Hierarchy NewHierarchy(Tag tag, Tagset tagset, Hierarchy parent)
        {
            return new Hierarchy()
            {
                Name = tag.Name,
                Tag = tag,
                TagId = tag.Id,
                Tagset = tagset,
                TagsetId = tagset.Id,
                ParentHierarchy = parent,
                ChildHierarchies = new List<Hierarchy>()
            };
        }

        public static Photo NewPhoto(byte[] image, string fileName)
        {
            return new Photo()
            {
                Image = image,
                FileName = fileName
            };
        }
    }
}
