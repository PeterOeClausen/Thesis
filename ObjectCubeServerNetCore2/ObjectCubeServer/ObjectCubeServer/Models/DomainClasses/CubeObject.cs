using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ObjectCubeServer.Models.DomainClasses
{
    public class CubeObject
    {
        [Key]
        public int Id { get; set; }

        public FileType FileType { get; set; }

        public int? PhotoId { get; set; }
        public Photo Photo { get; set; }
        
        public List<ObjectTagRelation> ObjectTagRelations { get; set; }

        public int ThumbnailId { get; set; }
        public Thumbnail Thumbnail { get; set; }
    }
}
