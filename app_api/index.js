import http from 'http'
import config from './config/config'
import Mongodb from './database/mongodb'
import ExpressServer from './expressServer'

Mongodb.getInstance()
let app = new ExpressServer()
let server = http.createServer(app.expressServer)
server.listen(config.port, () => console.log('Server running at ' + config.rootURL + ':' + config.port))
