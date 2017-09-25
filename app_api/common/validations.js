import sanitize from 'mongo-sanitize'
import _ from 'underscore'

export default class Validations {
  constructor (config) {
    this.config = config || {}
    this.regularExpressions = {
      email: this.isEmail,
      required: this.isEmpty,
      number: this.isNumber,
      phone: this.isPhone,
      firstOrLastName: this.firstOrLastName,
      date: this.isDate,
      string: this.isString,
      object: this.object,
      array: this.isArray,
      radio: this.selectOrRadio,
      select: this.selectOrRadio,
      checkbox: this.checkbox,
      intervalsOfYears: this.intervalsOfYears,
      booleann: this.booleann,
      optionallyRequired: this.optionallyRequired
    }
    this.valid = true
    this.privileges = {
      0: ['create', 'edit', 'delete', 'show', 'super'],
      1: ['create', 'edit', 'delete', 'show'],
      2: ['create', 'show'],
      3: ['show']
    }
  }

  isEmail (value) {
    return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,4})+$/.test(value)
  }

  isEmpty (value) {
    return (value == null || value.length === 0 || /^\s+$/.test(value))
  }

  isNumber (value) {
    return /^[0-9]+$/.test(value)
  }

  firstOrLastName (value) {
    return /^[A-Za-záéíóúñ]{2,}([\s][A-Za-záéíóúñ]{2,})?$/.test(value)
  }

  isDate (value) {
    let date = new Date(value)
    return (date.toString() !== 'Invalid Date')
  }

  isString (value) {
    return (typeof value === 'string')
  }

  object (fields, rules, that) {
    return (typeof fields === 'object') ? that.areValids(fields, rules) : false
  }

  isPhone (value) {
    return (/^\(([0-9]{3,3})\)\s([0-9]{3,3})-([0-9]{4,4})$/.test(value))
  }

  isArray (value) {
    return (value instanceof Array)
  }

  selectOrRadio (value, values) {
    return (values.indexOf(value) !== -1)
  }

  checkbox (checkboxT, checkboxF) {
    return !(checkboxT === true && checkboxF === true)
  }

  intervalsOfYears (value) {
    return (/^[0-9]{4}\s-\s[0-9]{4}$/.test(value))
  }

  booleann (value) {
    return (typeof value === 'boolean')
  }

  optionallyRequired (fields, that) {
    let empty = 0

    for (let field in fields) {
      if (that.isEmpty(fields[field])) {
        empty++
      }
    }
    return (empty === _.size(fields) || empty === 0)
  }

  hasPermission (privilege, permission) {
    let permissions = this.privileges[privilege] ? this.privileges[privilege] : this.privileges[3]
    for (let i in permissions) {
      if (permissions[i] === permission) {
        return true
      }
    }
    return false
  }

  hasProperty (object, rules) {
    for (let property in rules) {
      if (!object.hasOwnProperty(property)) {
        console.log('Error of validation: The object has not the property: ' + property)
        return false
      } else {
        this.valid = true
      }
    }
    return this.valid
  }

  owner (req, res) {
    let privilege = req.user.privilege
    let permissions = this.privileges[privilege] ? this.privileges[privilege] : this.privileges[3]
    let isSuper = false
    let isOwner = (req.user.sub === req.body.id)
    for (let i in permissions) {
      if (permissions[i] === 'super') {
        isSuper = true
      }
    }
    if (isSuper || isOwner) {
      return true
    } else {
      res.set('Content-Type', 'application/json')
      res.status(403).send({data: 'Forbidden'})
      return false
    }
  }

  areValids (req, rules) {
    if (!this.isEmpty(rules['permission'])) {
      let privilege = req.user.privilege
      if (!this.hasPermission(privilege, rules['permission'])) {
        console.log('Error Permission: the user has no permission like ' + rules['permission'])
        return false
      }
    }

    for (let field in rules) {
      if (!this.isEmpty(req[field])) {
        req[field] = sanitize(req[field])
      }

      for (let property in rules[field]) {
        if (rules[field]['required'] === undefined && property !== 'object' && property !== 'checkbox') {
          if (this.isEmpty(req[field])) {
            continue
          }
        }

        if (property === 'email' && this.regularExpressions[property](req[field]) === false) {
          console.log('Error of validation: Fail email ' + field + ' of value ' + req[field])
          return false
        }

        if (property === 'required' && this.regularExpressions[property](req[field]) === true) {
          console.log('Error of validation: Fail required ' + field + ' of value ' + req[field])
          return false
        }

        if (property === 'number' && this.regularExpressions[property](req[field]) === false) {
          console.log('Error of validation: Fail number ' + field + ' of value ' + req[field])
          return false
        }

        if (property === 'firstOrLastName' && this.regularExpressions[property](req[field]) === false) {
          console.log('Error of validation: Fail firstOrLastName ' + field + ' of value ' + req[field])
          return false
        }

        if (property === 'date' && this.regularExpressions[property](req[field]) === false) {
          console.log('Error of validation: Fail date ' + field + ' of value ' + req[field])
          return false
        }

        if (property === 'string' && this.regularExpressions[property](req[field]) === false) {
          console.log('Error of validation: Fail string ' + field + ' of value ' + req[field])
          return false
        }

        if (property === 'object' && this.regularExpressions[property](req[field], rules[field]['fields'], this) === false) {
          console.log('Error of validation: Fail object ' + field + ' of value ' + req[field])
          return false
        }

        if (property === 'radio' && this.regularExpressions[property](req[field], rules[field]['values']) === false) {
          console.log('Error of validation: Fail radio ' + field + ' of value ' + req[field])
          return false
        }

        if (property === 'select' && this.regularExpressions[property](req[field], rules[field]['values']) === false) {
          console.log('Error of validation: Fail select ' + field + ' of value ' + req[field])
          return false
        }

        if (property === 'checkbox' && this.regularExpressions[property](req[field + 'T'], req[field + 'F']) === false) {
          console.log('Error of validation: Fail checkbox ' + field + ' of value ' + req[field])
          return false
        }

        if (property === 'intervalsOfYears' && this.regularExpressions[property](req[field]) === false) {
          console.log('Error of validation: Fail intervalsOfYears ' + field + ' of value ' + req[field])
          return false
        }

        if (property === 'booleann' && this.regularExpressions[property](req[field]) === false) {
          console.log('Error of validation: Fail booleann ' + field + ' of value ' + req[field])
          return false
        }

        if (property === 'optionallyRequired' && this.regularExpressions[property](req[field], this) === false) {
          console.log('Error of validation: Fail optionallyRequired ' + field + ' of value ' + req[field])
          return false
        }

        if (property === 'phone' && this.regularExpressions[property](req[field]) === false) {
          console.log('Error of validation: Fail isPhone ' + field + ' of value ' + req[field])
          return false
        }

        if (property === 'array' && this.regularExpressions[property](req[field]) === false) {
          console.log('Error of validation: Fail Array Required ' + field + ' of value ' + req[field])
          return false
        }
      }
    }
    return true
  }
}
