/**
 * 数据存取方法以纯函数形式编写
 *
 * 这个纯函数接受2个参数
 * 1 params 调用参数。
 * 2 ctx 请求上下文信息。
 *
 * @param params
 * @param ctx
 * @returns {Promise.<*>}
 */
async function getAllSections(params, ctx) {
    const response = await ctx.servers.website.get('/api/section/settings');
    return response;
}

async function loadSectionTemplate(param, ctx) {
    return await ctx.servers.website.get('/static/sections/' + param.section);
}

async function loadStaticFile(path, ctx) {
    return await ctx.servers.website.get('/static' + path, {}, {
        authRequired: false,
        ignoreError: true
    });
}

async function getGlobalData(param, ctx) {
    const response = await ctx.servers.website.get('/api/global/data');
    return response.global;
}

async function updatePageSections(param, ctx) {
    return await ctx.servers.website.post('/api/setting/' + param.page, param);
}

async function getAllTemplates(param, ctx) {
    return await ctx.servers.website.get('/api/template/list');
}

async function getPageData(param, ctx) {
    return await ctx.servers.website.get(`/api/data/${param.template}/${param.key}`);
}

export const website = {
    loadStaticFile,
    getAllSections,
    loadSectionTemplate,
    updatePageSections,
    getGlobalData,
    getAllTemplates,
    getPageData
};
