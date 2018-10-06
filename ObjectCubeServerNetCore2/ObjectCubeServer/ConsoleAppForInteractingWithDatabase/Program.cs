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
            Console.ReadKey();
        }

        static void InsertObject()
        {

            var anObject = new CubeObject {  };
            using( var context = new ObjectContext())
            {
                context.CubeObject.Add(anObject);
                context.SaveChanges();
            }
        }
    }
}
