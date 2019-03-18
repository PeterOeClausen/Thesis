namespace ObjectCubeServer.Models.DomainClasses
{
    /// <summary>
    /// Repressents a many-to-many relationship between CubeObjects and Tags.
    /// </summary>
    public class ObjectTagRelation
    {
        public int ObjectId { get; set; }
        public CubeObject CubeObject { get; set; }
        public int TagId { get; set; }
        public Tag Tag { get; set; }
    }
}