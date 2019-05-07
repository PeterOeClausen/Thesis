using ObjectCubeServer.Models.DomainClasses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ObjectCubeServer.Models
{
    /// <summary>
    /// Simplifies the creation of DomainClasses.
    /// Used in LaugavegurDatasetInserter.
    /// Also, DomainClasses can't have constructures cause it would interfere with EF CORE.
    /// </summary>
    public class DomainClassFactory
    {
        public static CubeObject NewCubeObject(string fileName, FileType fileType, Photo photo)
        {
            if (fileName == null) { throw new Exception("Given fileName was null."); }
            if (photo == null) { throw new Exception("Given photo  was null."); }
            return new CubeObject()
            {
                FileName = fileName,
                FileType = fileType,
                Photo = photo,
                ObjectTagRelations = new List<ObjectTagRelation>()
            };
        }

        public static Photo NewPhoto(byte[] image, string fileName)
        {
            if (image == null) { throw new Exception("Given image was null."); }
            if (fileName == null) { throw new Exception("Given fileName was null."); }
            return new Photo()
            {
                Image = image,
                FileName = fileName
            };
        }

        public static Tagset NewTagSet(string name)
        {
            if (name == null) { throw new Exception("Given name was null."); }
            return new Tagset()
            {
                Name = name,
                Tags = new List<Tag>(),
                Hierarchies = new List<Hierarchy>()
            };
        }

        public static Tag NewTag(string name, Tagset tagset)
        {
            if (name == null) { throw new Exception("Given name was null."); }
            if (tagset == null) { throw new Exception("Given tagset was null."); }
            return new Tag()
            {
                Name = name,
                Tagset = tagset,
                ObjectTagRelations = new List<ObjectTagRelation>()
            };
        }

        public static Hierarchy NewHierarchy(Tagset tagset)
        {
            if (tagset == null) { throw new Exception("Given tagset was null."); }
            return new Hierarchy()
            {
                Name = tagset.Name,
                Tagset = tagset,
                Nodes = new List<Node>()
            };
        }

        public static Node NewNode(Tag tag, Hierarchy hierarchy)
        {
            if (tag == null) { throw new Exception("Given tag was null."); }
            if (hierarchy == null) { throw new Exception("Given hierarchy was null."); }
            return new Node()
            {
                Tag = tag,
                Hierarchy = hierarchy,
                Children = new List<Node>()
            };
        }

        public static ObjectTagRelation NewObjectTagRelation(Tag tag, CubeObject cubeObject)
        {
            if (tag == null) { throw new Exception("Given tag was null."); }
            if (cubeObject == null) { throw new Exception("Given cubeObject was null."); }
            return new ObjectTagRelation()
            {
                CubeObject = cubeObject,
                Tag = tag
            };
        }
    }
}
