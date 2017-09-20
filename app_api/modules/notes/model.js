import Scheme from './scheme'
import modelParent from '../../modules_class/modelParent'

export default class Model extends modelParent {
  constructor (config) {
    let schemeName = 'notes'
    super(config, Scheme, schemeName)
  }
}
