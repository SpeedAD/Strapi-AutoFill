"use strict";

/**
 *  adolescence-prevention controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::adolescence-prevention.adolescence-prevention",
  () => ({
    async find(ctx) {
      ctx.query = {
        filters: { slug: { $eq: ctx.params.slug } },
        populate: {
          hero_section: { populate: "*" },
          how_to_prevent: { populate: "*" },
          hpv_cancers: {
            populate: {
              section_points: {
                populate: "*",
              },
            },
          },
          daughter_protection: {
            populate: {
              main_image: {
                populate: "*",
              },
              section_points: {
                populate: "*",
              },
              consult_doctor_cta: {
                populate: "*",
              },
            },
          },
          son_protection: {
            populate: {
              main_image: {
                populate: "*",
              },
              section_points: {
                populate: "*",
              },
              consult_doctor_cta: {
                populate: "*",
              },
            },
          },
          hpv_beyond_the_basics: {
            populate: {
              play_btn: {
                populate: "*",
              },
              hpv_videos: {
                populate: "*",
              },
            },
          },
          vaccination_advantages: {
            populate: {
              section_animated_vid: {
                populate: "*",
              },
              section_points: {
                populate: "*",
              },
            },
          },
          myths: { populate: "*" },
          portrait_videos: {
            populate: {
              play_btn: {
                populate: "*",
              },
              videos: {
                populate: "*",
              },
            },
          },
          protect_your_child: { populate: "*" },
          page_faqs: { populate: "*" },
          footer_note_title: { populate: "*" },
          footer_note_description: { populate: "*" },
          site_meta_data: { populate: "*" },
        },
      };
      const { data } = await super.find(ctx);
      if (data.length) {
        const sanitizedEntity = await this.sanitizeOutput(data);
        return sanitizedEntity[0];
      } else {
        ctx.status = 404;
        return ctx.throw(404, "Page not found");
      }
    },
  })
);
