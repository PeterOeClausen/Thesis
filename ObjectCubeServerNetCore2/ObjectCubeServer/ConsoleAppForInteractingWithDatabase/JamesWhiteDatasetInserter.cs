using ObjectCubeServer.Models;
using ObjectCubeServer.Models.DataAccess;
using ObjectCubeServer.Models.DomainClasses;
using System;
using System.Drawing;
using System.Linq;
using System.Collections.Generic;
using System.Text;
using System.IO;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Processing;
using SixLabors.ImageSharp.PixelFormats;

namespace ConsoleAppForInteractingWithDatabase
{
    public class JamesWhiteDatasetInserter
    {
        public static void InsertJamesWhiteDataset()
        {
            using (var context = new ObjectContext())
            {
                string path = @"C:\Users\peter\Desktop\ImageTestSet";
                string[] files = Directory.GetFiles(path);
                List<CubeObject> cubeObjects = new List<CubeObject>();
                Tagset tagset = new Tagset() { Name = "Stuff on the picture", TagTagsetRelations = new List<TagTagsetRelation>() };
                foreach (string file in files)
                {
                    string filename = Path.GetFileName(file);
                    Console.WriteLine(filename);
                    var cubeObject = new CubeObject();

                    //Loading and saving image:
                    using (Image<Rgba32> image = Image.Load(file))
                    {
                        MemoryStream ms = new MemoryStream();
                        image.SaveAsJpeg(ms); //Copy to ms

                        cubeObject.FileType = FileType.Photo;
                        cubeObject.Photo = new Photo()
                        {
                            FileName = Path.GetFileName(file),
                            Image = ms.ToArray()
                        };
                    }

                    //Adding tags based on filename:
                    switch (filename)
                    {
                        case "Flamingo.jpg":
                            Tag tag = new Tag()
                            {
                                Name = "Flamingo",
                                ObjectTagRelations = new List<ObjectTagRelation>(),
                                TagTagsetRelations = new List<TagTagsetRelation>()
                            };
                            tag.ObjectTagRelations.Add(new ObjectTagRelation() { CubeObject = cubeObject, Tag = tag } );
                            tag.TagTagsetRelations.Add(new TagTagsetRelation() { Tag = tag, Tagset = tagset });

                            context.Tags.Add(tag);
                            break;
                    }

                    //Adding cube object to the list (later to be saved):
                    cubeObjects.Add(cubeObject);
                }

                //Adding tagset and created cubeobjects to the database:
                context.Tagsets.Add(tagset);
                context.CubeObjects.AddRange(cubeObjects);
                
                //Saving changes:
                context.SaveChanges();
            }
        }


    }
}
