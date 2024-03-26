"use strict";

/**
 *  hpv-prevention-page controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::hpv-prevention-page.hpv-prevention-page",
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
          hero_section_about_cta: {
            populate: "*",
          },
          Types_of_cancer: {
            populate: {
              type_points: {
                populate: "*",
              },
            },
          },
          vaccination_section: {
            populate: {
              ways_to_prevent: {
                populate: "*",
              },
              vaccination_cta: {
                populate: "*",
              },
            },
          },
          vaccin_recommendation: {
            populate: {
              section_points: {
                populate: "*",
              },
            },
          },
          types_of_vaccines: {
            populate: {
              vaccine_1_stats: {
                populate: "*",
              },
              vaccine_2_stats: {
                populate: "*",
              },
              share_cta: {
                populate: "*",
              },
            },
          },
          vaccination_benefits: {
            populate: {
              vacc_ben_point: {
                populate: "*",
              },
              talk_to_an_expert_cta: {
                populate: "*",
              },
              share_cta: {
                populate: "*",
              },
            },
          },
          calling_parents: {
            populate: {
              section_points: {
                populate: "*",
              },
              talk_to_an_expert_cta: {
                populate: "*",
              },
              section_icon: {
                populate: "*",
              },
            },
          },
          take_the_step: {
            populate: {
              step_points: {
                populate: "*",
              },
            },
          },
          cost_effective: {
            populate: {
              locate_clinic_cta: {
                populate: "*",
              },
            },
          },
          safeguard_yourself: {
            populate: {
              get_vaccination: {
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
