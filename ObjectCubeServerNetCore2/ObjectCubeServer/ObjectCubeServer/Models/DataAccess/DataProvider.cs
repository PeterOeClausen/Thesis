using ObjectCubeServer.Models.DomainClasses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ObjectCubeServer.Models.DataAccess
{
    public class DataProvider
    {
        public static void EmptyAllTables()
        {
            using (var context = new ObjectContext())
            {
                var allCubeObjects = context.CubeObjects.ToList();
                context.CubeObjects.RemoveRange(allCubeObjects);

                var allTags = context.Tags.ToList();
                context.Tags.RemoveRange(allTags);

                var allTagsets = context.Tagsets.ToList();
                context.Tagsets.RemoveRange(allTagsets);

                var allHierarchies = context.Hierarchies.ToList();
                context.Hierarchies.RemoveRange(allHierarchies);

                context.SaveChanges();
            }
        }

        public static List<CubeObject> GetAllCubeObjects()
        {
            List<CubeObject> allCubeObjects;
            using (var context = new ObjectContext())
            {
                allCubeObjects = context.CubeObjects.ToList();
            }
            return allCubeObjects;
        }

        public static List<Tag> GetAllTags()
        {
            List<Tag> allTags;
            using (var context = new ObjectContext())
            {
                allTags = context.Tags.ToList();
            }
            return allTags;
        }

        public static List<Tagset> GetAllTagsets()
        {
            List<Tagset> allTagsets;
            using (var context = new ObjectContext())
            {
                allTagsets = context.Tagsets.ToList();
            }
            return allTagsets;
        }

        public static List<Hierarchy> GetAllHierarchies()
        {
            List<Hierarchy> allHierarchies;
            using (var context = new ObjectContext())
            {
                allHierarchies = context.Hierarchies.ToList();
            }
            return allHierarchies;
        }


    }
}
