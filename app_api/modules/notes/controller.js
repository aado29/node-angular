import Routes from './routes'
import Model from './model'
import ErrorsHandler from '../../common/errorsHandler'
import Validations from '../../common/validations'
import controllerParent from '../../modules_class/controllerParent'

export default class Controller extends controllerParent {
  constructor (config) {
    let saveRules = Controller.saveRules()
    let updateRules = Controller.updateRules()
    let deleteRules = Controller.deleteRules()
    super(config, Routes, Model, ErrorsHandler, Validations, saveRules, updateRules, deleteRules)
  }

  static saveRules () {
    return {
      permission: 'create',
      description: {
        required: true
      },
      short_description: {
        required: true
      }
    }
  }

  static updateRules () {
    return {
      permission: 'edit'
      id: {
        required: true
      },
      description: {
        required: true
      },
      short_description: {
        required: true
      }
    }
  }

  static deleteRules () {
    return {}
  }

  // static on_delete_rules () {
  //  return [{
  //    collection: 'COLLECTION', // tabla a la que se relaciona
  //    local_key: '_id', // id con el que se relaciona la tabla actual
  //    forein_key: 'nota' // id con el que relacionara el id local
  //  }]
  // }
}
