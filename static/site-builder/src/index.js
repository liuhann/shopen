import Vue from 'vue'
import VueRouter from 'vue-router'

import HttpClient from './common/httpclient';
import contextProto from './common/context';

import {SiteBuilder} from './pages/page';
import {website} from './models/website';

Vue.use(VueRouter);

const routes = [{
    path: '/',
    component: SiteBuilder
}];

function getContext() {
    const ctx = Object.create(contextProto);
    ctx.addModel('website', website);
    ctx.servers = {
        website: new HttpClient({})
    };
    return ctx;
}

Vue.mixin({
    beforeCreate: function() {
        this.ctx = getContext();
    }
});

const router = new VueRouter({
    routes,
});

const app = new Vue({
    router,
}).$mount('#xbn-app');