using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace ObjectCubeServer.Migrations
{
    public partial class initial : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Photo",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Image = table.Column<byte[]>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Photo", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Tags",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Name = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tags", x => x.Id);
                });

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
                name: "CubeObjects",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    FileType = table.Column<int>(nullable: false),
                    PhotoId = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CubeObjects", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CubeObjects_Photo_PhotoId",
                        column: x => x.PhotoId,
                        principalTable: "Photo",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
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

            migrationBuilder.CreateTable(
                name: "ObjectTagsRelations",
                columns: table => new
                {
                    ObjectId = table.Column<int>(nullable: false),
                    TagId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ObjectTagsRelations", x => new { x.ObjectId, x.TagId });
                    table.ForeignKey(
                        name: "FK_ObjectTagsRelations_CubeObjects_ObjectId",
                        column: x => x.ObjectId,
                        principalTable: "CubeObjects",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ObjectTagsRelations_Tags_TagId",
                        column: x => x.TagId,
                        principalTable: "Tags",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CubeObjects_PhotoId",
                table: "CubeObjects",
                column: "PhotoId");

            migrationBuilder.CreateIndex(
                name: "IX_Hierarchy_TagsetId",
                table: "Hierarchy",
                column: "TagsetId");

            migrationBuilder.CreateIndex(
                name: "IX_ObjectTagsRelations_TagId",
                table: "ObjectTagsRelations",
                column: "TagId");

            migrationBuilder.CreateIndex(
                name: "IX_TagTagsetRelation_TagsetId",
                table: "TagTagsetRelation",
                column: "TagsetId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Hierarchy");

            migrationBuilder.DropTable(
                name: "ObjectTagsRelations");

            migrationBuilder.DropTable(
                name: "TagTagsetRelation");

            migrationBuilder.DropTable(
                name: "CubeObjects");

            migrationBuilder.DropTable(
                name: "Tags");

            migrationBuilder.DropTable(
                name: "Tagset");

            migrationBuilder.DropTable(
                name: "Photo");
        }
    }
}
