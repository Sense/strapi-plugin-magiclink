'use strict';

/**
 * Main controllers for settings handling.
 */
module.exports = {
  getConfig: async (ctx) => {
    const config = await strapi.plugin('magiclink').service('main').getConfig()
    ctx.send(config)
  },
  saveSecretKey: async (ctx) => {
    const config = await strapi.plugin('magiclink').service('main').saveSecretKey(ctx)
    ctx.send(config)
  },
};
