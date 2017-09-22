import mongoose from 'mongoose'
import crypto from 'crypto'
import config from '../../config/config'
import mongodb from '../../database/mongodb'

let singletonMasterDb = mongodb.getInstance()
let masterConnection = singletonMasterDb.createConnection({
  dataBase: config.mongo.dataBase
})
let Schema = mongoose.Schema

let usersSchema = new Schema({
  username: { type: String },
  firstName: { type: String },
  lastName: { type: String },
  email: { type: String, unique: true },
  salt: { type: String },
  hash: { type: String },
  movilPhone: { type: String, default: '' },
  privilege: { type: String, default: '3' },
  check: { type: Boolean, default: false },
  active: { type: Boolean, default: false },
  checked: { type: Date },
  activate_code: { type: String },
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now }
})

usersSchema.methods.setPassword = function (password) {
  this.salt = crypto.randomBytes(16).toString('hex')
  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha1').toString('hex')
}

usersSchema.methods.validPassword = function (password) {
  var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha1').toString('hex')
  return this.hash === hash
}

export default masterConnection.model('users', usersSchema)
