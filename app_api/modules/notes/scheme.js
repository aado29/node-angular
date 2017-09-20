const mongoose = require('mongoose')
let Schema = mongoose.Schema

let scheme = new Schema({
  description: { type: String },
  short_description: { type: String },
  detalle: { type: String },
  available: { type: Boolean, default: true },
  created_by: { type: String },
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now }
})

export default scheme
