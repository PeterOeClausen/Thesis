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
                    //.OrderBy(ts => ts.Name)
                    .Include(ts => ts.Tags)
                    .ToList();
            }
            //Sorting tags:
            //allTagsets.ForEach(ts => ts.Tags.Sort((t1,t2) => t1.Name.CompareTo(t2.Name)));
            return Ok(JsonConvert.SerializeObject(allTagsets,
                new JsonSerializerSettings() { ReferenceLoopHandling = ReferenceLoopHandling.Ignore })); //Ignore self referencing loops
        }

        // GET: api/tagset/5
        [HttpGet("{id}", Name = "GetTagset")]
        public IActionResult Get(int id)
        {
            Tagset tagsetWithId;
            using (var context = new ObjectContext())
            {
                tagsetWithId = context.Tagsets
                    .Where(ts => ts.Id == id)
                    .Include(ts => ts.Tags)
                    .Include(ts => ts.Hierarchies)
                    .FirstOrDefault();
            }
            return Ok(JsonConvert.SerializeObject(tagsetWithId, 
                new JsonSerializerSettings(){ReferenceLoopHandling = ReferenceLoopHandling.Ignore})
            );
        }
    }
}
