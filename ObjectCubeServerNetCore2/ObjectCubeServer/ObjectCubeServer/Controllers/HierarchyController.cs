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
    public class HierarchyController : ControllerBase
    {
        // GET: api/Hierarchy
        [HttpGet]
        public IActionResult Get()
        {
            List<Hierarchy> allHierarchies;
            using (var context = new ObjectContext())
            {
                allHierarchies = context.Hierarchies
                    .Include(h => h.Nodes)
                        .ThenInclude(n => n.Tag)
                    .ToList();
            }
            //Add rootnode and recursively add subnodes and their tags:
            allHierarchies.ForEach(h => h.Nodes = new List<Node>()
            {
                RecursiveAddChildrenAndTags(h.Nodes.FirstOrDefault(n => n.Id == h.RootNodeId))
            });

            return Ok(JsonConvert.SerializeObject(allHierarchies,
                new JsonSerializerSettings() { ReferenceLoopHandling = ReferenceLoopHandling.Ignore }));
        }

        // GET: api/Hierarchy/5
        [HttpGet("{id}", Name = "GetHirarchy")]
        public IActionResult Get(int id)
        {
            Hierarchy hierarchyFound;
            using (var context = new ObjectContext())
            {
                hierarchyFound = context.Hierarchies
                    .Include(h => h.Nodes)
                        .ThenInclude(node => node.Tag)
                    .Where(h => h.Id == id)
                    .FirstOrDefault();
            }
            if(hierarchyFound == null)
            {
                return NotFound();
            }
            return Ok(JsonConvert.SerializeObject(hierarchyFound,
                new JsonSerializerSettings() { ReferenceLoopHandling = ReferenceLoopHandling.Ignore }));
        }

        #region HelperMethods:
        private Node RecursiveAddChildrenAndTags(Node parentNode)
        {
            List<Node> newChildNodes = new List<Node>();
            foreach (Node childNode in parentNode.Children)
            {
                Node childNodeWithTagAndChildren;
                using (var context = new ObjectContext())
                {
                    childNodeWithTagAndChildren = context.Nodes
                        .Where(n => n.Id == childNode.Id)
                        .Include(n => n.Tag)
                        .Include(n => n.Children)
                            .ThenInclude(cn => cn.Tag)
                        .FirstOrDefault();
                }
                childNodeWithTagAndChildren.Children.Sort((cn1, cn2) => cn1.Tag.Name.CompareTo(cn2.Tag.Name));
                childNodeWithTagAndChildren = RecursiveAddChildrenAndTags(childNodeWithTagAndChildren);
                newChildNodes.Add(childNodeWithTagAndChildren);
            }
            parentNode.Children = newChildNodes;
            return parentNode;
        }
        #endregion
    }
}
