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
    public class ThumbnailController : ControllerBase
    {
        // GET: api/Thumbnail
        [HttpGet]
        public IActionResult Get()
        {
            List<Thumbnail> allThumbnails;
            using (var context = new ObjectContext())
            {
                allThumbnails = context.Thumbnails.ToList();
            }
            if (allThumbnails != null)
            {
                return Ok(JsonConvert.SerializeObject(allThumbnails)); //Does not return file!
            }
            else return NotFound();
        }

        // GET: api/Thumbnail/5
        [HttpGet("{id}", Name = "GetThumbnail")]
        public IActionResult Get(int id)
        {
            Thumbnail thumbnailFound;
            using (var context = new ObjectContext())
            {
                thumbnailFound = context.Thumbnails.Where(t => t.Id == id).FirstOrDefault();
            }
            if (thumbnailFound != null)
            {
                return File(thumbnailFound.Image, "image/jpeg");
            }
            else return NotFound();
        }
    }
}
