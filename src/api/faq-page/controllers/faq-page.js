"use strict";

/**
 *  faq-page controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::faq-page.faq-page", () => ({
  async find(ctx) {
    const faqCategoryId = ctx.request?.query?.catId; // client will send catId in query with the url
    ctx.query = {
      filters: {
        slug: { $eq: ctx.params.slug },
      },
      populate: {
        faq: {
          populate: {
            faq_category: {
              populate: "*",
            },
          },
          filters: faqCategoryId
            ? {
                faq_category: {
                  id: {
                    $eq: +faqCategoryId, // filter the faqs based on category
                  },
                },
              }
            : {}, // in case there is no category just send out all the faqs
        },
        site_meta_data: {
          populate: "*",
        },
      },
    };
    const { data } = await super.find(ctx);
    if (data.length) {
      const sanitizedEntity = await this.sanitizeOutput(data);
      return sanitizedEntity[0];
    } else {
      ctx.status = 404;
      console.log(ctx);
      return ctx.throw(404, "FAQs not added");
    }
  },
}));
