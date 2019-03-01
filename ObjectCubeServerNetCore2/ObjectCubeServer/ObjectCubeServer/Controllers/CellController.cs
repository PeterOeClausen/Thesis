using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using ObjectCubeServer.Models.DataAccess;
using ObjectCubeServer.Models.DomainClasses;

namespace ObjectCubeServer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CellController : ControllerBase
    {
        // EXAMPLES:
        // GET: /api/cell?xAxis={jsonObject}
        // GET: /api/cell?yAxis={jsonObject}
        // GET: /api/cell?zAxis={jsonObject}
        // GET: /api/cell?xAxis={jsonObject}&yAxis={jsonObject}
        // GET: /api/cell?xAxis={jsonObject}&zAxis={jsonObject}
        // GET: /api/cell?yAxis={jsonObject}&zAxis={jsonObject}
        // GET: /api/cell?xAxis={jsonObject}&yAxis={jsonObject}&zAxis={jsonObject}
        public IActionResult Get(string xAxis, string yAxis, string zAxis)
        {
            bool xDefined = xAxis != null;
            bool yDefined = yAxis != null;
            bool zDefined = zAxis != null;
            //Parsing:
            ParsedAxis axisX = xDefined ? JsonConvert.DeserializeObject<ParsedAxis>(xAxis) : null;
            ParsedAxis axisY = yDefined ? JsonConvert.DeserializeObject<ParsedAxis>(yAxis) : null;
            ParsedAxis axisZ = zDefined ? JsonConvert.DeserializeObject<ParsedAxis>(zAxis) : null;
            //Extracting cubeObjects:
            List<List<CubeObject>> xAxisCubeObjects = getAllCubeObjectsFromAxis(xDefined, axisX);
            List<List<CubeObject>> yAxisCubeObjects = getAllCubeObjectsFromAxis(yDefined, axisY);
            List<List<CubeObject>> zAxisCubeObjects = getAllCubeObjectsFromAxis(zDefined, axisZ);
            //Creating Cells:
            List<Cell> cells = new List<Cell>();
            
            if (xDefined && yDefined && zDefined)
            {
                cells =
                    xAxisCubeObjects.SelectMany((colist1, index1) =>
                    yAxisCubeObjects.SelectMany((colist2, index2) =>
                    zAxisCubeObjects.Select((colist3, index3) => new Cell() {
                        x = index1 + 1,
                        y = index2 + 1,
                        z = index3 + 1,
                        CubeObjects = colist1
                            .Where(co => colist2.Exists(co2 => co2.Id == co.Id) && //Where co is in colist2 and in colist3
                            colist3.Exists(co3 => co3.Id == co.Id))
                            .ToList()
                    }))).ToList();
            }
            else if (xDefined && yDefined)
            {
                cells =
                    xAxisCubeObjects.SelectMany((colist1, index1) =>
                    yAxisCubeObjects.Select((colist2, index2) =>
                    new Cell()
                    {
                        x = index1 + 1,
                        y = index2 + 1,
                        z = 0,
                        CubeObjects = colist1
                            .Where(co => colist2.Exists(co2 => co2.Id == co.Id)) //Where co is in colist2 as well
                            .ToList()
                    })).ToList();
            }
            else if (xDefined && zDefined)
            {
                cells =
                    xAxisCubeObjects.SelectMany((colist1, index1) =>
                    zAxisCubeObjects.Select((colist2, index2) =>
                    new Cell()
                    {
                        x = index1 + 1,
                        y = 0,
                        z = index2 + 1,
                        CubeObjects = colist1
                            .Where(co => colist2.Exists(co2 => co2.Id == co.Id)) //Where co is in colist2 as well
                            .ToList()
                    })).ToList();
            }
            else if (yDefined && zDefined)
            {
                cells =
                    xAxisCubeObjects.SelectMany((colist1, index1) =>
                    zAxisCubeObjects.Select((colist2, index2) =>
                    new Cell()
                    {
                        x = 0,
                        y = index1 + 1,
                        z = index2 + 1,
                        CubeObjects = colist1
                            .Where(co => colist2.Exists(co2 => co2.Id == co.Id)) //Where co is in colist2 as well
                            .ToList()
                    })).ToList();
            }
            else if (xDefined)
            {
                cells =
                    xAxisCubeObjects.Select((colist1, index1) =>
                    new Cell()
                    {
                        x = index1 + 1,
                        y = 1,
                        z = 0,
                        CubeObjects = colist1
                    }).ToList();
            }
            else if (yDefined)
            {
                cells =
                    yAxisCubeObjects.Select((colist1, index1) =>
                    new Cell()
                    {
                        x = 1,
                        y = index1 + 1,
                        z = 0,
                        CubeObjects = colist1
                    }).ToList();
            }
            else if (zDefined)
            {
                cells =
                    zAxisCubeObjects.Select((colist1, index1) =>
                    new Cell()
                    {
                        x = 0,
                        y = 1,
                        z = index1 + 1,
                        CubeObjects = colist1
                    }).ToList();
            }
            //Last filtering:
            cells.RemoveAll(c => c.CubeObjects.Count == 0);
            return Ok(JsonConvert.SerializeObject(cells,
                new JsonSerializerSettings() { ReferenceLoopHandling = ReferenceLoopHandling.Ignore }));
        }

        private List<List<CubeObject>> getAllCubeObjectsFromAxis(bool defined, ParsedAxis parsedAxis)
        {
            if (defined)
            {
                if (parsedAxis.AxisType.Equals("Tagset"))
                {
                    return getAllCubeObjectsFromAxisWithTags(parsedAxis);
                }
                else if (parsedAxis.AxisType.Equals("Hierarchy"))
                {
                    return getAllCubeObjectsFromAxisWithHierarchies(parsedAxis);
                }
                else
                {
                    throw new Exception("AxisType: " + parsedAxis.AxisType + " was not recognized!");
                }
            }
            else return null;
        }

        private List<List<CubeObject>> getAllCubeObjectsFromAxisWithTags(ParsedAxis parsedAxis)
        {
            //Getting tags from database:
            List<Tag> tags;
            using (var context = new ObjectContext())
            {
                var Tagset = context.Tagsets
                    .Include(ts => ts.Tags)
                    //.Include(co => co.ObjectTagRelations)
                    .Where(ts => ts.Id == parsedAxis.TagsetId)
                    .FirstOrDefault();
                tags = Tagset.Tags.OrderBy(t => t.Name).ToList();
            }
            return tags
                .Select(t => getAllCubeObjectsTaggedWith(t.Id))
                .ToList();
        }

        private List<List<CubeObject>> getAllCubeObjectsFromAxisWithHierarchies(ParsedAxis parsedAxis)
        {
            List<Node> hierarchyNodes;
            Node rootNode = fetchWholeHierarchyFromRootNode(parsedAxis.HierarchyNodeId);
            hierarchyNodes = rootNode.Children;
            return hierarchyNodes
                .Select(n => getAllCubeObjectsTaggedWith(extractTagsFromHieararchy(n)))
                .ToList();
        }

        private Node fetchWholeHierarchyFromRootNode(int id)
        {
            Node currentNode;
            using (var context = new ObjectContext())
            {
                currentNode = context.Nodes
                    .Include(n => n.Tag)
                    .Include(n => n.Children)
                        .ThenInclude(cn => cn.Tag)
                    .Where(n => n.Id == id)
                    .FirstOrDefault();
            }
            currentNode.Children.OrderBy(cn => cn.Tag);
            List<Node> newChildNodes = new List<Node>();
            currentNode.Children.ForEach(cn => newChildNodes.Add(fetchWholeHierarchyFromRootNode(cn.Id)));
            currentNode.Children = newChildNodes;
            return currentNode;
        }

        private List<CubeObject> getAllCubeObjectsTaggedWith(int tagId)
        {
            List<CubeObject> cubeObjects;
            using (var context = new ObjectContext())
            {
                cubeObjects = context.CubeObjects
                    //.Include(co => co.ObjectTagRelations)
                    .Where(co => co.ObjectTagRelations.Where(otr => otr.TagId == tagId).Count() > 0) //Is tagged with tagId at least once
                    .ToList();
            }
            return cubeObjects;
        }
        
        private List<CubeObject> getAllCubeObjectsTaggedWith(List<Tag> tags)
        {
            List<CubeObject> cubeObjects = new List<CubeObject>();
            foreach (Tag t in tags)
            {
                cubeObjects.AddRange(getAllCubeObjectsTaggedWith(t.Id));
            }
            return cubeObjects;
        }
        
        private List<Tag> extractTagsFromHieararchy(Node hierarchy)
        {
            List<Tag> tags = new List<Tag>();
            tags.Add(hierarchy.Tag);
            var tagsFromSubHierarchies = hierarchy.Children
                .SelectMany(n => extractTagsFromHieararchy(n)) //Same as flatMap
                .ToList();
            tags.AddRange(tagsFromSubHierarchies);
            return tags;
        }
    }
}
