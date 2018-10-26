using ObjectCubeServer.Models.DomainClasses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ObjectCubeServer.Models.HelperClasses
{
    public class HelperMethods
    {
        public static void AddTagToTagset(Tag tag, Tagset tagset)
        {
            tag.TagTagsetRelations.Add(new TagTagsetRelation()
            {
                Tag = tag,
                Tagset = tagset
            });
        }

        public static void AddTagToObject(Tag tag, CubeObject cubeObject)
        {
            tag.ObjectTagRelations.Add(new ObjectTagRelation()
            {
                CubeObject = cubeObject,
                Tag = tag
            });
        }
    }
}
