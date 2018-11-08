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
            string[] files = Directory.GetFiles(pathToDataset);

            int numFilesToBeInserted = 2;
            Console.WriteLine("Inserting images:");
            using (var context = new ObjectContext())
            {
                List<CubeObject> cubeObjects = new List<CubeObject>();
                foreach (string file in files)
                {
                    string filename = Path.GetFileName(file);
                    if (!filename.Equals("LaugavegurImageTags.csv"))
                    {
                        Console.WriteLine(filename);
                        CubeObject cubeObject = DomainClassFactory.NewCubeObject();
                        //Loading and saving image:
                        using (Image<Rgba32> image = SixLabors.ImageSharp.Image.Load(file))
                        {
                            using (MemoryStream ms = new MemoryStream())
                            {
                                image.SaveAsJpeg(ms); //Copy to ms
                                cubeObject.FileType = FileType.Photo;
                                cubeObject.Photo = new Photo()
                                {
                                    FileName = Path.GetFileName(file),
                                    Image = ms.ToArray()
                                };
                            }
                        }
                        context.CubeObjects.Add(cubeObject);
                        context.SaveChanges();
                    }
                    numFilesToBeInserted--;
                    if (numFilesToBeInserted == 0)
                    {
                        break;
                    }
                }
            }
            
            //Loading in tags and tagssets:
            string pathToTagFile = @"C:\ThesisDatasets\LaugavegurData\LaugavegurImageTags.csv";
            string[] linesInFile = File.ReadAllLines(pathToTagFile);

            int numIterations = 2;
            foreach (string line in linesInFile)
            {
                string[] split = line.Split(":");
                string fileName = split[0];
                int numTagPairs = (split.Length - 2) / 2;
                for(int i = 0; i < numTagPairs; i++)
                {
                    string tagsetName = split[(i * 2) + 1];
                    string tagName = split[(i * 2) + 2];
                    using (var context = new ObjectContext())
                    {
                        Tagset tagsetFromDb = context.Tagsets
                            .Include(ts => ts.TagTagsetRelations)
                            .FirstOrDefault(ts => ts.Name == tagsetName);
                        if (tagsetFromDb == null) //If tagset doesn't exist in db, add it
                        {
                            tagsetFromDb = DomainClassFactory.NewTagSet(tagsetName);
                            context.Tagsets.Add(tagsetFromDb);
                            context.SaveChanges();
                        }

                        Tag tagFromDb = context.Tags
                            .Include(t => t.ObjectTagRelations)
                            .Include(t => t.TagTagsetRelations)
                            .FirstOrDefault(t => t.Name == tagName);
                        if (tagFromDb == null) //If tag doesn't exist in db, add it
                        {
                            tagFromDb = DomainClassFactory.NewTag(tagName);
                            context.Tags.Add(tagFromDb);
                            context.SaveChanges();
                        }

                        if(!tagsetFromDb.TagTagsetRelations.Any(ttr => ttr.TagId == tagFromDb.Id)) //If tag does not exist in tagset
                        {
                            HelperMethods.AddTagToTagset(tagFromDb, tagsetFromDb);
                            context.SaveChanges();
                        }

                        CubeObject cubeObjectFromDb = context.CubeObjects
                            .Include(co => co.Photo)
                            .FirstOrDefault(co => co.Photo.FileName.Equals(fileName));

                        HelperMethods.AddTagToObject(tagFromDb, cubeObjectFromDb);
                        context.SaveChanges();
                    }
                }

                numIterations--;
                if (numIterations == 0)
                {
                    break;
                }
            }
            
        }
    }
}
