"use strict";

/**
 *  blog controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::blog.blog", () => ({
  async find(ctx) {
    const category = ctx.request?.query?.category; // client will send category in query with the url (title)
    const isFeatured = ctx.request?.query?.isFeatured;
    const query = ctx.request?.query?.query;
    ctx.query = {
      filters: {
        // slug: { $eq: ctx.params.slug },
        ...(category
          ? {
              blog_category: {
                slug: {
                  $eq: category, // filter the blogs based on category
                },
              },
            }
          : {}),
        isFeatured: { $eq: isFeatured },
        main_title: query
          ? {
              $containsi: query,
            }
          : {},
      },
      populate: {
        share_cta: {
          populate: "*",
        },
        blog_authors: {
          populate: "*",
        },
        blog_section: {
          populate: "*",
        },
        blog_category: {
          populate: "*",
        },
        thumbnail: {
          populate: "*",
        },
      },
    };
    const { data } = await super.find(ctx);
    if (data.length) {
      const sanitizedEntity = await this.sanitizeOutput(data);
      return sanitizedEntity;
    } else {
      ctx.status = 404;
      console.log(ctx);
      return ctx.throw(404, "Blogs not added");
    }
  },
  async findOne(ctx) {
    ctx.query = {
      filters: {
        slug: { $eq: ctx.params.id },
      },
      populate: {
        share_cta: {
          populate: "*",
        },
        blog_authors: {
          populate: "*",
        },
        blog_section: {
          populate: "*",
        },
        blog_category: {
          populate: "*",
        },
        thumbnail: {
          populate: "*",
        },
        site_meta_data: {
          populate: "*",
        },
      },
    };
    const { data } = await super.find(ctx);

    if (data.length) {
      const sanitizedEntity = await this.sanitizeOutput(data);

      const blog = sanitizedEntity[0];

      const allBlogs = await super.find({ query: {} });

      /**@type {number[]} */
      const availableIds = allBlogs?.data?.map((b) => b.id);

      const indexOfCurrentBlog = availableIds.indexOf(blog.id);

      let prevPageId = null;
      let nextPageId = null;

      if (indexOfCurrentBlog > 0) {
        prevPageId =
          allBlogs?.data?.find(
            (b) => b.id === availableIds[indexOfCurrentBlog - 1]
          )?.attributes?.slug || null;
      }

      if (indexOfCurrentBlog <= availableIds.length - 2) {
        nextPageId =
          allBlogs?.data?.find(
            (b) => b.id === availableIds[indexOfCurrentBlog + 1]
          )?.attributes?.slug || null;
      }

      return {
        ...blog,
        prevPageId,
        nextPageId,
      };
    } else {
      ctx.status = 404;
      console.log(ctx);
      return ctx.throw(404, "Blog not found");
    }
  },
}));
