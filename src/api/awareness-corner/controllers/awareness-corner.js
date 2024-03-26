"use strict";

/**
 *  awareness-corner controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::awareness-corner.awareness-corner",
  () => ({
    async find(ctx) {
      ctx.query = {
        filters: { slug: { $eq: ctx.params.slug } },
        populate: {
          blogs_preview_cards: {
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
        return ctx.throw(404, "Awareness corner not added");
      }
    },
  })
);
