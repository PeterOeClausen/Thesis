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
            throw new NotImplementedException();
            return null;
            /*
            List<Hierarchy> rootHierarchies;
            using (var context = new ObjectContext())
            {
                rootHierarchies = context.Hierarchies.Include(h => h.RootNode).ToList();
            }
            if(rootHierarchies == null) { return NotFound("No root hierarchies were found. Check the database."); }

            return Ok(JsonConvert.SerializeObject(rootHierarchies, Formatting.Indented, 
                new JsonSerializerSettings() //Needed in order to avoid parrent-child-loop.
                {
                    ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore
                }));
                */
        }

        // GET: api/Hierarchy/5
        [HttpGet("{id}", Name = "GetHirarchy")]
        public string Get(int id)
        {
            return "value";
        }

        // POST: api/Hierarchy
        [HttpPost]
        public void Post([FromBody] string value)
        {
        }

        // PUT: api/Hierarchy/5
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
