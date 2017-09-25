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
      controller.routes.forEach((currentRoute) => {
        this.router(currentRoute.url, currentRoute.methods, controller)
      })
    }

    this.expressServer.use(this.routes)
  }

  router (url, methods, controller) {
    let route = this.routes.route(url)
    for (let method in methods) {
      let handlers = methods[method]
      handlers.forEach((handler) => {
        route[method](handler.bind(controller))
      })
    }
  }
}
