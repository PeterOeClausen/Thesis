﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using ObjectCubeServer.Models.DataAccess;

namespace ObjectCubeServer.Migrations
{
    [DbContext(typeof(ObjectContext))]
    partial class ObjectContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "2.1.4-rtm-31024")
                .HasAnnotation("Relational:MaxIdentifierLength", 128)
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            modelBuilder.Entity("ObjectCubeServer.Models.DomainClasses.CubeObject", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<int>("FileType");

                    b.Property<int?>("PhotoId");

                    b.HasKey("Id");

                    b.HasIndex("PhotoId");

                    b.ToTable("CubeObjects");
                });

            modelBuilder.Entity("ObjectCubeServer.Models.DomainClasses.Hierarchy", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<int>("TagId");

                    b.HasKey("Id");

                    b.HasIndex("TagId");

                    b.ToTable("Hierarchies");
                });

            modelBuilder.Entity("ObjectCubeServer.Models.DomainClasses.ObjectTagRelation", b =>
                {
                    b.Property<int>("ObjectId");

                    b.Property<int>("TagId");

                    b.HasKey("ObjectId", "TagId");

                    b.HasIndex("TagId");

                    b.ToTable("ObjectTagRelation");
                });

            modelBuilder.Entity("ObjectCubeServer.Models.DomainClasses.Photo", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("FileName");

                    b.Property<byte[]>("Image");

                    b.HasKey("Id");

                    b.ToTable("Photos");
                });

            modelBuilder.Entity("ObjectCubeServer.Models.DomainClasses.Tag", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("Name");

                    b.HasKey("Id");

                    b.ToTable("Tags");
                });

            modelBuilder.Entity("ObjectCubeServer.Models.DomainClasses.Tagset", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<int?>("HierarchyId");

                    b.Property<string>("Name");

                    b.HasKey("Id");

                    b.HasIndex("HierarchyId");

                    b.ToTable("Tagsets");
                });

            modelBuilder.Entity("ObjectCubeServer.Models.DomainClasses.TagTagsetRelation", b =>
                {
                    b.Property<int>("TagId");

                    b.Property<int>("TagsetId");

                    b.HasKey("TagId", "TagsetId");

                    b.HasIndex("TagsetId");

                    b.ToTable("TagTagsetRelations");
                });

            modelBuilder.Entity("ObjectCubeServer.Models.DomainClasses.CubeObject", b =>
                {
                    b.HasOne("ObjectCubeServer.Models.DomainClasses.Photo", "Photo")
                        .WithMany()
                        .HasForeignKey("PhotoId");
                });

            modelBuilder.Entity("ObjectCubeServer.Models.DomainClasses.Hierarchy", b =>
                {
                    b.HasOne("ObjectCubeServer.Models.DomainClasses.Tag", "Tag")
                        .WithMany()
                        .HasForeignKey("TagId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("ObjectCubeServer.Models.DomainClasses.ObjectTagRelation", b =>
                {
                    b.HasOne("ObjectCubeServer.Models.DomainClasses.CubeObject", "CubeObject")
                        .WithMany("ObjectTagRelations")
                        .HasForeignKey("ObjectId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("ObjectCubeServer.Models.DomainClasses.Tag", "Tag")
                        .WithMany("ObjectTagRelations")
                        .HasForeignKey("TagId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("ObjectCubeServer.Models.DomainClasses.Tagset", b =>
                {
                    b.HasOne("ObjectCubeServer.Models.DomainClasses.Hierarchy", "Hierarchy")
                        .WithMany()
                        .HasForeignKey("HierarchyId");
                });

            modelBuilder.Entity("ObjectCubeServer.Models.DomainClasses.TagTagsetRelation", b =>
                {
                    b.HasOne("ObjectCubeServer.Models.DomainClasses.Tag", "Tag")
                        .WithMany("TagTagsetRelations")
                        .HasForeignKey("TagId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("ObjectCubeServer.Models.DomainClasses.Tagset", "Tagset")
                        .WithMany("TagTagsetRelations")
                        .HasForeignKey("TagsetId")
                        .OnDelete(DeleteBehavior.Cascade);
                });
#pragma warning restore 612, 618
        }
    }
}
