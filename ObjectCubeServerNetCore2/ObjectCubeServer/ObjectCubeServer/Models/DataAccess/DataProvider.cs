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

        #region GetAll methods
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
        #endregion GetAll

        #region GetWhere
        public static Tag GetTagWhereNameEquals(Predicate<string> p)
        {
            Tag foundTag;
            using (var context = new ObjectContext())
            {
                foundTag = context.Tags.Where(t => p(t.Name)).Single();
            }
            return foundTag;
        }

        public static Tagset GetTagSetWhereNameEquals(Predicate<string> p)
        {
            Tagset foundTagset;
            using (var context = new ObjectContext())
            {
                foundTagset = context.Tagsets.Where(t => p(t.Name)).Single();
            }
            return foundTagset;
        }
        #endregion GetWhere

        #region InsertMethods
        

        public static void InsertTag(Tag tag)
        {
            using (var context = new ObjectContext())
            {
                context.Tags.Add(tag);
                context.SaveChanges();
            }
        }

        public static void InsertManyTags(params Tag[] tags)
        {
            using (var context = new ObjectContext())
            {
                context.Tags.AddRange(tags);
                context.SaveChanges();
            }
        }

        public static Tagset InsertTagset(string name)
        {
            Tagset tagset = new Tagset() { Name = name, TagTagsetRelations = new List<TagTagsetRelation>() };
            using (var context = new ObjectContext())
            {
                context.Tagsets.Add(tagset);
                context.SaveChanges();
            }
            return tagset;
        }

        public static void InsertTagTagsetRelation(TagTagsetRelation tagTagsetRelation)
        {
            using (var context = new ObjectContext())
            {
                context.TagTagsetRelations.Add(tagTagsetRelation);
                context.SaveChanges();
            }
        }
        #endregion

    }
}
