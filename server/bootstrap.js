'use strict';

const { logMessage } = require('./utils');

module.exports = async () => {
  const magicLink = strapi.plugin('magiclink');

  try {
    // Register permission actions.
    const actions = [
      {
        section: 'plugins',
        displayName: 'Access the plugin settings',
        uid: 'settings.read',
        pluginName: 'magiclink',
      },
      {
        section: 'plugins',
        displayName: 'Menu link to plugin settings',
        uid: 'menu-link',
        pluginName: 'magiclink',
      },
    ];
    await strapi.admin.services.permission.actionProvider.registerMany(actions);

  } catch (error) {
    strapi.log.error(logMessage(`Bootstrap failed with error "${error.message}".`));
  }
};
