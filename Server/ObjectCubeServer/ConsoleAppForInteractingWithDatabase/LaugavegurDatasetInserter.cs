using Microsoft.EntityFrameworkCore;
using ObjectCubeServer.Models;
using ObjectCubeServer.Models.DataAccess;
using ObjectCubeServer.Models.DomainClasses;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.PixelFormats;
using SixLabors.ImageSharp.Processing;
using System;
using System.IO;
using System.Linq;

namespace ConsoleAppForInteractingWithDatabase
{
    public class LaugavegurDatasetInserter
    {
        public static void InsertLaugavegurDataset()
        {
            string pathToDataset;
            string pathToTagFile;
            string pathToHierarchiesFile;
            string pathToErrorLogFile;

            string computerName = System.Environment.MachineName;
            switch (computerName)
            {
                case "DESKTOP-T7BC3Q4": //Desktop
                    pathToDataset = @"D:\LaugavegurData";
                    break;
                case "DESKTOP-EO6T94J": //Laptop
                    pathToDataset = @"C:\LaugavegurData2\LaugavegurData";
                    break;
                default:
                    throw new Exception("ComputerName is unknown, please specify path to dataset!");
                    pathToDataset = @"?";
                    break;
            }

            pathToTagFile = Path.Combine(pathToDataset, @"LaugavegurImageTags.csv");
            pathToHierarchiesFile = Path.Combine(pathToDataset, @"LaugavegurHierarchiesV2.csv");
            pathToErrorLogFile = Path.Combine(pathToDataset, @"ErrorLogFiles\FileLoadError.txt");

            File.AppendAllText(pathToErrorLogFile, "Errors goes here:\n");
            
            //Loading in images from dataset:
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

        /// <summary>
        /// Parses and inserts cube objects, photos and thumbnails.
        /// </summary>
        /// <param name="pathToDataset"></param>
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
                        Console.WriteLine("Saving file: " + fileCount++ + 
                            " out of " + files.Length + " files. " +
                            "Filename: " + filename + 
                            ". (" + (((double)fileCount / (double)files.Length)*100).ToString("0.0") + @"%)");
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
                                    
                                    //Create Cube and Photo objects:
                                    CubeObject cubeObject = DomainClassFactory.NewCubeObject(
                                        filename,
                                        FileType.Photo, 
                                        DomainClassFactory.NewPhoto(
                                            ms.ToArray(),
                                            filename
                                        )
                                    );

                                    //Creating and saving thumbnail:
                                    //Thumbnails needs to be power of two in width and height to avoid extra image manipulation client side.
                                    if(image.Width > image.Height)
                                    {
                                        int destinationHeight = 1024; //1024px
                                        decimal downscaleFactor = Decimal.Parse(destinationHeight + "") / Decimal.Parse(image.Height + "");
                                        int newWidth = (int)(image.Width * downscaleFactor);
                                        int newHeight = (int)(image.Height * downscaleFactor);
                                        image.Mutate(i => i
                                            .Resize(newWidth, newHeight)                //Scale
                                            .Crop(destinationHeight, destinationHeight) //Crop
                                        );
                                    }
                                    else
                                    {
                                        int destinationWidth = 1024; //1024px
                                        decimal downscaleFactor = Decimal.Parse(destinationWidth+"") / Decimal.Parse(image.Width+"");
                                        int newWidth = (int)(image.Width * downscaleFactor);
                                        int newHeight = (int)(image.Height * downscaleFactor);
                                        image.Mutate(i => i
                                            .Resize(newWidth, newHeight)                //Scale
                                            .Crop(destinationWidth, destinationWidth)   //Crop
                                        );
                                    }

                                    //int destinationWidth = 1024; //1024px
                                    //decimal downscaleFactor = Decimal.Parse(destinationWidth+"") / Decimal.Parse(image.Width+"");
                                    //int newWidth = (int)(image.Width * downscaleFactor);
                                    //int newHeight = (int)(image.Height * downscaleFactor);
                                    //image.Mutate(i => i
                                    //    .Resize(newWidth, newHeight));
                                    using (MemoryStream ms2 = new MemoryStream())
                                    {
                                        image.SaveAsJpeg(ms2); //Copy to ms
                                        cubeObject.Thumbnail = new Thumbnail() { Image = ms2.ToArray() };
                                    }

                                    //Save cube object: 
                                    context.CubeObjects.Add(cubeObject);
                                    context.SaveChanges();
                                }
                            }
                        }
                    }
                }
            }
        }

        /// <summary>
        /// Parses and inserts tags and tagsets. Also tags Photos.
        /// </summary>
        /// <param name="pathToTagFile"></param>
        /// <param name="pathToErrorLogFile"></param>
        static void InsertTags(string pathToTagFile, string pathToErrorLogFile)
        {
            Console.WriteLine("Inserting TagsSets and Tags:");
            int lineCount = 1;
            string[] linesInFile = File.ReadAllLines(pathToTagFile);
            //Looping over each line in the tag file.
            foreach (string line in linesInFile)
            {
                Console.WriteLine("Inserting line: " + lineCount++ + " out of " + linesInFile.Length);
                //File format: "FileName:TagSet:Tag:TagSet:Tag:(...)"
                string[] split = line.Split(":");
                string fileName = split[0];
                int numTagPairs = (split.Length - 2) / 2;
                //Looping over each pair of tags:
                for (int i = 0; i < numTagPairs; i++)
                {
                    string tagsetName = split[(i * 2) + 1];
                    string tagName = split[(i * 2) + 2];

                    using (var context = new ObjectContext())
                    {
                        //Adding tagset to db:
                        Tagset tagsetFromDb = context.Tagsets
                            .Where(ts => ts.Name.Equals(tagsetName))
                            .Include(ts => ts.Tags)
                            .FirstOrDefault();
                        
                        //If tagset doesn't exist in db, add it:
                        if (tagsetFromDb == null)
                        {
                            tagsetFromDb = DomainClassFactory.NewTagSet(tagsetName);
                            context.Tagsets.Add(tagsetFromDb);
                            context.SaveChanges();

                            //Also creates a tag with same name:
                            Tag tagWithSameNameAsTagset = DomainClassFactory.NewTag(tagsetName, tagsetFromDb);
                            //Add tag to tagset:
                            tagWithSameNameAsTagset.Tagset = tagsetFromDb;
                            tagsetFromDb.Tags.Add(tagWithSameNameAsTagset);
                            //Add and update changes:
                            context.Tags.Add(tagWithSameNameAsTagset);
                            context.SaveChanges();
                        }

                        //Checking if tag exists, and creates it if it doesn't exist.
                        Tag tagFromDb = context.Tags
                            .Where(t => t.TagsetId == tagsetFromDb.Id && t.Name.Equals(tagName))
                            .Include(t => t.ObjectTagRelations)
                            .FirstOrDefault();
                        
                        //If tag doesn't exist in db, add it
                        if (tagFromDb == null)
                        {
                            tagFromDb = DomainClassFactory.NewTag(tagName, tagsetFromDb);
                            context.Tags.Add(tagFromDb);
                            context.SaveChanges();
                        }

                        //Add tag to tagset if tagset doesn't have it:
                        if (!tagsetFromDb.Tags
                            .Any(t => t.TagsetId == tagFromDb.Id)) //If tag does not exist in tagset, add it
                        {
                            tagsetFromDb.Tags.Add(tagFromDb);
                            tagFromDb.Tagset = tagsetFromDb;
                            context.Update(tagsetFromDb);
                            context.Update(tagFromDb);
                            context.SaveChanges();
                        }

                        //Adding tag to cube object with FileName:
                        CubeObject cubeObjectFromDb = context.CubeObjects
                            .Where(co => co.Photo.FileName.Equals(fileName))
                            .Include(co => co.Photo)
                            .Include(co => co.ObjectTagRelations)
                            .FirstOrDefault();

                        if (cubeObjectFromDb == null)
                        {
                            File.AppendAllText(pathToErrorLogFile, "File " + fileName + " was not found while parsing line " + lineCount);
                            //throw new Exception("Expected cubeobject to be in the DB already, but it isn't!");
                        }
                        else
                        {
                            if (cubeObjectFromDb.ObjectTagRelations
                                .FirstOrDefault(otr => otr.TagId == tagFromDb.Id) == null) //If Cubeobject does not already have tag asscociated with it, add it
                            {
                                ObjectTagRelation newObjectTagRelation = DomainClassFactory.NewObjectTagRelation(tagFromDb, cubeObjectFromDb);
                                context.ObjectTagRelations.Add(newObjectTagRelation);
                                context.SaveChanges();
                            }
                        }
                    }
                }
            }
        }

        /// <summary>
        /// Inserts hierarchies
        /// </summary>
        /// <param name="pathToHierarchiesFile"></param>
        private static void InsertHierarchies(string pathToHierarchiesFile)
        {
            Console.WriteLine("Inserting Hierarchies");
            string[] allLines = File.ReadAllLines(pathToHierarchiesFile)
                .Skip(1) //Skipping the first line cause it's documentation
                .ToArray();

            int lineCount = 1;
            foreach (string line in allLines)
            {
                Console.WriteLine("Inserting line number: " + lineCount);

                //File format: TagsetName:HierarchyName:ParrentTag:ChildTag:ChildTag:ChildTag:(...)
                string[] split = line.Split(":");
                string tagsetName = split[0];
                string hierarchyName = split[1];
                string parentTagName = split[2];

                using (var context = new ObjectContext())
                {
                    //Finding tagset:
                    Tagset tagsetFromDb = context.Tagsets
                            .Where(ts => ts.Name.Equals(tagsetName))
                            .Include(ts => ts.Tags)
                            .Include(ts => ts.Hierarchies)
                            .FirstOrDefault();

                    //See if hierarchy exists:
                    Hierarchy hierarchyFromDb = context.Hierarchies
                        .Include(h => h.Nodes)
                        .Where(h => h.Name.Equals(hierarchyName))
                        .FirstOrDefault();

                    //If hierarchyFromDb does not exist, create it:
                    if (hierarchyFromDb == null)
                    {
                        hierarchyFromDb = DomainClassFactory.NewHierarchy(tagsetFromDb);
                        tagsetFromDb.Hierarchies.Add(hierarchyFromDb);
                        //hierarchyFromDb.Tagset = tagsetFromDb;
                        context.Update(tagsetFromDb);
                        context.Update(hierarchyFromDb);
                        context.SaveChanges();
                    }

                    //Finding parent tag:
                    Tag parentTagFromDb = context.Tags
                        .Where(t => t.TagsetId == tagsetFromDb.Id && t.Name.Equals(parentTagName))
                        .FirstOrDefault();

                    //If parentTag does not exist, create it:
                    if(parentTagFromDb == null)
                    {
                        parentTagFromDb = DomainClassFactory.NewTag(parentTagName, tagsetFromDb);
                        tagsetFromDb.Tags.Add(parentTagFromDb);
                        context.Tags.Add(parentTagFromDb);
                        context.Update(tagsetFromDb);
                        context.SaveChanges();
                    }

                    //Finding parent node:
                    Node parentNodeFromDb = context.Nodes
                        .Include(n => n.Children)
                        .Where(n => n.HierarchyId == hierarchyFromDb.Id && n.TagId == parentTagFromDb.Id)
                        .FirstOrDefault();

                    //If parent node does not exist, create it:
                    if(parentNodeFromDb == null)
                    {
                        //Probably root node:
                        parentNodeFromDb = DomainClassFactory.NewNode(parentTagFromDb, hierarchyFromDb);
                        hierarchyFromDb.Nodes.Add(parentNodeFromDb);
                        context.Update(hierarchyFromDb);
                        context.SaveChanges();

                        hierarchyFromDb.RootNodeId = parentNodeFromDb.Id;
                        context.Update(hierarchyFromDb);
                        context.SaveChanges();
                    }
                    
                    //Adding child nodes:
                    for (int i = 3; i < split.Length; i++)
                    {
                        string childTagName = split[i];

                        Tag childTagFromDb = context.Tags
                            .Where(t => t.TagsetId == tagsetFromDb.Id && t.Name.Equals(childTagName))
                            .FirstOrDefault();

                        //If child tag does not exist, create it:
                        if(childTagFromDb == null)
                        {
                            childTagFromDb = DomainClassFactory.NewTag(childTagName, tagsetFromDb);
                            childTagFromDb.Tagset = tagsetFromDb;
                            tagsetFromDb.Tags.Add(childTagFromDb);
                            context.Update(tagsetFromDb);
                            context.SaveChanges();
                        }

                        Node newChildNode = DomainClassFactory.NewNode(childTagFromDb, hierarchyFromDb);
                        parentNodeFromDb.Children.Add(newChildNode);
                        hierarchyFromDb.Nodes.Add(newChildNode);
                        context.Update(parentNodeFromDb);
                        context.Update(hierarchyFromDb);
                        context.SaveChanges();
                    }
                }
                lineCount++;
            }
        }
    }
}
