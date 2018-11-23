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

        public static Photo NewPhoto(byte[] image, string fileName)
        {
            return new Photo()
            {
                Image = image,
                FileName = fileName
            };
        }

        public static Tagset NewTagSet(string name)
        {
            return new Tagset()
            {
                Name = name,
                Tags = new List<Tag>(),
                Hierarchies = new List<Hierarchy>()
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

        public static Hierarchy NewHierarchy(Tagset tagset)
        {
            return new Hierarchy()
            {
                Tagset = tagset,
                TagsetId = tagset.Id,
                Name = tagset.Name
            };
        }

        public static Node NewRootNode(Tag tag)
        {
            return new Node()
            {
                Tag = tag
            };
        }

        public static Node NewNode(Tag tag, Node parent)
        {
            return new Node()
            {
                Tag = tag,
                Parent = parent
            };
        }
    }
}
