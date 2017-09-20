import Http from 'http'
import Crypto from 'crypto'
import Async from 'async'
import UsersRoutes from './routes'
import UsersModel from './model'
import ErrorsHandler from '../../common/errorsHandler'
import JsonWebTokens from '../../common/jsonWebTokens'
import NodeMailer from '../../common/nodeMailer'
import Validations from '../../common/validations'
import Mongodb from '../../database/mongodb'

export default class UsersController {
  constructor (config) {
    this.config = config || {}
    this.routes = new UsersRoutes({ controller: this }).routes
    this.model = new UsersModel()
    this.errors = new ErrorsHandler()
    this.jsonWebToken = new JsonWebTokens()
    this.NodeMailer = new NodeMailer()
    this.validations = new Validations()
    this.db = Mongodb.getInstance()
    this.http = Http
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
    let query = req.body
    if (this.validations.hasPermission(req, res, 'super')) {
      this.model.all(query, (err, users) => {
        this.error.error.statusCode = 500
        this.error.collection.errorMessage = 'Documents not founds.'
        this.error.collection.statusCode = 404
        if (this.errors.handleErrorDb(req, res, err, users, this.error)) {
          res.set('Content-Type', 'application/json')
          return res.status(200).send(users)
        }
      })
    }
  }

  show (req, res) {
    this.rules = {
      id: {
        required: true
      }
    }
    this.error.error.errorMessage = 'Bad request'
    this.error.error.statusCode = 400

    if (!this.validations.hasProperty(req.params, this.rules) || !this.validations.areValids(req.params, this.rules)) {
      return this.errors.handleError(req, res, this.error.error.statusCode, { data: this.error.error.errorMessage })
    }
    let query = req.params
    if (this.validations.hasPermission(req, res, 'show')) {
      this.model.show(query, (err, document) => {
        this.error.error.statusCode = 500
        this.error.collection.errorMessage = 'Unprocessable Entity.'
        this.error.collection.statusCode = 422
        if (this.errors.handleErrorDb(req, res, err, document, this.error)) {
          res.set('Content-Type', 'application/json')
          return res.status(201).send(document)
        }
      })
    }
  }

  update (req, res) {
    this.rules = {
      id: {
        required: true
      },
      username: {
        required: true
      },
      firstName: {
        required: true,
        firstOrLastName: true
      },
      lastName: {
        firstOrLastName: true
      },
      email: {
        required: true,
        email: true
      },
      movilPhone: {
        phone: true
      }
    }

    req.body.id = req.params.id || ''
    this.error.error.errorMessage = 'Bad request'
    this.error.error.statusCode = 400

    if (!this.validations.areValids(req.body, this.rules)) {
      return this.errors.handleError(req, res, this.error.error.statusCode, { data: this.error.error.errorMessage })
    }

    let query = req.body
    if (this.validations.owner(req, res)) {
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
  }

  destroy (req, res) {
    this.rules = {}

    this.error.error.errorMessage = 'Bad request'
    this.error.error.statusCode = 400

    if (!this.validations.hasProperty(req.body, this.rules) || !this.validations.areValids(req.body, this.rules)) {
      return this.errors.handleError(req, res, this.error.error.statusCode, { data: this.error.error.errorMessage })
    }

    req.body.id = req.params.id || ''
    let query = req.body
    if (this.validations.owner(req, res)) {
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

  login (req, res) {
    this.rules = {
      email: {
        required: true,
        email: true
      },
      password: {
        required: true
      }
    }

    this.error.error.errorMessage = 'Bad request'
    this.error.error.statusCode = 400

    if (!this.validations.hasProperty(req.body, this.rules) || !this.validations.areValids(req.body, this.rules)) {
      return this.errors.handleError(req, res, this.error.error.statusCode, { data: this.error.error.errorMessage })
    }

    let query = {
      email: req.body.email.toLowerCase(),
      password: req.body.password,
      active: true
    }
    this.model.login(query, (err, user) => {
      this.error.error.statusCode = 500
      this.error.collection.errorMessage = 'User not found'
      this.error.collection.statusCode = 404
      if (err) {
        console.log('Error Login', err)
        res.status(this.error.error.statusCode).send({data: this.error.error.errorMessage})
        return false
      }
      if (!user) {
        console.log('Error user doesn´t found')
        res.status(this.error.collection.statusCode).send({data: this.error.collection.errorMessage})
        return false
      } else {
        return res.status(200).json({
          token: this.jsonWebToken.createToken(user)
        })
      }
    })
  }

  recovery (req, res) {
    this.rules = {
      email: {
        required: true,
        email: true
      }
    }

    this.error.error.errorMessage = 'Bad request'
    this.error.error.statusCode = 400

    if (!this.validations.hasProperty(req.body, this.rules) || !this.validations.areValids(req.body, this.rules)) {
      return this.errors.handleError(req, res, this.error.error.statusCode, { data: this.error.error.errorMessage })
    }

    let query = {
      email: req.body.email.toLowerCase()
    }

    this.model.recovery(query, (err, user) => {
      this.error.error.statusCode = 500
      this.error.collection.errorMessage = 'User not found'
      this.error.collection.statusCode = 404

      if (this.errors.handleErrorDb(req, res, err, user, this.error)) {
        this.NodeMailer.connect()
        this.NodeMailer.sendMailRecovery(user)
        return res.status(200).json()
      }
    })
  }

  registry (req, res) {
    this.rules = {
      username: {
        required: true
      },
      firstName: {
        required: true,
        firstOrLastName: true
      },
      lastName: {
        firstOrLastName: true
      },
      email: {
        required: true,
        email: true
      },
      password: {
        required: true
      },
      movilPhone: {
        phone: true
      }
    }

    this.error.error.errorMessage = 'Bad request'
    this.error.error.statusCode = 400

    if (!this.validations.hasProperty(req.body, this.rules) || !this.validations.areValids(req.body, this.rules)) {
      return this.errors.handleError(req, res, this.error.error.statusCode, { data: this.error.error.errorMessage })
    }

    let query = req.body

    this.model.findOne({
      email: query.email
    }, (err, document) => {
      this.error.error.statusCode = 500
      this.error.collection.errorMessage = 'Bad request.'
      this.error.collection.statusCode = 400

      let has = !(document)

      if (this.errors.handleErrorDb(req, res, err, has, this.error)) {
        let md5Hash = Crypto.createHash('md5')
        md5Hash.update(query.email)
        query.activate_code = md5Hash.digest('hex')
        this.model.save(query, (err, document) => {
          this.error.error.statusCode = 500
          this.error.collection.errorMessage = 'Unprocessable Entity.'
          this.error.collection.statusCode = 422

          if (this.errors.handleErrorDb(req, res, err, document, this.error)) {
            res.set('Content-Type', 'application/json')
            this.NodeMailer.connect()
            this.NodeMailer.sendMailRegistry(document)
            return res.status(201).send(document)
          }
        })
      }
    })
  }

  activateAccount (req, res) {
    this.rules = {}

    this.error.error.errorMessage = 'Bad request'
    this.error.error.statusCode = 400

    if (!this.validations.hasProperty(req.body, this.rules) || !this.validations.areValids(req.body, this.rules)) {
      return this.errors.handleError(req, res, this.error.error.statusCode, { data: this.error.error.errorMessage })
    }

    let query = {
      activate_code: req.params.id || ''
    }
    if (!req.params.id.length) {
      return res.status(this.error.error.statusCode).send({data: this.error.error.errorMessage})
    }
    this.model.findOne(query, (err, user) => {
      this.error.error.statusCode = 500
      this.error.collection.errorMessage = 'User not found'
      this.error.collection.statusCode = 404

      if (this.errors.handleErrorDb(req, res, err, user, this.error)) {
        if (user.check) {
          return res.status(400).send({data: this.error.error.errorMessage})
        }
        this.model.activate(user, (err, user) => {
          if (this.errors.handleErrorDb(req, res, err, user, this.error)) {
            res.set('Content-Type', 'application/json')
            this.NodeMailer.connect()
            this.NodeMailer.sendMailWelcome(user)
            return res.status(201).send(user)
          }
        })
      }
    })
  }
}
