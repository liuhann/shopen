const DAOError = require('./dao-error')

async function daoErrorHandler (ctx, next) {
  try {
    await next()
  } catch (err) {
    if (err instanceof DAOError) {
      ctx.body = {
        status: err.code,
        error: err.error
      }
    } else {
      throw err
    }
  }
}

module.exports = daoErrorHandler
