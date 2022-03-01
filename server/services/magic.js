'use strict';

const _ = require('lodash')
const { Magic } = require('@magic-sdk/admin')

/**
 * Given a ctx, retrieve the bearer token
 * @param {any} ctx
 */
 const retrieveJWTToken = (ctx) => {
  const params = _.assign({}, ctx.request.body, ctx.request.query)

  let token = ''

  if (ctx.request && ctx.request.header && ctx.request.header.authorization) {
      const parts = ctx.request.header.authorization.split(' ')

      if (parts.length === 2) {
          const scheme = parts[0];
          const credentials = parts[1];
          if (/^Bearer$/i.test(scheme)) {
              token = credentials
          }
      } else {
          throw new Error(
              'Invalid authorization header format. Format is Authorization: Bearer [token]'
          )
      }
  } else if (params.token) {
      token = params.token
  } else {
      throw new Error('No authorization header was found')
  }

  return (token)
};

module.exports = ({ strapi }) => ({
  login: async (ctx) => {
    try{
      const { secretKey } = await strapi.plugins["magiclink"].services["settings"].getConfig()

      if(!secretKey || !secretKey.length) {
          throw new Error("No magic key, please set it up in the admin panel")
      }
      const magic = new Magic(secretKey)

      const token = retrieveJWTToken(ctx)
      await magic.token.validate(token) //This will throw if the token is not valid
      const issuer = await magic.token.getIssuer(token)
      const magicUser = await magic.users.getMetadataByIssuer(issuer)

      var user = await strapi.plugins['users-permissions'].services.user.fetch({
          email: magicUser.email
      })

      if(!user){
          //Create the user
          try{
              const advanced = await strapi
                  .store({
                      environment: '',
                      type: 'plugin',
                      name: 'users-permissions',
                      key: 'advanced',
                  })
                  .get()

              const defaultRole = await strapi
                  .query("plugin::users-permissions.role")
                  .findOne({ type: advanced.default_role }, [])

              user = await strapi.plugins['users-permissions'].services.user.add({
                  username: magicUser.email,
                  email: magicUser.email,
                  role: defaultRole,
                  confirmed: true,
                  provider: 'magic'
              })
          } catch(err){
              console.log('Exception in user creation in permissions', err)
          }
      }

      return user
  } catch(err){
      return null
  }
  },
});
