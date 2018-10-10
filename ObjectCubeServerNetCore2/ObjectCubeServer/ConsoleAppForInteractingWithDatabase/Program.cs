using ObjectCubeServer.Models.DataAccess;
using ObjectCubeServer.Models.DomainClasses;
using System;

namespace ConsoleAppForInteractingWithDatabase
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("Hello World!");
            InsertObject();
            Console.WriteLine("Done!");
            Console.ReadKey();
        }

        static void InsertObject()
        {
            var anObject = new CubeObject {
                FileType = FileType.Photo,
                ObjectTags = new System.Collections.Generic.List<ObjectTagRelation>() { },
                Photo = new Photo() { }
            };
            using( var context = new ObjectContext())
            {
                context.CubeObjects.Add(anObject);
                context.SaveChanges();
            }
        }
    }
}
