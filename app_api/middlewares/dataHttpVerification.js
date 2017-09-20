import ErrorsHandler from '../common/errorsHandler'

let DataHttpVerification = (err, req, res, next) => {
  let errors = new ErrorsHandler()

  if (err.status === 400 && err.name === 'SyntaxError' && err.body) {
    errors.handleError(req, res, 400, {data: 'Bad request.'})
  }
}

export default [
  DataHttpVerification
]
