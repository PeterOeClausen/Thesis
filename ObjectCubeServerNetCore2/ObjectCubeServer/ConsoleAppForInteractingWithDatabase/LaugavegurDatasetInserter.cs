using Microsoft.EntityFrameworkCore;
using ObjectCubeServer.Models;
using ObjectCubeServer.Models.DataAccess;
using ObjectCubeServer.Models.DomainClasses;
using ObjectCubeServer.Models.HelperClasses;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.PixelFormats;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace ConsoleAppForInteractingWithDatabase
{
    public class LaugavegurDatasetInserter
    {
        public static void InsertLaugavegurDataset()
        {
            //Loading in images from dataset:
            string pathToDataset = @"C:\ThesisDatasets\LaugavegurData";
            string pathToTagFile = @"C:\ThesisDatasets\LaugavegurData\LaugavegurImageTags.csv";
            string pathToHierarchiesFile = @"C:\ThesisDatasets\LaugavegurData\LaugavegurHierarchies.csv";
            string pathToErrorLogFile = @"C:\Users\PeterOeC\Desktop\FileLoadError.txt";
            File.AppendAllText(pathToErrorLogFile, "Errors goes here:\n");
            
            string[] files = Directory.GetFiles(pathToDataset);

            //int numFilesToBeInserted = 2;
            Console.WriteLine("Inserting photos as CubeObjects:");
            int fileCount = 1;
            using (var context = new ObjectContext())
            {
                List<CubeObject> cubeObjects = new List<CubeObject>();
                foreach (string file in files)
                {
                    string filename = Path.GetFileName(file);
                    if (!filename.EndsWith(".csv"))
                    {
                        Console.WriteLine("Saving file: " + fileCount++ + " out of " + files.Length + " files. Filename: " + filename);
                        //If Image is already in database:
                        if (context.CubeObjects.Include(co => co.Photo).FirstOrDefault(co => co.Photo.FileName.Equals(filename)) != null) 
                        {
                            //Don't add it again.
                            Console.WriteLine("Image " + filename + " is already in the database");
                        }
                        //Else add it:
                        else
                        {
                            //Loading and saving image:
                            using (Image<Rgba32> image = SixLabors.ImageSharp.Image.Load(file))
                            {
                                using (MemoryStream ms = new MemoryStream())
                                {
                                    image.SaveAsJpeg(ms); //Copy to ms
                                    //Create and save cubeObject:
                                    CubeObject cubeObject = DomainClassFactory.NewCubeObject(FileType.Photo, DomainClassFactory.NewPhoto(ms.ToArray(), Path.GetFileName(file)));
                                    context.CubeObjects.Add(cubeObject);
                                    context.SaveChanges();
                                }
                            }
                        }
                    }
                    /*
                    numFilesToBeInserted--;
                    if (numFilesToBeInserted == 0)
                    {
                        break;
                    }
                    */
                }
            }

            //Inserting tagsets and tags:
            Console.WriteLine("Inserting TagsSets and Tags:");
            string[] linesInFile = File.ReadAllLines(pathToTagFile);

            //int numIterations = 2;
            int lineCount = 1;
            foreach (string line in linesInFile)
            {
                Console.WriteLine("Inserting line: " + lineCount++ + " out of " + linesInFile.Length);
                //File format: "FileName:TagSet:Tag:TagSet:Tag:(...)"
                string[] split = line.Split(":");
                string fileName = split[0];
                int numTagPairs = (split.Length - 2) / 2;
                for(int i = 0; i < numTagPairs; i++)
                {
                    string tagsetName = split[(i * 2) + 1];
                    string tagName = split[(i * 2) + 2];
                    using (var context = new ObjectContext())
                    {
                        //Adding tagset to db:
                        Tagset tagsetFromDb = context.Tagsets
                            .Include(ts => ts.Tags)
                            .FirstOrDefault(ts => ts.Name == tagsetName);
                        //If tagset doesn't exist in db, add it:
                        if (tagsetFromDb == null) 
                        {
                            tagsetFromDb = DomainClassFactory.NewTagSet(tagsetName);
                            Tag tagWithSameNameAsTagset = DomainClassFactory.NewTag(tagsetName, tagsetFromDb);
                            HelperMethods.AddTagToTagset(tagWithSameNameAsTagset, tagsetFromDb);

                            context.Tagsets.Add(tagsetFromDb);
                            context.Tags.Add(tagWithSameNameAsTagset);
                            context.SaveChanges();
                        }

                        //Checking if tag exists, and creates it if it doesn't exist.
                        Tag tagFromDb = context.Tags
                            .Include(t => t.ObjectTagRelations)
                            .Where(t => t.TagsetId == tagsetFromDb.Id)
                            .FirstOrDefault(t => t.Name == tagName);
                        //If tag doesn't exist in db, add it
                        if (tagFromDb == null) 
                        {
                            tagFromDb = DomainClassFactory.NewTag(tagName, tagsetFromDb);
                            //Tag does not have id yet, so we need to save it before adding it to tagsetFromDb's collection...

                            context.Tags.Add(tagFromDb);
                            context.SaveChanges();
                        }

                        //Add tag to tagset if tagset doesn't have it:
                        if(!tagsetFromDb.Tags.Any(t => t.TagsetId == tagFromDb.Id)) //If tag does not exist in tagset, add it
                        {
                            HelperMethods.AddTagToTagset(tagFromDb, tagsetFromDb);
                            context.SaveChanges();
                        }

                        //Adding tag to cube object with FileName:
                        CubeObject cubeObjectFromDb = context.CubeObjects
                            .Include(co => co.Photo)
                            .Include(co => co.ObjectTagRelations)
                            .FirstOrDefault(co => co.Photo.FileName.Equals(fileName));
                        if(cubeObjectFromDb == null) //FileName does not exist in the database:
                        {
                            File.AppendAllText(pathToErrorLogFile, "Cube object with filename: " + fileName + " does not exist. Error occured while parsing line: " + lineCount + " in csv\n");
                        }
                        else
                        {
                            if(cubeObjectFromDb.ObjectTagRelations.FirstOrDefault(otr => otr.TagId == tagFromDb.Id) == null) //If Cubeobject does not already have tag asscociated with it, add it
                            {
                                HelperMethods.AddTagToObject(tagFromDb, cubeObjectFromDb);
                                context.SaveChanges();
                            }
                        }
                    }
                }

                /*
                numIterations--;
                if (numIterations == 0)
                {
                    break;
                }
                */
            }

            //Inserting hierarchies:
            Console.WriteLine("Inserting Hierarchies");
            string[] allLines = File.ReadAllLines(pathToHierarchiesFile)
                .Skip(1) //Skipping the first line cause it's documentation
                .ToArray();
            //File format: Parrent:IsRoot?:Child:Child:Child:(...)
            using (var context = new ObjectContext())
            {
                foreach(string line in allLines)
                {
                    string[] split = line.Split(":");
                    string parentHierarchyName = split[0];
                    bool isRoot = Boolean.Parse(split[1]);

                    //TODO: Consider changing file format: Delete isRoot and add Root:Parent:Child:Child. If Root == Parent then tagset must exist.
                    //TODO: Change ObjectContext.
                    //TODO: Add migration and update db. - First check that everything compiles!
                    if (isRoot) //Tagset with same name must exist already.
                    {
                        Tagset tagsetFromDb = context.Tagsets.FirstOrDefault(ts => ts.Name.Equals(parentHierarchyName));
                        Tag tagFromDb = context.Tags.FirstOrDefault(t => t.Name.Equals(parentHierarchyName));
                        DomainClassFactory.NewHierarchy
                    }
                    else //Find tag that it refers to... Maybe better to change file format.
                    {
                        Tag tagFromDb = context.Tags.FirstOrDefault(t => t.Name.Equals(parentHierarchyName));

                    }
                    

                    //Assumption: No tag can have the same name.
                    Hierarchy hierarchy = context.Hierarchies.FirstOrDefault(h => h.Name == superHierarchyName);
                    if(hierarchy == null)
                    {
                        Tag tag = context.Tags.FirstOrDefault(t => t.Name == superHierarchyName);

                    }

                    Tagset tagSet = context.Tagsets.FirstOrDefault(ts => ts.Name == superHierarchyName);
                    
                    
                    //Remember to add migration and update db.
                    if(tagSet != null) // If a tagSet exists with the name:
                    {
                        
                    }
                    else
                    {
                        Tag tag = context.Tags.FirstOrDefault(t => t.Name == superHierarchyName);

                    }
                }

                Tagset HikeTagSet = context.Tagsets.FirstOrDefault(ts => ts.Name == "Hike");

                Tag Day1Tag = context.Tags.FirstOrDefault(ts => ts.Name == "Day 1");
                Tag Day2Tag = context.Tags.FirstOrDefault(ts => ts.Name == "Day 2");
                Tag Day3Tag = context.Tags.FirstOrDefault(ts => ts.Name == "Day 3");
                Tag Day4Tag = context.Tags.FirstOrDefault(ts => ts.Name == "Day 4");
                Tag Day5Tag = context.Tags.FirstOrDefault(ts => ts.Name == "Day 5");

                Hierarchy HikeHierarchy = DomainClassFactory.NewHierarchy(DomainClassFactory.NewTag("Hike"));
                Hierarchy[] DayHierarchies = new Hierarchy[] {
                    DomainClassFactory.NewHierarchy(Day1Tag),
                    DomainClassFactory.NewHierarchy(Day2Tag),
                    DomainClassFactory.NewHierarchy(Day3Tag),
                    DomainClassFactory.NewHierarchy(Day4Tag),
                    DomainClassFactory.NewHierarchy(Day5Tag)
                };

                HelperMethods.AddSubHierarchiesToSuperHierarchy(DayHierarchies,HikeHierarchy);

                context.Hierarchies.Add(HikeHierarchy);
                context.Hierarchies.AddRange(DayHierarchies);
                context.SaveChanges();
            }
        }
    }
}
