import jwt from 'jwt-simple'
import moment from 'moment'
import config from '../config/config'

export default class JsonWebTokens {
  constructor () {
    this.config = config
  }

  createToken (user) {
    this.payload = {
      sub: user._id,
      email: user.email,
      privilege: user.privilege,
      iat: moment().unix(),
      exp: moment().add(5, 'days').unix()
    }
    return jwt.encode(this.payload, config.tokenSecret)
  }
}
