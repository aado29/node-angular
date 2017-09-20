import usersScheme from './scheme'

export default class UsersModel {
  constructor (config) {
    this.config = config || {}
    this.Scheme = usersScheme
  }

  filter (arr, criteria) {
    return arr.filter((obj) => {
      return Object.keys(criteria).every((c) => {
        return obj[c] === criteria[c]
      })
    })
  }

  all (query, callback) {
    this.Scheme.find({}).sort({
      usermane: 1
    }).exec((err, users) => callback(err, users))
  }

  show (query, callback) {
    this.Scheme.findById(query.id, (err, user) => callback(err, user))
  }

  login (query, callback) {
    this.Scheme.findOne(query, (err, user) => callback(err, user))
  }

  save (query, callback) {
    let newItem = new this.Scheme(query)
    newItem.save((err, document) => callback(err, document))
  }

  update (query, callback) {
    this.Scheme.findOneAndUpdate({
      _id: query.id
    },
    query,
    { upsert: true }).exec((err, document) => callback(err, document))
  }

  destroy (query, callback) {
    this.Scheme.findOneAndRemove({
      _id: query.id
    }, (err, document) => callback(err, document))
  }

  recovery (query, callback) {
    this.Scheme.findOne({
      email: query.email
    }).exec((err, document) => callback(err, document))
  }

  findOne (query, callback) {
    this.Scheme.findOne(query).exec((err, document) => callback(err, document))
  }

  activate (query, callback) {
    this.Scheme.findOneAndUpdate({
      email: query.email
    }, {
      active: true
    }).exec((err, document) => callback(err, document))
  }
}
