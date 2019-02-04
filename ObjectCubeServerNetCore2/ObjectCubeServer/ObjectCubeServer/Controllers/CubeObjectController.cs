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
    public class CubeObjectController : ControllerBase
    {
        // GET: api/CubeObject
        [HttpGet]
        public IActionResult Get()
        {
            List<CubeObject> allCubeObjects;
            using (var context = new ObjectContext())
            {
                allCubeObjects = context.CubeObjects
                    .Include(co => co.ObjectTagRelations)
                    .ToList();
            }
            return Ok(JsonConvert.SerializeObject(allCubeObjects,
                new JsonSerializerSettings() { ReferenceLoopHandling = ReferenceLoopHandling.Ignore }));
        }

        // GET: api/CubeObject/FromTagId/1
        [HttpGet("[action]/{tagId}")]
        public IActionResult FromTagId(int tagId)
        {
            List<CubeObject> allCubeObjects;
            using (var context = new ObjectContext())
            {
                allCubeObjects = context.CubeObjects
                    //.Include(co => co.ObjectTagRelations)
                    .Where(co => co.ObjectTagRelations.Where(otr => otr.TagId == tagId).Count() > 0)
                    .ToList();
            }
            return Ok(JsonConvert.SerializeObject(allCubeObjects,
                new JsonSerializerSettings() { ReferenceLoopHandling = ReferenceLoopHandling.Ignore }));
        }

        // GET: api/CubeObject/5
        [HttpGet("{id}", Name = "GetCubeObject")]
        public IActionResult Get(int id)
        {
            CubeObject cubeObjectFound;
            using (var context = new ObjectContext())
            {
                cubeObjectFound = context.CubeObjects.Where(co => co.Id == id).FirstOrDefault();
            }
            if (cubeObjectFound != null)
            {
                return Ok(JsonConvert.SerializeObject(cubeObjectFound));
            }
            else return NotFound();
        }

        // POST: api/CubeObject
        [HttpPost]
        public void Post([FromBody] string value)
        {
        }

        // PUT: api/CubeObject/5
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
