const HttpError = require('./http-error')

async function validErrors (ctx, next) {
  try {
    await next()
  } catch (err) {
    if (err instanceof HttpError) {
      ctx.body = {
        status: err.code,
        errors: err.errors
      }
    } else {
      throw err
    }
  }
}

module.exports = validErrors
