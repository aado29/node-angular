import Authentication from '../../middlewares/ensureAuthenticated'

export default class Routes {
  constructor (config) {
    this.config = config || {}
    this.Authentication = new Authentication()
    this.routes = [
      {
        url: '/login',
        methods: ['post'],
        handlers: [config.controller.login]
      },
      {
        url: '/user/reset-password/:id/:salt',
        methods: ['post'],
        handlers: [config.controller.resetPass]
      },
      {
        url: '/user/recovery',
        methods: ['post'],
        handlers: [config.controller.recovery]
      },
      {
        url: '/user/registry',
        methods: ['post'],
        handlers: [config.controller.registry]
      },
      {
        url: '/user/activate-account/:id?',
        methods: ['get'],
        handlers: [config.controller.activateAccount]
      },
      {
        url: '/users',
        methods: ['all', 'get'],
        handlers: [this.Authentication.ensureAuthenticated, config.controller.all]
      },
      {
        url: '/user/:id?',
        methods: ['all', 'get', 'put', 'delete'],
        handlers: [this.Authentication.ensureAuthenticated, config.controller.show, config.controller.update, config.controller.destroy]
      }
    ]
  }
}
