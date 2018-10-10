using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace ObjectCubeServer.Migrations
{
    public partial class stuck : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Photo_CubeObject_ObjectId",
                table: "Photo");

            migrationBuilder.DropIndex(
                name: "IX_Photo_ObjectId",
                table: "Photo");

            migrationBuilder.DropColumn(
                name: "ObjectId",
                table: "Photo");

            migrationBuilder.DropColumn(
                name: "FileId",
                table: "CubeObject");

            migrationBuilder.AddColumn<int>(
                name: "PhotoId",
                table: "CubeObject",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Tagset",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Name = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tagset", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Hierarchy",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    TagsetId = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Hierarchy", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Hierarchy_Tagset_TagsetId",
                        column: x => x.TagsetId,
                        principalTable: "Tagset",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "TagTagsetRelation",
                columns: table => new
                {
                    TagId = table.Column<int>(nullable: false),
                    TagsetId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TagTagsetRelation", x => new { x.TagId, x.TagsetId });
                    table.ForeignKey(
                        name: "FK_TagTagsetRelation_Tags_TagId",
                        column: x => x.TagId,
                        principalTable: "Tags",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TagTagsetRelation_Tagset_TagsetId",
                        column: x => x.TagsetId,
                        principalTable: "Tagset",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CubeObject_PhotoId",
                table: "CubeObject",
                column: "PhotoId");

            migrationBuilder.CreateIndex(
                name: "IX_Hierarchy_TagsetId",
                table: "Hierarchy",
                column: "TagsetId");

            migrationBuilder.CreateIndex(
                name: "IX_TagTagsetRelation_TagsetId",
                table: "TagTagsetRelation",
                column: "TagsetId");

            migrationBuilder.AddForeignKey(
                name: "FK_CubeObject_Photo_PhotoId",
                table: "CubeObject",
                column: "PhotoId",
                principalTable: "Photo",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CubeObject_Photo_PhotoId",
                table: "CubeObject");

            migrationBuilder.DropTable(
                name: "Hierarchy");

            migrationBuilder.DropTable(
                name: "TagTagsetRelation");

            migrationBuilder.DropTable(
                name: "Tagset");

            migrationBuilder.DropIndex(
                name: "IX_CubeObject_PhotoId",
                table: "CubeObject");

            migrationBuilder.DropColumn(
                name: "PhotoId",
                table: "CubeObject");

            migrationBuilder.AddColumn<int>(
                name: "ObjectId",
                table: "Photo",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "FileId",
                table: "CubeObject",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Photo_ObjectId",
                table: "Photo",
                column: "ObjectId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Photo_CubeObject_ObjectId",
                table: "Photo",
                column: "ObjectId",
                principalTable: "CubeObject",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
