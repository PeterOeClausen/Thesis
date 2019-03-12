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
    public class TagController : ControllerBase
    {
        // GET: api/Tag
        // GET: api/tag?cubeObjectId=1
        /// <summary>
        /// Either returns all tags in the database: api/tag.
        /// Or returns all tags that cubeObject with cubeObjectId is tagged with.
        /// </summary>
        /// <param name="cubeObjectId"></param>
        /// <returns></returns>
        [HttpGet]
        public IActionResult Get(int? cubeObjectId)
        {
            if (cubeObjectId == null)
            {
                List<Tag> allTags;
                using (var context = new ObjectContext())
                {
                    allTags = context.Tags.ToList();
                }
                return Ok(JsonConvert.SerializeObject(allTags));
            }
            else
            {
                List<Tag> tagsFound;
                using (var context = new ObjectContext())
                {
                    tagsFound = context.CubeObjects
                        .Where(co => co.Id == cubeObjectId)
                        .Select(co => co.ObjectTagRelations.Select(otr => otr.Tag)) //Map each OTR to a Tag
                        .FirstOrDefault()
                        .ToList();
                }
                if (tagsFound != null)
                {
                    return Ok(JsonConvert.SerializeObject(tagsFound));
                }
                else return NotFound();
            }
        }

        // GET: api/Tag/5
        /// <summary>
        /// Returns single tag where Tag.Id == id.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet("{id}", Name = "GetTag")]
        public IActionResult Get(int id)
        {
            Tag tagFound;
            using (var context = new ObjectContext())
            {
                tagFound = context.Tags.Where(t => t.Id == id).FirstOrDefault();
            }
            if (tagFound != null)
            {
                return Ok(JsonConvert.SerializeObject(tagFound));
            }
            else return NotFound();   
        }
    }
}
