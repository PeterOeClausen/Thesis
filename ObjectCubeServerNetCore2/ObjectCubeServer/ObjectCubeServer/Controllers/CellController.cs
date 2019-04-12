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
        /* EXAMPLES:
         * GET: /api/cell?xAxis={jsonObject}
         * GET: /api/cell?yAxis={jsonObject}
         * GET: /api/cell?zAxis={jsonObject}
         * GET: /api/cell?xAxis={jsonObject}&yAxis={jsonObject}
         * GET: /api/cell?xAxis={jsonObject}&zAxis={jsonObject}
         * GET: /api/cell?yAxis={jsonObject}&zAxis={jsonObject}
         * GET: /api/cell?xAxis={jsonObject}&yAxis={jsonObject}&zAxis={jsonObject}
         * 
         * Where an axis showing a Hierarchy could be:
         *  {"AxisDirection":"X","AxisType":"Hierarchy","TagsetId":0,"HierarchyNodeId":1}
         * Or an axis showing a Tagset could be: 
         *  {"AxisDirection":"X","AxisType":"Tagset","TagsetId":1,"HierarchyNodeId":0}
         *  
         * The same way, filters can also be added:
         * Hierarchy filter:
         *     &filters=[{"type":"hierarchy","tagId":0,"nodeId":116}]
         * Tag filter:
         *     &filters=[{"type":"tag","tagId":42,"nodeId":0}]
         * 
        */
        public IActionResult Get(string xAxis, string yAxis, string zAxis, string filters)
        {
            bool xDefined = xAxis != null;
            bool yDefined = yAxis != null;
            bool zDefined = zAxis != null;
            bool filtersDefined = filters != null;
            //Parsing:
            ParsedAxis axisX = xDefined ? JsonConvert.DeserializeObject<ParsedAxis>(xAxis) : null;
            ParsedAxis axisY = yDefined ? JsonConvert.DeserializeObject<ParsedAxis>(yAxis) : null;
            ParsedAxis axisZ = zDefined ? JsonConvert.DeserializeObject<ParsedAxis>(zAxis) : null;
            List<ParsedFilter> filtersList = filtersDefined ? JsonConvert.DeserializeObject<List<ParsedFilter>>(filters) : null;
            //Extracting cubeObjects:
            List<List<CubeObject>> xAxisCubeObjects = getAllCubeObjectsFromAxis(xDefined, axisX);
            List<List<CubeObject>> yAxisCubeObjects = getAllCubeObjectsFromAxis(yDefined, axisY);
            List<List<CubeObject>> zAxisCubeObjects = getAllCubeObjectsFromAxis(zDefined, axisZ);
            //Creating Cells:
            List<Cell> cells = new List<Cell>();

            if (xDefined && yDefined && zDefined) //XYZ
            {
                cells =
                    xAxisCubeObjects.SelectMany((colist1, index1) =>
                    yAxisCubeObjects.SelectMany((colist2, index2) =>
                    zAxisCubeObjects.Select((colist3, index3) => new Cell()
                    {
                        x = index1 + 1,
                        y = index2 + 1,
                        z = index3 + 1,
                        CubeObjects = colist1
                            .Where(co => colist2.Exists(co2 => co2.Id == co.Id) && //Where co is in colist2 and in colist3
                            colist3.Exists(co3 => co3.Id == co.Id))
                            .ToList()
                    }))).ToList();
            }
            else if (xDefined && yDefined)  //XY
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
            else if (xDefined && zDefined)  //XZ
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
            else if (yDefined && zDefined)  //YZ
            {
                cells =
                    yAxisCubeObjects.SelectMany((colist1, index1) =>
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
            else if (xDefined)               //X
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
            else if (yDefined)                //Y
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
            else if (zDefined)                //Z
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
            else if (!xDefined && !yDefined && !zDefined) //If X Y and Z are not defined, show all:
            {
                cells = new List<Cell>(){
                    new Cell() {
                        x = 1,
                        y = 1,
                        z = 1,
                        CubeObjects = getAllCubeObjects()
                    }
                };
            }
            //If cells have no cubeObjects, remove them:
            cells.RemoveAll(c => c.CubeObjects.Count == 0);

            //Filtering:
            if(filtersDefined && filtersList.Count > 0)
            {
                //Devide filters:
                List<ParsedFilter> tagFilters = filtersList.Where(f => f.type.Equals("tag")).ToList();
                List<ParsedFilter> hierarchyFilters = filtersList.Where(f => f.type.Equals("hierarchy")).ToList();

                //Apply filters:
                if(tagFilters.Count > 0)
                {
                    cells.ForEach(c => c.CubeObjects = filterCubeObjectsWithTagFilters(c.CubeObjects, tagFilters));
                }
                if(hierarchyFilters.Count > 0)
                {
                    cells.ForEach(c => c.CubeObjects = filterCubeObjectsWithHierarchyFilters(c.CubeObjects, hierarchyFilters));
                }
            }

            //Return OK with json result:
            return Ok(JsonConvert.SerializeObject(cells,
                new JsonSerializerSettings() { ReferenceLoopHandling = ReferenceLoopHandling.Ignore }));
        }

        #region HelperMethods:
        /// <summary>
        /// Helper method that fetches all CubeObjects
        /// </summary>
        /// <returns></returns>
        private List<CubeObject> getAllCubeObjects()
        {
            List<CubeObject> allCubeObjects;
            using (var context = new ObjectContext())
            {
                allCubeObjects = context.CubeObjects
                    .Include(co => co.ObjectTagRelations)
                    .ToList();
            }
            return allCubeObjects;
        }

        /// <summary>
        /// Helper method that given a list of cubeobjects and a list of filters, returns a new list of
        /// cubeobjects, where cubeobjects that doesn't pass through the filters are removed.
        /// </summary>
        /// <param name="cubeObjects"></param>
        /// <param name="tagFilters"></param>
        /// <returns></returns>
        private List<CubeObject> filterCubeObjectsWithTagFilters(List<CubeObject> cubeObjects, List<ParsedFilter> tagFilters)
        {
            return cubeObjects
                .Where(co =>
                    tagFilters.TrueForAll(f => co.ObjectTagRelations.Exists(otr => otr.TagId == f.tagId))) //Must be tagged with each tag
                .ToList();
        }

        private List<CubeObject> filterCubeObjectsWithHierarchyFilters(List<CubeObject> cubeObjects, List<ParsedFilter> hierarchyFilters)
        {
            //Getting all tags per hierarchy filter:
            List<List<Tag>> tagsPerHierarchyFilter = hierarchyFilters
                .Select(hf => extractTagsFromHierarchyFilter(hf)) //Map into list of tags
                .ToList();

            //If cubeObject has tag in hierarchy, let it pass throgh the filter:
            return cubeObjects
                .Where(co => tagsPerHierarchyFilter.TrueForAll( //CubeObject must be tagged with tag in each of the tag lists (flattened hierarchies)
                        lstOfTags => co.ObjectTagRelations.Exists( //For each tag list, there must exist a cube object where:
                            otr => lstOfTags.Exists(tag => tag.Id == otr.TagId) //the cube object is tagged with one tag id from the taglist.
                        )
                    )
                ).ToList();
        }

        private List<Tag> extractTagsFromHierarchyFilter(ParsedFilter pf)
        {
            //Get node and subnodes with tags:
            Node node = fetchWholeHierarchyFromRootNode(pf.nodeId);
            //Extract tags:
            List<Tag> tagsInNode = extractTagsFromHieararchy(node);
            return tagsInNode;
        }

        /// <summary>
        /// Given a boolean defined and a ParsedAxis, returns a List of List of CubeObjects.
        /// The indexes in the outer list repressents each tag on an axis.
        /// The indexes in the inner list reppressents the cube objects tagged with the tag.
        /// </summary>
        /// <param name="defined"></param>
        /// <param name="parsedAxis"></param>
        /// <returns></returns>
        private List<List<CubeObject>> getAllCubeObjectsFromAxis(bool defined, ParsedAxis parsedAxis)
        {
            if (defined)
            {
                if (parsedAxis.AxisType.Equals("Tagset"))
                {
                    return getAllCubeObjectsFrom_Tagset_Axis(parsedAxis);
                }
                else if (parsedAxis.AxisType.Equals("Hierarchy"))
                {
                    return getAllCubeObjectsFrom_Hierarchy_Axis(parsedAxis);
                }
                else if (parsedAxis.AxisType.Equals("HierarchyLeaf")) //A HierarchyLeaf is a Node with no children.
                {
                    return getAllCubeObjectsFrom_HierarchyLeaf_Axis(parsedAxis);
                }
                else
                {
                    throw new Exception("AxisType: " + parsedAxis.AxisType + " was not recognized!");
                }
            }
            else return null;
        }

        /// <summary>
        /// Returns list of cubeObjects per tag. Called with ParsedAxis of type "Tagset".
        /// </summary>
        /// <param name="parsedAxis"></param>
        /// <returns></returns>
        private List<List<CubeObject>> getAllCubeObjectsFrom_Tagset_Axis(ParsedAxis parsedAxis)
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

        /// <summary>
        /// Returns list of cubeObjects per tag. Called with ParsedAxis of type "Hierarchy".
        /// </summary>
        /// <param name="parsedAxis"></param>
        /// <returns></returns>
        private List<List<CubeObject>> getAllCubeObjectsFrom_Hierarchy_Axis(ParsedAxis parsedAxis)
        {
            List<Node> hierarchyNodes;
            Node rootNode = fetchWholeHierarchyFromRootNode(parsedAxis.HierarchyNodeId);
            hierarchyNodes = rootNode.Children;
            return hierarchyNodes
                .Select(n => getAllCubeObjectsTaggedWith(extractTagsFromHieararchy(n)) //Map hierarchy nodes to list of cube objects
                .GroupBy(co => co.Id).Select(grouping => grouping.First()).ToList()) //Getting unique cubeobjects
                .ToList();
        }

        /// <summary>
        /// Returns list of cubeObjects per tag. Called with ParsedAxis of type "HierarchyLeaf".
        /// </summary>
        /// <param name="parsedAxis"></param>
        /// <returns></returns>
        private List<List<CubeObject>> getAllCubeObjectsFrom_HierarchyLeaf_Axis(ParsedAxis parsedAxis)
        {
            Node currentNode = fetchWholeHierarchyFromRootNode(parsedAxis.HierarchyNodeId);
            List<CubeObject> cubeObjectsTaggedWithTagFromNode = getAllCubeObjectsTaggedWith(currentNode.TagId);
            return new List<List<CubeObject>>() { cubeObjectsTaggedWithTagFromNode };
        }

        /// <summary>
        /// Fetches Node with Tag, Children and Children's Tags from a given nodeId.
        /// </summary>
        /// <param name="nodeId"></param>
        /// <returns></returns>
        private Node fetchWholeHierarchyFromRootNode(int nodeId)
        {
            Node currentNode;
            using (var context = new ObjectContext())
            {
                currentNode = context.Nodes
                    .Include(n => n.Tag)
                    .Include(n => n.Children)
                        .ThenInclude(cn => cn.Tag)
                    .Where(n => n.Id == nodeId)
                    .FirstOrDefault();
            }
            currentNode.Children.Sort((cn1, cn2) => cn1.Tag.Name.CompareTo(cn2.Tag.Name));
            List<Node> newChildNodes = new List<Node>();
            currentNode.Children.ForEach(cn => newChildNodes.Add(fetchWholeHierarchyFromRootNode(cn.Id)));
            currentNode.Children = newChildNodes;
            return currentNode;
        }

        /// <summary>
        /// Fetches all CubeObjects tagged with tagId.
        /// </summary>
        /// <param name="nodeId"></param>
        /// <returns></returns>
        private List<CubeObject> getAllCubeObjectsTaggedWith(int tagId)
        {
            List<CubeObject> cubeObjects;
            using (var context = new ObjectContext())
            {
                cubeObjects = context.CubeObjects
                    .Include(co => co.ObjectTagRelations)
                    .Where(co => co.ObjectTagRelations.Where(otr => otr.TagId == tagId).Count() > 0) //Is tagged with tagId at least once
                    .ToList();
            }
            return cubeObjects;
        }
        
        /// <summary>
        /// Fetches all CubeObjects tagged with either of the tags in given list of tags.
        /// Warning: Remember to filter returned CubeObjects for duplicates!
        /// </summary>
        /// <param name="tags"></param>
        /// <returns></returns>
        private List<CubeObject> getAllCubeObjectsTaggedWith(List<Tag> tags)
        {
            List<CubeObject> cubeObjects = new List<CubeObject>();
            foreach (Tag t in tags)
            {
                cubeObjects.AddRange(getAllCubeObjectsTaggedWith(t.Id));
            }
            return cubeObjects;
        }
        
        /// <summary>
        /// Given a Node, returns all the tags in the hierarchy.
        /// </summary>
        /// <param name="hierarchy"></param>
        /// <returns></returns>
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
        #endregion
    }
}
