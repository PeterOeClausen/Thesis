using Microsoft.EntityFrameworkCore.Migrations;

namespace ObjectCubeServer.Migrations
{
    public partial class AddedFileNameToPhoto : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "FileName",
                table: "Photo",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FileName",
                table: "Photo");
        }
    }
}
