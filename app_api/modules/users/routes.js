import Authentication from '../../middlewares/ensureAuthenticated'

export default class Routes {
  constructor (config) {
    this.config = config || {}
    this.Authentication = new Authentication()
    this.routes = [
      {
        url: '/login',
        methods: {
          post: [config.controller.login]
        }
      },
      {
        url: '/user/reset-password/:id/:salt',
        methods: {
          post: [config.controller.resetPass]
        }
      },
      {
        url: '/user/recovery',
        methods: {
          post: [config.controller.recovery]
        }
      },
      {
        url: '/user/registry',
        methods: {
          post: [config.controller.registry]
        }
      },
      {
        url: '/user/activate-account/:id?',
        methods: {
          get: [config.controller.activateAccount]
        }
      },
      {
        url: '/users',
        methods: {
          get: [this.Authentication.ensureAuthenticated, config.controller.all]
        }
      },
      {
        url: '/user/:id?',
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
