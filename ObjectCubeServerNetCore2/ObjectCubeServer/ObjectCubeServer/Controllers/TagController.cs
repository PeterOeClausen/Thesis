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
    public class TagController : ControllerBase
    {
        // GET: api/Tag
        //Should return all Tags in the DB as a JSON list.
        [HttpGet]
        public IActionResult Get()
        {
            List<Tag> allTags;
            using (var context = new ObjectContext())
            {
                allTags = context.Tags.ToList();
            }
            return Ok(JsonConvert.SerializeObject(allTags));
        }

        // GET: api/Tag/5
        //Should return a single Tag as JSON.
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

        // POST: api/Tag
        //Should receive a new tag as JSON, parse it and add it to the database.
        [HttpPost]
        public IActionResult Post([FromBody] string value)
        {
            Tag tag = JsonConvert.DeserializeObject<Tag>(value);
            if(tag == null)
            {
                return BadRequest();
            }
            using (var context = new ObjectContext())
            {
                context.Tags.Add(tag);
                context.SaveChanges();
            }
            return Ok();
        }

        // PUT: api/Tag/5
        //Should edit an existing tag.
        [HttpPut("{id}")]
        public IActionResult Put(int id, [FromBody] string value)
        {
            Tag inputTag = JsonConvert.DeserializeObject<Tag>(value);
            if (inputTag == null)
            {
                return BadRequest();
            }
            Tag tagInDb;
            using (var context = new ObjectContext())
            {
                tagInDb = context.Tags.Where(t => t.Id == id).FirstOrDefault();
                if(tagInDb == null)
                {
                    return NotFound();
                }
                tagInDb.Id = inputTag.Id;
                tagInDb.Name = inputTag.Name;
                tagInDb.ObjectTagRelations = inputTag.ObjectTagRelations;
                tagInDb.TagTagsetRelations = inputTag.TagTagsetRelations;
                context.SaveChanges();
            }
            return Ok();
        }

        // DELETE: api/ApiWithActions/5
        //Should be able to delete an existing tag.
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            Tag tagInDb;
            using (var context = new ObjectContext())
            {
                tagInDb = context.Tags.Where(t => t.Id == id).FirstOrDefault();
                if (tagInDb == null)
                {
                    return NotFound();
                }
                context.Remove(tagInDb);
                context.SaveChanges();
            }
            return Ok();
        }
    }
}
