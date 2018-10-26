using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace ObjectCubeServer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StructureController : ControllerBase
    {
        // GET: api/Structure
        [HttpGet]
        public IEnumerable<string> Get([FromQuery] string dimensions, [FromQuery] string filters)
        {
            JArray dim = (JArray) JsonConvert.DeserializeObject(dimensions);
            JArray filt = (JArray) JsonConvert.DeserializeObject(filters);
            foreach(string d in dim)
            {
                Console.WriteLine(d);
            }
            return new string[] { "value1", "value2" };
        }

        // GET: api/Structure/5
        [HttpGet("{id}", Name = "GetStructure")]
        public string Get(int id)
        {
            return "value";
        }

        // POST: api/Structure
        [HttpPost]
        public void Post([FromBody] string value)
        {
        }

        // PUT: api/Structure/5
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
