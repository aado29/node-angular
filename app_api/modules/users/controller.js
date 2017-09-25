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
    this.rules = {
      permission: 'super'
    }
    this.error.error.errorMessage = 'Bad request'
    this.error.error.statusCode = 400

    let query = req.body
    req.body.user = req.user || {}
    if (!this.validations.areValids(req.body, this.rules)) {
      return this.errors.handleError(req, res, this.error.error.statusCode, { data: this.error.error.errorMessage })
    }

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

  show (req, res) {
    this.rules = {
      permission: 'show',
      id: {
        required: true
      }
    }
    this.error.error.errorMessage = 'Bad request'
    this.error.error.statusCode = 400

    let query = req.params
    req.params.user = req.user || {}

    if (req.params.id == null) {
      req.params.id = req.user.sub
    }

    if (!this.validations.areValids(req.params, this.rules)) {
      return this.errors.handleError(req, res, this.error.error.statusCode, { data: this.error.error.errorMessage })
    }

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
          return res.status(200).send({data: 'The user was successfully deleted!'})
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

    if (!this.validations.areValids(req.body, this.rules)) {
      return this.errors.handleError(req, res, this.error.error.statusCode, { data: this.error.error.errorMessage })
    }

    let query = req.body
    this.model.login(query, (err, user) => {
      this.error.error.statusCode = 500
      this.error.collection.errorMessage = 'User not found'
      this.error.collection.statusCode = 404

      if (this.errors.handleErrorDb(req, res, err, user, this.error)) {
        res.set('Content-Type', 'application/json')
        return res.status(200).json({
          token: this.jsonWebToken.createToken(user)
        })
      }
    })
  }

  resetPass (req, res) {
    this.rules = {
      id: {
        required: true
      },
      salt: {
        required: true
      },
      password: {
        required: true
      }
    }

    req.body.id = req.params.id || ''
    req.body.salt = req.params.salt || ''
    this.error.error.errorMessage = 'Bad request'
    this.error.error.statusCode = 400

    if (!this.validations.areValids(req.body, this.rules)) {
      return this.errors.handleError(req, res, this.error.error.statusCode, { data: this.error.error.errorMessage })
    }

    if (this.validations.owner(req, res)) {
      let query = {
        id: req.body.id,
        hash: Crypto.pbkdf2Sync(req.body.password, req.body.salt, 1000, 64, 'sha1').toString('hex')
      }
      this.model.update(query, (err, user) => {
        this.error.error.statusCode = 500
        this.error.collection.errorMessage = 'User not found'
        this.error.collection.statusCode = 404

        if (this.errors.handleErrorDb(req, res, err, user, this.error)) {
          res.set('Content-Type', 'application/json')
          return res.status(201).send(user)
        }
      })
    }
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

    if (!this.validations.areValids(req.body, this.rules)) {
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
        return res.status(200).json({data: 'The email was successfully sent!'})
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

    if (!this.validations.areValids(req.body, this.rules)) {
      return this.errors.handleError(req, res, this.error.error.statusCode, { data: this.error.error.errorMessage })
    }

    let query = req.body

    this.model.findOne({
      email: query.email
    }, (err, document) => {
      this.error.error.statusCode = 500
      this.error.collection.errorMessage = 'Bad request: The email is used.'
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
    this.rules = {
      id: {
        required: true
      }
    }

    this.error.error.errorMessage = 'Bad request'
    this.error.error.statusCode = 400

    if (!this.validations.areValids(req.params, this.rules)) {
      return this.errors.handleError(req, res, this.error.error.statusCode, { data: this.error.error.errorMessage })
    }

    let query = {
      activate_code: req.params.id || ''
    }

    this.model.findOne(query, (err, user) => {
      this.error.error.statusCode = 500
      this.error.collection.errorMessage = 'User not found'
      this.error.collection.statusCode = 404

      if (this.errors.handleErrorDb(req, res, err, user, this.error)) {
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
