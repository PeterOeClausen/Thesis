using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ObjectCubeServer.Models.DataAccess;
using ObjectCubeServer.Models.DomainClasses;

namespace ObjectCubeServer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TagController : ControllerBase
    {
        // GET: api/Tag
        [HttpGet]
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2", "value3" };
        }

        // GET: api/Tag/5
        [HttpGet("{id}", Name = "Get")]
        public string Get(int id)
        {
            Tag tagFound;
            using (var context = new ObjectContext())
            {
                tagFound = context.Tags.Where(t => t.Id == id).FirstOrDefault();
            }
            if (tagFound != null)
            {
                return tagFound.Name;
            }
            else return NotFound().ToString();
        }

        // POST: api/Tag
        [HttpPost]
        public void Post([FromBody] string value)
        {
        }

        // PUT: api/Tag/5
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
