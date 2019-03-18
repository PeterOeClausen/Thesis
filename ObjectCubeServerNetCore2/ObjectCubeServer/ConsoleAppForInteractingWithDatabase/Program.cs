using ObjectCubeServer.Models;
using ObjectCubeServer.Models.DataAccess;
using ObjectCubeServer.Models.DomainClasses;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;

namespace ConsoleAppForInteractingWithDatabase
{
    /// <summary>
    /// Program that parses and adds the Laugavegur data to the database.
    /// </summary>
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("Started up!");
            Stopwatch stopWatch = new Stopwatch();
            stopWatch.Start();

            //Insert data:
            LaugavegurDatasetInserter.InsertLaugavegurDataset();
            
            // Get the elapsed time as a TimeSpan value.
            TimeSpan ts = stopWatch.Elapsed;
            string elapsedTime = String.Format("{0:00}:{1:00}:{2:00}",
                ts.Hours, ts.Minutes, ts.Seconds);

            Console.WriteLine("Done! Took: " + elapsedTime + " in format: hh:mm:ss");
            Console.WriteLine("Press any key to shut down.");
            Console.ReadKey();
        }
    }
}
