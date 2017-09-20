import ModelNotes from '../modules/notes/model'

export default class ModelFactory {
  createModel (modulo) {
    let model
    switch (modulo) {
      case 'NOTAS':
        model = new ModelNotes()
        break
      default:
        model = null
    }
    return model
  }
}
