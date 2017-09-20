import Authentication from '../../middlewares/ensureAuthenticated'

export default class Routes {
  constructor (config) {
    this.config = config || {}
    this.Authentication = new Authentication()
    this.routes = [
      {
        url: '/modules/note/:id?',
        methods: ['all', 'get', 'post', 'put', 'delete'],
        handlers: [
          this.Authentication.ensureAuthenticated,
          config.controller.main,
          config.controller.save,
          config.controller.update,
          config.controller.destroy
        ]
      },
      {
        url: '/modules/notes/:disponible?',
        methods: ['all', 'get'],
        handlers: [
          this.Authentication.ensureAuthenticated,
          config.controller.all
        ]
      }
    ]
  }
}
