"use strict";

module.exports = ({ strapi }) => ({
  async fillData(ctx) {
    try {
      console.log("went to controller : : ")
      await strapi.plugin("ai-filler").service("aiFiller").fillData();
      ctx.body = { message: "Data filling process started" };
    } catch (error) {
      ctx.throw(500, "Data filling process failed", { error });
    }
  },
});
