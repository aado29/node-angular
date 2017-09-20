import ModelFactory from './modelFactory'
import Async from 'async'

export default class controllerParent {
  constructor (config, Routes, Model, ErrorsHandler, Validations, saveRules, updateRules, deleteRules) {
    this.modelFactory = new ModelFactory()
    this.config = config || {}
    this.routes = new Routes({ controller: this }).routes
    this.GlobalModel = Model
    this.errors = new ErrorsHandler()
    this.validations = new Validations()
    this.saveRules = saveRules
    this.updateRules = updateRules
    this.deleteRules = deleteRules
    this.async = Async
    this.error = {
      error: {
        errorMessage: '',
        statusCode: 404
      },
      collection: {
        errorMessage: '',
        statusCode: 404
      }
    }
  }

  all (req, res) {
    this.model = new this.GlobalModel()
    if (req.params.disponible !== undefined) {
      req.body.disponible = req.params.disponible || ''
    }
    let query = req.body
    this.model.all(query, (err, documentos) => {
      this.error.error.statusCode = 500
      this.error.collection.errorMessage = 'Documennts not founds .'
      this.error.collection.statusCode = 404
      if (this.errors.handleErrorDb(req, res, err, documentos, this.error)) {
        res.set('Content-Type', 'application/json')
        return res.status(200).send(documentos)
      }
    })
  }

  main (req, res) {
    this.model = new this.GlobalModel()
  }

  show (req, res) {
    this.model = new this.GlobalModel()
  }

  save (req, res) {
    this.rules = {}
    this.model = new this.GlobalModel()
    this.error.error.errorMessage = 'Bad request'
    this.error.error.statusCode = 400

    if (!this.validations.hasProperty(req.body, this.rules) || !this.validations.areValids(req.body, this.saveRules)) {
      return this.errors.handleError(req, res, this.error.error.statusCode, { data: this.error.error.errorMessage })
    }

    let query = req.body
    this.model.save(query, (err, documento) => {
      this.error.error.statusCode = 500
      this.error.collection.errorMessage = 'Unprocessable Entity.'
      this.error.collection.statusCode = 422

      if (this.errors.handleErrorDb(req, res, err, documento, this.error)) {
        res.set('Content-Type', 'application/json')
        return res.status(201).send(documento)
      }
    })
  }

  update (req, res) {
    this.rules = {
      id: {
        required: true
      }
    }
    this.model = new this.GlobalModel()
    req.body.id = req.params.id || ''

    this.error.error.errorMessage = 'Bad request'
    this.error.error.statusCode = 400

    if (!this.validations.hasProperty(req.body, this.rules) || !this.validations.areValids(req.body, this.updateRules)) {
      return this.errors.handleError(req, res, this.error.error.statusCode, { data: this.error.error.errorMessage })
    }

    let query = req.body
    this.model.update(query, (err, document) => {
      this.error.error.statusCode = 500
      this.error.collection.errorMessage = 'Document not found.'
      this.error.collection.statusCode = 404

      if (this.errors.handleErrorDb(req, res, err, document, this.error)) {
        res.set('Content-Type', 'application/json')
        return res.status(200).send(document)
      }
    })
  }

  destroy (req, res) {
    let _this = this
    this.async.waterfall([
      this.async.apply(function (env, callback) {
        req.body.id = req.params.id || ''
        env.deleteRules = (env.deleteRules !== undefined) ? env.deleteRules : []
        if (env.deleteRules.length) {
          let deleteRule = env.deleteRules
          let model = env.modelFactory.createModel(deleteRule.collection)
          let query = {}
          query[deleteRule.forein_key] = req.body.id
          model.findOne(query, (err, document) => {
            env.error.error.statusCode = 500
            env.error.collection.errorMessage = 'Document not found.'
            env.error.collection.statusCode = 404

            if (!err) {
              if (document) {
                callback(null, false, env)
              } else {
                callback(null, true, env)
              }
            }
          })
        } else {
          callback(null, true, env)
        }
      }, _this),
      function (canDelete, env, callback) {
        if (canDelete) {
          env.model = new env.GlobalModel()
          req.body.id = req.params.id || ''
          env.rules = {
            id: {
              required: true
            }
          }
          env.error.error.errorMessage = 'Bad request'
          env.error.error.statusCode = 400

          if (!env.validations.hasProperty(req.body, env.rules) || !env.validations.areValids(req.body, env.rules)) {
            return env.errors.handleError(req, res, env.error.error.statusCode, { data: env.error.error.errorMessage })
          }

          let query = req.body
          env.model.destroy(query, (err, document) => {
            env.error.error.statusCode = 500
            env.error.collection.errorMessage = 'Document not found.'
            env.error.collection.statusCode = 404

            if (env.errors.handleErrorDb(req, res, err, document, env.error)) {
              callback(null, canDelete, env)
            }
          })
        } else {
          callback(null, canDelete, env)
        }
      }
    ], function (err, canDelete, env) {
      if (err) {
        console.log(err)
      }
      if (canDelete) {
        res.set('Content-Type', 'application/json')
        return res.status(200).send()
      } else {
        console.log('Cannot Delete')
        res.set('Content-Type', 'application/json')
        return res.status(200).send({'errCode': '201', 'errDescri': 'Cannot Delete'})
      }
    })
  }

  delete (req, res) {
    this.model = new this.GlobalModel()
    req.body.id = req.params.id || ''
    this.rules = {
      id: {
        required: true
      }
    }
    this.error.error.errorMessage = 'Bad request'
    this.error.error.statusCode = 400

    if (!this.validations.hasProperty(req.body, this.rules) || !this.validations.areValids(req.body, this.rules)) {
      return this.errors.handleError(req, res, this.error.error.statusCode, { data: this.error.error.errorMessage })
    }

    let query = req.body
    this.model.destroy(query, (err, document) => {
      this.error.error.statusCode = 500
      this.error.collection.errorMessage = 'Document not found.'
      this.error.collection.statusCode = 404

      if (this.errors.handleErrorDb(req, res, err, document, this.error)) {
        res.set('Content-Type', 'application/json')
        return res.status(200).send()
      }
    })
  }
}
