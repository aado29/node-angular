import mongoose from 'mongoose'
import globalConfig from '../config/config'
import async from 'async'
import _ from 'underscore'

let instance

class Db {
  constructor (config) {
    this.config = config || {}
    this.environment = globalConfig.environment
    this.host = this.config.host
    this.dataBase = this.config.dataBase
    this.connections = []
  }

  dropCollections (mongoose) {
    let collections = _.keys(mongoose.connection.collections)
    async.forEach(collections, (collectionName, done) => {
      let collection = mongoose.connection.collections[collectionName]
      collection.drop((err) => {
        if (err && err.message !== 'ns not found') {
          done(err)
        } else {
          done(null)
        }
      })
    }, () => console.log('All collections has been deleted'))
  }

  createConnection (config) {
    this.dataBase = (config) ? config.dataBase : this.dataBase
    let pass = true
    let connection

    this.connections.forEach((currentValue, index) => {
      if (currentValue.id === this.dataBase) {
        connection = currentValue.connection
        pass = false
      }
    })

    if (pass) {
      mongoose.Promise = global.Promise
      connection = mongoose.createConnection('mongodb://' + this.host + '/' + this.dataBase)

      let newConnection = {
        id: this.dataBase,
        connection: connection
      }

      console.log('Connected to Database ' + this.dataBase)

      this.connections.push(newConnection)
    }

    return connection
  }

  activeConnections () {
    return this.connections
  }

  closeConnection (positionConnection) {
    this.connections[positionConnection]['connection'].close()
  }
}

export default {
  getInstance: function () {
    if (!instance) {
      instance = new Db({
        host: globalConfig.mongo.host,
        dataBase: globalConfig.mongo.dataBase
      })
      instance.createConnection()
    }
    return instance
  },
  createConnection: function () {
    return instance.createConnection()
  },
  activeConnections: function () {
    return instance.activeConnections()
  }
}
