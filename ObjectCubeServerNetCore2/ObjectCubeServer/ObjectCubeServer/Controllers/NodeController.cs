using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ObjectCubeServer.Models.DataAccess;
using ObjectCubeServer.Models.DomainClasses;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

namespace ObjectCubeServer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NodeController : ControllerBase
    {
        // GET: api/Node
        [HttpGet]
        public IActionResult Get()
        {
            List<Node> allNodes;
            using (var context = new ObjectContext())
            {
                allNodes = context.Nodes
                    .Include(n => n.Children)
                    .ToList();
            }
            return Ok(JsonConvert.SerializeObject(allNodes));
        }

        //Should return all childnodes and tags as well:
        // GET: api/Node/5
        [HttpGet("{id}", Name = "GetNodes")]
        public IActionResult Get(int id)
        {
            Node nodeFound;
            using (var context = new ObjectContext())
            {
                nodeFound = context.Nodes
                    .Where(n => n.Id == id)
                    .Include(n => n.Tag)
                    .Include(n => n.Children)
                    .FirstOrDefault();
            }
            if (nodeFound == null) { return NotFound(); }
            else
            {
                nodeFound = RecursiveAddChildrenAndTags(nodeFound);
                return Ok(JsonConvert.SerializeObject(nodeFound));
            }
        }
        
        private Node RecursiveAddChildrenAndTags(Node parentNode)
        {
            List<Node> newChildNodes = new List<Node>();
            foreach(Node childNode in parentNode.Children)
            {
                Node childNodeWithTagAndChildren;
                using (var context = new ObjectContext())
                {
                    childNodeWithTagAndChildren = context.Nodes
                        .Where(n => n.Id == childNode.Id)
                        .Include(n => n.Tag)
                        .Include(n => n.Children)
                        .FirstOrDefault();
                }
                childNodeWithTagAndChildren = RecursiveAddChildrenAndTags(childNodeWithTagAndChildren);
                newChildNodes.Add(childNodeWithTagAndChildren);
            }
            parentNode.Children = newChildNodes;
            return parentNode;
        }

        // POST: api/Node
        [HttpPost]
        public void Post([FromBody] string value)
        {
        }

        // PUT: api/Node/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE: api/ApiWithActions/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
