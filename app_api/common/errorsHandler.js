export default class ErrorsHandler {
  constructor (config) {
    this.config = config || {}
  }

  handleErrorDb (req, res, error, collections, infoError) {
    if (error) {
      res.status(infoError.error.statusCode).send({data: infoError.error.errorMessage})
      console.log('Handle Error: ' + error)
      return false
    }

    if (!collections) {
      res.status(infoError.collection.statusCode).send({data: infoError.collection.errorMessage})
      console.log('Collections Error: ' + infoError.collection.errorMessage)
      return false
    }

    return true
  }

  handleErrorPDF (req, res, error, doc, infoError) {
    if (error) {
      res.status(infoError.error.statusCode).send({data: infoError.error.errorMessage})
      console.log('Handle Error: ' + error)
      return false
    }
    return true
  }

  handleError (req, res, statusCode, data) {
    res.status(statusCode).send(data)
  }
}
