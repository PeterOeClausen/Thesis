using Microsoft.EntityFrameworkCore;
using ObjectCubeServer.Models;
using ObjectCubeServer.Models.DataAccess;
using ObjectCubeServer.Models.DomainClasses;
using ObjectCubeServer.Models.HelperClasses;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.PixelFormats;
using System;
using System.IO;
using System.Linq;

namespace ConsoleAppForInteractingWithDatabase
{
    public class LaugavegurDatasetInserter
    {
        public static void InsertLaugavegurDataset()
        {
            //Loading in images from dataset:
            string pathToDataset = @"D:\LaugavegurData"; //@"C:\ThesisDatasets\LaugavegurData";
            string pathToTagFile = @"D:\LaugavegurData\LaugavegurImageTags.csv";
            string pathToHierarchiesFile = @"D:\LaugavegurData\LaugavegurHierarchies.csv";
            string pathToErrorLogFile = @"C:\Users\peter\Desktop\FileLoadError.txt";
            File.AppendAllText(pathToErrorLogFile, "Errors goes here:\n");
            
            string[] files = Directory.GetFiles(pathToDataset);

            var insertCubeObjects = true;
            var insertTags = true;
            var insertHierarchies = true;

            if (insertCubeObjects)
            {
                InsertCubeObjects(pathToDataset);
            }
            else { Console.WriteLine("Skipping Photos"); }

            if (insertTags)
            {
                InsertTags(pathToTagFile, pathToErrorLogFile);
            }
            else { Console.WriteLine("Skipping Tags"); }

            if (insertHierarchies)
            {
                InsertHierarchies(pathToHierarchiesFile);
            }
            else { Console.WriteLine("Skipping Hierarchies"); }

            Console.WriteLine("Done with InsertLaugavegurDataset");
        }

        private static void InsertCubeObjects(string pathToDataset)
        {
            string[] files = Directory.GetFiles(pathToDataset);

            Console.WriteLine("Inserting photos as CubeObjects:");
            using (var context = new ObjectContext())
            {
                int fileCount = 1;
                foreach (string file in files)
                {
                    string filename = Path.GetFileName(file);
                    if (!filename.EndsWith(".csv"))
                    {
                        Console.WriteLine("Saving file: " + fileCount++ + " out of " + files.Length + " files. Filename: " + filename);
                        //If Image is already in database (Assuming no two file has the same name):
                        if (context.CubeObjects
                            .Include(co => co.Photo)
                            .FirstOrDefault(co => co.Photo.FileName.Equals(filename)) != null)
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

                                    //Add thumbnail to cubeobject here.
                                }
                            }
                        }
                    }
                }
            }
        }

        static void InsertTags(string pathToTagFile, string pathToErrorLogFile)
        {
            Console.WriteLine("Inserting TagsSets and Tags:");
            string[] linesInFile = File.ReadAllLines(pathToTagFile);
            int lineCount = 1;
            foreach (string line in linesInFile)
            {
                Console.WriteLine("Inserting line: " + lineCount++ + " out of " + linesInFile.Length);
                //File format: "FileName:TagSet:Tag:TagSet:Tag:(...)"
                string[] split = line.Split(":");
                string fileName = split[0];
                int numTagPairs = (split.Length - 2) / 2;
                for (int i = 0; i < numTagPairs; i++)
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
                            //Also creates a tag with same name:
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
                        if (!tagsetFromDb.Tags.Any(t => t.TagsetId == tagFromDb.Id)) //If tag does not exist in tagset, add it
                        {
                            HelperMethods.AddTagToTagset(tagFromDb, tagsetFromDb);
                            context.SaveChanges();
                        }

                        //Adding tag to cube object with FileName:
                        CubeObject cubeObjectFromDb = context.CubeObjects
                            .Include(co => co.Photo)
                            .Include(co => co.ObjectTagRelations)
                            .FirstOrDefault(co => co.Photo.FileName.Equals(fileName));

                        if (cubeObjectFromDb == null)
                        {
                            File.AppendAllText(pathToErrorLogFile, "Cube object with filename: " + fileName + " does not exist. Error occured while parsing line: " + lineCount + " in csv\n");
                        }
                        else
                        {
                            if (cubeObjectFromDb.ObjectTagRelations.FirstOrDefault(otr => otr.TagId == tagFromDb.Id) == null) //If Cubeobject does not already have tag asscociated with it, add it
                            {
                                HelperMethods.AddTagToObject(tagFromDb, cubeObjectFromDb);
                                context.SaveChanges();
                            }
                        }
                    }
                }
            }
        }

        private static void InsertHierarchies(string pathToHierarchiesFile)
        {
            Console.WriteLine("Inserting Hierarchies");
            string[] allLines = File.ReadAllLines(pathToHierarchiesFile)
                .Skip(1) //Skipping the first line cause it's documentation
                .ToArray();
            //File format: Parrent:IsRoot?:Child:Child:Child:(...)
            using (var context = new ObjectContext())
            {
                foreach (string line in allLines)
                {
                    string[] split = line.Split(":");
                    string parentNodeName = split[0];
                    bool isRoot = Boolean.Parse(split[1]);

                    if (isRoot) //Assuming tagset with same name must exist already.
                    {
                        /*
                         * Get tagset and tag.
                         * Create a new Hierarchy and add it to the Tagset.
                         * Create a new root node and add it to the Hierarchy.
                         * Loop through child tags, and create new nodes that point to root node.
                         * If child tag doesn't exist, create it.
                         */

                        Tagset tagsetFromDb = context.Tagsets
                            .Include(ts => ts.Tags)
                            .Include(ts => ts.Hierarchies)
                            .FirstOrDefault(ts => ts.Name.Equals(parentNodeName));
                        Tag tagFromDb = tagsetFromDb.Tags
                            .FirstOrDefault(t => t.Name.Equals(parentNodeName));

                        Hierarchy newHierarchy = DomainClassFactory.NewHierarchy(tagsetFromDb);
                        Node newRootNode = DomainClassFactory.NewRootNode(tagFromDb);
                        newHierarchy.RootNode = newRootNode;

                        tagsetFromDb.Hierarchies.Add(newHierarchy);
                        context.Hierarchies.Add(newHierarchy);

                        for (int i = 2; i < split.Length; i++)
                        {
                            var childNodeName = split[i];
                            Tag tagFromDbWithChildNodeName = tagsetFromDb.Tags
                                .FirstOrDefault(t => t.Name.Equals(childNodeName));
                            //If childTag does not exist:
                            if (tagFromDbWithChildNodeName == null)
                            {
                                tagFromDbWithChildNodeName = DomainClassFactory.NewTag(childNodeName, tagsetFromDb);
                                tagsetFromDb.Tags.Add(tagFromDbWithChildNodeName);
                                context.SaveChanges();
                            }
                            Node newChildNode = DomainClassFactory.NewNode(tagFromDbWithChildNodeName, newRootNode);
                            context.Nodes.Add(newChildNode);
                        }
                        context.SaveChanges();
                    }
                    else
                    {
                        //This can break...
                        Node parentNodeFromDb = context.Nodes
                            .Include(n => n.Tag)
                            .FirstOrDefault(n => n.Tag.Name.Equals(parentNodeName));
                        Tag tagFromDb = context.Tags
                            .Include(t => t.Tagset)
                            .FirstOrDefault(t => t.Id == parentNodeFromDb.TagId);
                        for (int i = 2; i < split.Length; i++)
                        {
                            var childTagName = split[i];
                            Tag childTagFromDb = context.Tags.FirstOrDefault(t => t.Name.Equals(childTagName));
                            //If childTag doesn't exist, create it:
                            if (childTagFromDb == null)
                            {
                                childTagFromDb = DomainClassFactory.NewTag(childTagName, tagFromDb.Tagset);
                                context.Tags.Add(childTagFromDb);
                                context.SaveChanges();
                            }
                            Node newChildNode = DomainClassFactory.NewNode(childTagFromDb, parentNodeFromDb);
                            context.Nodes.Add(newChildNode);
                        }
                        context.SaveChanges();
                    }
                }
            }
        }

    }
}
