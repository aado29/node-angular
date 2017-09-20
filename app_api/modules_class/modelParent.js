import mongodb from '../database/mongodb'
import globalConfig from '../config/config'

export default class modelParent {
  constructor (config, Scheme, SchemeName) {
    this.config = config || {
      dataBase: globalConfig.mongo.dataBase
    }
    let singletonMasterDb = mongodb.getInstance()
    let masterConnection = singletonMasterDb.createConnection({
      dataBase: this.config.dataBase
    })
    this.Scheme = masterConnection.model(SchemeName, Scheme)
  }

  all (query, callback) {
    this.Scheme
      .find(query)
      .sort({
        codigo: 1
      })
      .exec((err, documents) => callback(err, documents))
  }

  show (query, callback) {
    this.Scheme.find({
      _id: query.id
    }).exec((err, documents) => callback(err, documents))
  }

  findOne (query, callback) {
    this.Scheme.findOne(query).exec((err, document) => callback(err, document))
  }

  save (query, callback) {
    let newItem = new this.Scheme(query)
    newItem.save((err, collection) => callback(err, collection))
  }

  update (query, callback) {
    delete query._id
    this.Scheme.findOneAndUpdate({
      _id: query.id
    }, query).exec((err, documents) => callback(err, documents))
  }

  destroy (query, callback) {
    this.Scheme.findOneAndRemove({
      _id: query.id
    }, (err, documents) => callback(err, documents))
  }

  remove (query, callback) {
    this.Scheme.remove(query, (err, documents) => callback(err, documents))
  }

  count (query, callback) {
    this.Scheme.count({}, (err, documents) => callback(err, { count: documents }))
  }
}
