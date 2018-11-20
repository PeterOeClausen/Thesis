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
using ObjectCubeServer.Models.HelperClasses;

namespace ConsoleAppForInteractingWithDatabase
{
    public class JamesWhiteDatasetInserter
    {
        public static void InsertJamesWhiteDataset()
        {
            using (var context = new ObjectContext())
            {
                //Creating tagsets:
                Tagset animals_tagset = DomainClassFactory.NewTagSet("Animals");
                Tagset artist_tagset = DomainClassFactory.NewTagSet("Artists");
                Tagset colors_tagset = DomainClassFactory.NewTagSet("Colors");
                Tagset location_tagset = DomainClassFactory.NewTagSet("Locations");
                Tagset shapes_tagset = DomainClassFactory.NewTagSet("Shapes");
                Tagset uncategorizedTags_tagset = DomainClassFactory.NewTagSet("Uncategorized");
                //Saving tagsets:
                Tagset[] allTagsets = new Tagset[] {
                    animals_tagset,
                    artist_tagset,
                    colors_tagset,
                    location_tagset,
                    shapes_tagset,
                    uncategorizedTags_tagset
                };
                context.Tagsets.AddRange(allTagsets);

                //Creating tags:
                Tag circleTag = DomainClassFactory.NewTag("Circle", shapes_tagset);
                Tag flamingoTag = DomainClassFactory.NewTag("Flamingo", animals_tagset);
                Tag JamesWhiteTag = DomainClassFactory.NewTag("James White", artist_tagset);
                Tag RectangleTag = DomainClassFactory.NewTag("Rectangle", shapes_tagset);
                Tag triangleTag = DomainClassFactory.NewTag("Triangle", shapes_tagset);
                //Saving tags:
                Tag[] allTags = new Tag[] {
                    circleTag,
                    flamingoTag,
                    JamesWhiteTag,
                    RectangleTag,
                    triangleTag
                };
                context.Tags.AddRange(allTags);

                //Adding tagset2tag relations:
                HelperMethods.AddTagToTagset(JamesWhiteTag, artist_tagset);
                HelperMethods.AddTagToTagset(flamingoTag, animals_tagset);
                HelperMethods.AddTagToTagset(circleTag, shapes_tagset);


                //Creating cube objects from files:
                string path = @"C:\Users\peter\Desktop\ImageTestSet";
                string[] files = Directory.GetFiles(path);
                List<CubeObject> cubeObjects = new List<CubeObject>();
                foreach (string file in files)
                {
                    string filename = Path.GetFileName(file);
                    Console.WriteLine(filename);
                    var cubeObject = new CubeObject();

                    //Loading and saving image:
                    using (Image<Rgba32> image = SixLabors.ImageSharp.Image.Load(file))
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
                            HelperMethods.AddTagToObject(flamingoTag, cubeObject);
                            HelperMethods.AddTagToObject(JamesWhiteTag, cubeObject);
                            break;

                        case "Palm.jpg":
                            HelperMethods.AddTagToObject(JamesWhiteTag, cubeObject);
                            break;
                    }

                    //Saving the cube object we just created.
                    context.CubeObjects.Add(cubeObject);
                }

                //Saving changes:
                context.SaveChanges();
            }
        }
    }
}
