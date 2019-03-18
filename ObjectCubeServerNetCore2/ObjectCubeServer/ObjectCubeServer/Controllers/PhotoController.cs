using System;
using System.Collections.Generic;
using System.IO;
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
    public class PhotoController : ControllerBase
    {
        // GET: api/Photo/5
        [HttpGet("{id}", Name = "GetPhoto")]
        public IActionResult Get(int id)
        {
            Photo photo;
            using (var context = new ObjectContext())
            {
                photo = context.Photos.Where(p => p.Id == id).FirstOrDefault();
                if(photo == null)
                {
                    return NotFound();
                }
            }
            return File(photo.Image, "image/jpeg"); //Notice it returns a file and not an OK result!
        }
    }
}
