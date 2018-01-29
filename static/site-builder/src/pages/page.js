
// 这里指定每个页面组件的动态引入方式
// await import 是ES6标准引入方式，vue-router官方是 以下写法：
// const Foo = r => require.ensure([], () => r(require('./Foo.vue')), 'group-foo') 是等价的
// 通过  /* webpackChunkName: "githuber" */ 这样的方式指定 都打到同一个包中
// 开发人员只需要修改 vue文件的位置、给出组件名称就可以了
//import PageUserList from './page/userlist/page.vue'

//const PageUserList = async resolve => resolve(await import(/* webpackChunkName: "githuber" */'./page/userlist/page.vue'));
//const UserDetail = async resolve => resolve(await import(/* webpackChunkName: "githuber" */'./page/hello/page.vue'));

import  SiteBuilder  from /* webpackChunkName: "site-builder" */ './main/site-builder.vue';

export {
    SiteBuilder,
};
