using ObjectCubeServer.Models;
using ObjectCubeServer.Models.DataAccess;
using ObjectCubeServer.Models.DomainClasses;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;

namespace ConsoleAppForInteractingWithDatabase
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("Started up!");
            Stopwatch stopWatch = new Stopwatch();
            stopWatch.Start();
            //JamesWhiteDatasetInserter.InsertJamesWhiteDataset();
            LaugavegurDatasetInserter.InsertLaugavegurDataset();
            
            // Get the elapsed time as a TimeSpan value.
            TimeSpan ts = stopWatch.Elapsed;
            string elapsedTime = String.Format("{0:00}:{1:00}:{2:00}",
                ts.Hours, ts.Minutes, ts.Seconds);

            Console.WriteLine("Done! Took: " + elapsedTime + " in format: hh:mm:ss");
            Console.WriteLine("Press any key to shut down.");
            Console.ReadKey();
        }

        static void InsertObject()
        {
            var anObject = new CubeObject {
                FileType = FileType.Photo,
                ObjectTagRelations = new System.Collections.Generic.List<ObjectTagRelation>() { },
                Photo = new Photo() { }
            };
            using( var context = new ObjectContext())
            {
                context.CubeObjects.Add(anObject);
                context.SaveChanges();
            }
        }

        static void GetAllObjects()
        {
            using (var context = new ObjectContext())
            {
                var cubeObjects = context.CubeObjects.ToList();
                cubeObjects.ForEach(co => Console.WriteLine(co.Id));
            }
        }

        static void DeleteAllObjects()
        {
            using (var context = new ObjectContext())
            {
                var allCubeObjects = context.CubeObjects.ToList();
                context.CubeObjects.RemoveRange(allCubeObjects);
                context.SaveChanges();
            }
        }
    }
}
