using Microsoft.EntityFrameworkCore;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using ObjectCubeServer.Models.DataAccess;
using ObjectCubeServer.Models.DomainClasses;
using System.Collections.Generic;
using System.Linq;

namespace ObjectDBTests
{
    [TestClass]
    public class UnitTest1
    {
        [TestMethod]
        public void CubeObject_Add()
        {
            var options = new DbContextOptionsBuilder<ObjectContext>()
                .UseInMemoryDatabase(databaseName: "TestDb")
                .Options;

            using (var context = new ObjectContext(options))
            {
                context.CubeObjects.Add(new CubeObject() {
                    FileType = FileType.Photo,
                    Photo = new Photo()
                    {
                        FileName = "testImage",
                        Image = new byte[0]
                    },
                    ObjectTagRelations = new List<ObjectTagRelation>(),
                });
                context.SaveChanges();
            }

            using (var context = new ObjectContext(options))
            {
                var allCubeObjects = context.CubeObjects.ToList();
                Assert.AreEqual(allCubeObjects.Count, 1);
                Assert.AreEqual(allCubeObjects.First().Id, 42);
            }
        }
    }
}
