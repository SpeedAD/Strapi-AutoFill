"use strict";

/**
 *  layout controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::layout.layout", () => ({
  async find(ctx) {
    ctx.query = {
      filters: { slug: { $eq: ctx.params.slug } },
      populate: {
        header: {
          populate: {
            social_cta: {
              populate: "*",
            },
            nav_links_desktop: {
              populate: "*",
            },
            talk_to_expert_cta: {
              populate: "*",
            },
            hamburger_list: {
              populate: "*",
            },
          },
        },
        footer: {
          populate: {
            footer_social: {
              populate: "*",
            },
            footer_menu: {
              populate: "*",
            },
            footer_reference_points: {
              populate: "*",
            },
            nav_links: {
              populate: "*",
            },
            footer_menu_image: {
              populate: "*",
            },
            logo_image: {
              populate: "*",
            },
          },
        },
      },
    };
    const response = await super.find(ctx);
    const data = response?.data;
    if (data?.id) {
      const sanitizedEntity = await this.sanitizeOutput(data);
      return sanitizedEntity;
    } else {
      ctx.status = 404;
      console.log(ctx);
      return ctx.throw(404, "Layout not added");
    }
  },
}));
