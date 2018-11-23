namespace ObjectCubeServer.Models.DomainClasses
{
    public class ObjectTagRelation
    {
        public int ObjectId { get; set; }
        public CubeObject CubeObject { get; set; }
        public int TagId { get; set; }
        public Tag Tag { get; set; }
    }
}