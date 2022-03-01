'use strict';

const createDefaultConfig = async () => {
  const pluginStore = strapi.store({
    environment: '',
    type: 'plugin',
    name: 'magiclink',
  });

  const value = { secretKey: ''};

  await pluginStore.set({ key: 'settings', value });

  return strapi
    .store({
      environment: '',
      type: 'plugin',
      name: 'magiclink',
    })
    .get({ key: 'settings' });
};

module.exports = ({ strapi }) => ({
  getConfig: async () => {
    let config = await strapi
      .store({
        environment: '',
        type: 'plugin',
        name: 'magiclink',
      })
      .get({ key: 'settings' });

    if (!config) {
      config = await createDefaultConfig();
    }

    return config;
  },
  saveSecretKey: async (ctx) => {
    const pluginStore = strapi.store({
      environment: '',
      type: 'plugin',
      name: 'magiclink',
    });

    const value = { secretKey: ctx.request.body.secretKey };
    await pluginStore.set({ key: 'settings', value });

    return strapi
      .store({
        environment: '',
        type: 'plugin',
        name: 'magiclink',
      })
      .get({ key: 'settings' });
  },
});
