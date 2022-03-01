'use strict';

module.exports = {
  type: 'admin',
  routes: [
    {
      method: 'GET',
      path: '/settings',
      handler: 'settings.getSettings',
      config: {
        policies: [],
      },
    },
    {
      method: 'POST',
      path: '/secretkey',
      handler: 'settings.saveSecretKey',
      config: {
        policies: [],
      },
    },
  ],
};
