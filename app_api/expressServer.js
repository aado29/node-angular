import express from 'express'
import controllers from './controllers/'
import middlewares from './middlewares'

export default class ExpressServer {
  constructor (config) {
    config = config || {}
    this.expressServer = express()
    this.routes = express.Router()

    for (let middleware in middlewares) {
      middlewares[middleware].forEach((currentValue, index) => {
        this.expressServer.use(currentValue)
      })
    }

    for (let index in controllers) {
      let controller = new controllers[index]()
      controller.routes.forEach((currentValue, index) => {
        let route = controller.routes[index]
        this.router(route.methods, route.url, route.handlers, controller)
      })
    }
    this.expressServer.use(this.routes)
  }

  router (methods, urlController, handlers, controller) {
    let url = this.routes.route(urlController)
    methods.forEach((currentValue, index) => {
      url[currentValue](handlers[index].bind(controller))
    })
  }
}
