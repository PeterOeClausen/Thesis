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
            tag.Tagset = tagset;
            tag.TagsetId = tagset.Id;
            tagset.Tags.Add(tag);
        }

        public static void AddTagToObject(Tag tag, CubeObject cubeObject)
        {
            tag.ObjectTagRelations.Add(new ObjectTagRelation()
            {
                CubeObject = cubeObject,
                Tag = tag
            });
        }

        public static void AddSubHierarchiesToSuperHierarchy(Hierarchy[] SubHierarchies, Hierarchy SuperHierarchy)
        {
            //Adding SubHierarchies to SuperHierarchy's subHierarchies:
            SuperHierarchy.SubHierarchies.AddRange(SubHierarchies);

            //Adding SuperHierarchies to SubHierarchies' superHierarchies:
            foreach(Hierarchy subH in SubHierarchies){
                subH.SuperHierarchies.Add(SuperHierarchy);
            }
        }
    }
}
