"use strict";

/**
 *  float-follow-button controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::float-follow-button.float-follow-button",
  () => ({
    async find(ctx) {
      ctx.query = {
        filters: { slug: { $eq: ctx.params.slug } },
        populate: {
          social_links: {
            populate: "*",
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
        return ctx.throw(404, "Floating follow button not added");
      }
    },
  })
);
