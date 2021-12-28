'use strict';

/**
 * Main controllers for settings handling.
 */
module.exports = {
  getSettings: async (ctx) => {
    const config = await strapi.plugin('magiclink').service('settings').getConfig()
    ctx.send(config)
  },
  saveSecretKey: async (ctx) => {
    const config = await strapi.plugin('magiclink').service('settings').saveSecretKey(ctx)
    ctx.send(config)
  },
};
