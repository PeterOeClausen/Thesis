using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ObjectCubeServer.Models.DomainClasses
{
    /// <summary>
    /// Repressents an Object in the M^3 datamodel.
    /// Has a fileName and a Thumbnail (visual presentation of the object).
    /// Is tagged with tags in ObjectTagRelation (many to many relation table to Tag).
    /// In the fututre i can repressent different types of files.
    /// </summary>
    public class CubeObject
    {
        [Key]
        public int Id { get; set; }

        public string FileName { get; set; }

        public FileType FileType { get; set; }

        public int? PhotoId { get; set; }
        public Photo Photo { get; set; }
        
        public List<ObjectTagRelation> ObjectTagRelations { get; set; }

        public int ThumbnailId { get; set; }
        public Thumbnail Thumbnail { get; set; }
    }
}
