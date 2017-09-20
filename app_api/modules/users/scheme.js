import config from '../../config/config'
import mongodb from '../../database/mongodb'
import mongoose from 'mongoose'

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
  password: { type: String },
  movilPhone: { type: String, default: '' },
  privilege: { type: String, default: '3' },
  check: { type: Boolean, default: false },
  active: { type: Boolean, default: false },
  checked: { type: Date },
  activate_code: { type: String },
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now }
})

export default masterConnection.model('users', usersSchema)
