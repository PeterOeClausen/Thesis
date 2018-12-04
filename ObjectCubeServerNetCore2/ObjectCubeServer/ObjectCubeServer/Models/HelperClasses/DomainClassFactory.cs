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
                ObjectTagRelations = new List<ObjectTagRelation>()
            };
        }

        public static ObjectTagRelation NewObjectTagRelation(Tag tag, CubeObject cubeObject)
        {
            return new ObjectTagRelation()
            {
                CubeObject = cubeObject,
                Tag = tag
            };
        }

        public static Hierarchy NewHierarchy(Tagset tagset)
        {
            return new Hierarchy()
            {
                Name = tagset.Name,
                Tagset = tagset,
                Nodes = new List<Node>()
            };
        }

        public static Node NewRootNode(Tag tag, Hierarchy hierarchy)
        {
            if (tag == null) { throw new Exception("Tag is null!"); }
            if (hierarchy == null) { throw new Exception("Hierarchy is null!"); }
            return new Node()
            {
                Tag = tag,
                Hierarchy = hierarchy
            };
        }

        public static Node NewNode(Tag tag, Hierarchy hierarchy, Node parent)
        {
            if(tag == null) { throw new Exception("Tag is null!"); }
            if (hierarchy == null) { throw new Exception("Hierarchy is null!"); }
            return new Node()
            {
                Tag = tag,
                Hierarchy = hierarchy,
                Parent = parent
            };
        }
    }
}
