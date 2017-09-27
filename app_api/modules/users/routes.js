import Authentication from '../../middlewares/ensureAuthenticated'

export default class Routes {
  constructor (config) {
    this.config = config || {}
    this.Authentication = new Authentication()
    this.routes = [
      {
        url: '/auth/login',
        methods: {
          post: [config.controller.login]
        }
      },
      {
        url: '/auth/registry',
        methods: {
          post: [config.controller.registry]
        }
      },
      {
        url: '/api/user/reset-password/:id/:salt',
        methods: {
          post: [config.controller.resetPass]
        }
      },
      {
        url: '/api/user/recovery',
        methods: {
          post: [config.controller.recovery]
        }
      },
      {
        url: '/api/user/activate-account/:id?',
        methods: {
          get: [config.controller.activateAccount]
        }
      },
      {
        url: '/api/users',
        methods: {
          get: [this.Authentication.ensureAuthenticated, config.controller.all]
        }
      },
      {
        url: '/api/user/:id?',
        methods: {
          all: [this.Authentication.ensureAuthenticated],
          get: [config.controller.show],
          put: [config.controller.update],
          delete: [config.controller.destroy]
        }
      }
    ]
  }
}
