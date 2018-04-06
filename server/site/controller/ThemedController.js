const send = require('koa-send')

const debug = require('debug')('site:controller')

/**
 * render the index web page
 * @param ctx
 * @param next
 * @returns {Promise<void>}
 */
async function renderIndex (ctx, next) {
  // 根模板、读取页面模板配置
  const pageSetting = await loader.loadPageSetting('index')
}

/**
 * To render a static website page
 * @param {Application.Context} ctx
 * @param {Function} next
 */
async function renderSitePage (ctx, next) {
  // Page name
  const page = ctx.params.page || 'index'

  // ignore none-site page
  const siteRoots = await ctx.services.theme.getAvailableRoots()
  if (siteRoots.indexOf(page) === -1) {
    await next()
    return
  }
  let paths = []
  if (ctx.params[0]) {
    paths = ctx.params[0].split('/')
  }
  const rendered = await ctx.services.theme.render(page, paths)

  ctx.body = rendered

  await next()
}

async function downloadAssets (ctx, next) {
  if (ctx.body != null || ctx.status !== 404) return
  try {
    await send(ctx, ctx.path.split('/').slice(2).join('/'), {
      root: themesPath
    })
  } catch (err) {
    if (err.status !== 404) {
      throw err
    }
  }
}

module.exports = {
  renderSitePage
}
