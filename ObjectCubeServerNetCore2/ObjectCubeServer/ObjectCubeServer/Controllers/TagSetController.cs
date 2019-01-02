using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using ObjectCubeServer.Models.DataAccess;
using ObjectCubeServer.Models.DomainClasses;

namespace ObjectCubeServer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TagsetController : ControllerBase
    {
        // GET: api/tagset
        [HttpGet]
        public IActionResult Get()
        {
            List<Tagset> allTagsets;
            using (var context = new ObjectContext())
            {
                allTagsets = context.Tagsets
                    .ToList();
            }
            return Ok(JsonConvert.SerializeObject(allTagsets));
        }

        // GET: api/tagset/5
        [HttpGet("{id}", Name = "GetTagset")]
        public string Get(int id)
        {
            return "value";
        }

        // POST: api/tagset
        [HttpPost]
        public void Post([FromBody] string value)
        {
        }

        // PUT: api/tagset/5
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
