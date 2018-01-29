import delegates from 'delegates';

function isFunction(object) {
    return !!(object && object.constructor && object.call && object.apply);
}

/**
 * 页面的上下文信息类
 */
const contextProto = {

    throwError(...args) {

    },

    models: {},

    onerror(err) {
        if (null == err) return;
    },

    toJSON() {
    },

    addModel(name, model) {
        const ctx = this;
        const injected = {};
        for(let key in model) {
            let modelLambda = model[key];
            if (isFunction(modelLambda)) {
                injected[key] = async function(params, options={}) {
                    let result = null;
                    try {
                        result = await modelLambda.call(null, params, ctx);
                        return result;
                    } catch (err) {
                        err.result = result;
                        if (options.showErrors) {
                            ctx.onerror(err);
                            return result;
                        } else {
                            throw err;
                        }
                    }
                };
            } else {
                injected[key] = modelLambda;
            }
        }
        this.models[name] = injected;
    }
}

//delegate httpclient （如果存在）的方法
delegates(contextProto, 'client')
    .method('get')
    .method('post')
    .method('request');

export default contextProto;