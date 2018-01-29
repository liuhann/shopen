"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const send = require('koa-send');
const themesPath = './themes';
function downloadAssets(ctx, next) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('assets', ctx.path.split('/').slice(2).join('/'));
        if (ctx.body != null || ctx.status !== 404)
            return;
        try {
            yield send(ctx, ctx.path.split('/').slice(2).join('/'), {
                root: themesPath + '/default/'
            });
        }
        catch (err) {
            if (err.status !== 404) {
                throw err;
            }
        }
    });
}
exports.downloadAssets = downloadAssets;
//# sourceMappingURL=AssetsController.js.map