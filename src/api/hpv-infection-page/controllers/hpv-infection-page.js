"use strict";

/**
 *  hpv-infection-page controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::hpv-infection-page.hpv-infection-page",
  () => ({
    async find(ctx) {
      ctx.query = {
        filters: { slug: { $eq: ctx.params.slug } },
        populate: {
          Banner: {
            populate: {
              banner_share_cta: {
                populate: "*",
              },
              about_prevention_cta: {
                populate: "*",
              },
            },
          },
          Types_of_cancer: {
            populate: {
              type_points: {
                populate: "*",
              },
            },
          },
          how_it_spreads: {
            populate: {
              share_cta: {
                populate: "*",
              },
              how_it_spreads: {
                populate: "*",
              },
            },
          },
          Types_to_look_for: {
            populate: {
              hpv_types: {
                populate: "*",
              },
            },
          },
          health_effects: {
            populate: {
              cancer_types: {
                populate: "*",
              },
              share_cta: {
                populate: "*",
              },
            },
          },
          about_hpv: {
            populate: "*",
          },
          porg_prev_video: {
            populate: {
              play_btn: {
                populate: "*",
              },
            },
          },
          hpv_identification: {
            populate: {
              share_cta: {
                populate: "*",
              },
              identification_points: {
                populate: "*",
              },
            },
          },
          hpv_beyond_basics: {
            populate: {
              play_btn: {
                populate: "*",
              },
              hpv_videos: {
                populate: "*",
              },
            },
          },
          word_of_caution: {
            populate: {
              talk_to_an_expert_cta: {
                populate: "*",
              },
              caution_points: {
                populate: "*",
              },
            },
          },
          hpv_stats_section_text: {
            populate: "*",
          },
          hpv_stats_data: {
            populate: {
              stat_points: {
                populate: "*",
              },
            },
          },
          hpv_prevention: {
            populate: {
              text_only_prevention_points: {
                populate: "*",
              },
              with_icon_prevention_points: {
                populate: "*",
              },
              section_cta: {
                populate: "*",
              },
              share_cta: {
                populate: "*",
              },
            },
          },
          portrait_videos: {
            populate: {
              videos: {
                populate: "*",
              },
              play_btn: {
                populate: "*",
              },
            },
          },
          talk_to_gynac: {
            populate: {
              card_cta: {
                populate: "*",
              },
            },
          },
          page_faqs: {
            populate: {
              faqs: {
                populate: "*",
              },
              section_cta: {
                populate: "*",
              },
            },
          },
          footer_note_title: {
            populate: "*",
          },
          footer_note_description: {
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
        return sanitizedEntity[0];
      } else {
        ctx.status = 404;
        console.log(ctx);
        return ctx.throw(404, "Page not found");
      }
    },
  })
);
