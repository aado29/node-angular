import Authentication from '../../middlewares/ensureAuthenticated'

export default class Routes {
  constructor (config) {
    this.config = config || {}
    this.Authentication = new Authentication()
    this.routes = [
      {
        url: '/api/note/:id?',
        methods: {
          all: [this.Authentication.ensureAuthenticated],
          get: [config.controller.show],
          post: [config.controller.save],
          put: [config.controller.update],
          delete: [config.controller.destroy]
        }
      },
      {
        url: '/api/notes/:available?',
        methods: {
          get: [this.Authentication.ensureAuthenticated, config.controller.all]
        }
      }
    ]
  }
}
