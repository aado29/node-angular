import jwt from 'jwt-simple'
import moment from 'moment'
import config from '../config/config'
import ErrorsHandler from '../common/errorsHandler'

export default class Authentication {
  constructor () {
    this.errors = new ErrorsHandler()
  }

  ensureAuthenticated (req, res, next) {
    if (!req.headers.authorization) {
      return this.errors.handleError(req, res, 401, { data: 'Unauthorized' })
    }

    let token = req.headers.authorization.split(' ')[1]
    let payload = jwt.decode(token, config.tokenSecret)

    if (payload.exp <= moment().unix()) {
      return this.errors.handleError(req, res, 401, { data: 'Token has expired' })
    }

    req.user = payload
    next()
  }
}
