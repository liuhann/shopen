webpackJsonp([5],{"/sFg":function(e,t){},"3ClX":function(e,t,n){"use strict";var i,s,o=n("VERG"),r=n("aHQ8"),c=1459707606518,a=6;e.exports=function(e){var t="",n=Math.floor(.001*(Date.now()-c));return n===s?i++:(i=0,s=n),t+=o(r.lookup,a),t+=o(r.lookup,e),i>0&&(t+=o(r.lookup,i)),t+=o(r.lookup,n)}},"49lo":function(e,t){},"9tMA":function(e,t,n){"use strict";var i=n("aHQ8");e.exports=function(e){if(!e||"string"!=typeof e||e.length<6)return!1;for(var t=i.characters(),n=e.length,s=0;s<n;s++)if(-1===t.indexOf(e[s]))return!1;return!0}},AaOd:function(e,t){},Fole:function(e,t,n){"use strict";var i=1;e.exports={nextValue:function(){return(i=(9301*i+49297)%233280)/233280},seed:function(e){i=e}}},Kg7Z:function(e,t,n){"use strict";var i=n("aHQ8"),s=(n("VERG"),n("PIIv")),o=n("3ClX"),r=n("9tMA"),c=n("sSHN")||0;function a(){return o(c)}e.exports=a,e.exports.generate=a,e.exports.seed=function(t){return i.seed(t),e.exports},e.exports.worker=function(t){return c=t,e.exports},e.exports.characters=function(e){return void 0!==e&&i.characters(e),i.shuffled()},e.exports.decode=s,e.exports.isValid=r},PIIv:function(e,t,n){"use strict";var i=n("aHQ8");e.exports=function(e){var t=i.shuffled();return{version:15&t.indexOf(e.substr(0,1)),worker:15&t.indexOf(e.substr(1,1))}}},VERG:function(e,t,n){"use strict";var i=n("Zkn8");e.exports=function(e,t){for(var n,s=0,o="";!n;)o+=e(t>>4*s&15|i()),n=t<Math.pow(16,s+1),s++;return o}},Z8es:function(e,t,n){"use strict";e.exports=n("Kg7Z")},Zkn8:function(e,t,n){"use strict";var i="object"==typeof window&&(window.crypto||window.msCrypto);e.exports=function(){if(!i||!i.getRandomValues)return 48&Math.floor(256*Math.random());var e=new Uint8Array(1);return i.getRandomValues(e),48&e[0]}},aHQ8:function(e,t,n){"use strict";var i,s,o,r=n("Fole"),c="0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-";function a(){o=!1}function u(e){if(e){if(e!==i){if(e.length!==c.length)throw new Error("Custom alphabet for shortid must be "+c.length+" unique characters. You submitted "+e.length+" characters: "+e);var t=e.split("").filter(function(e,t,n){return t!==n.lastIndexOf(e)});if(t.length)throw new Error("Custom alphabet for shortid must be "+c.length+" unique characters. These characters were not unique: "+t.join(", "));i=e,a()}}else i!==c&&(i=c,a())}function l(){return o||(o=function(){i||u(c);for(var e,t=i.split(""),n=[],s=r.nextValue();t.length>0;)s=r.nextValue(),e=Math.floor(s*t.length),n.push(t.splice(e,1)[0]);return n.join("")}())}e.exports={characters:function(e){return u(e),i},seed:function(e){r.seed(e),s!==e&&(a(),s=e)},lookup:function(e){return l()[e]},shuffled:l}},mvHQ:function(e,t,n){e.exports={default:n("qkKv"),__esModule:!0}},qkKv:function(e,t,n){var i=n("FeBl"),s=i.JSON||(i.JSON={stringify:JSON.stringify});e.exports=function(e){return s.stringify.apply(s,arguments)}},sSHN:function(e,t,n){"use strict";e.exports=0},"yhV+":function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var i=n("mvHQ"),s=n.n(i),o=n("BO1k"),r=n.n(o),c=n("Xxa5"),a=n.n(c),u=n("exGp"),l=n.n(u),f=n("7+uW"),d=n("sj81"),p={name:"view-section",props:{name:{type:String},data:{type:Object}},render:function(e){return e("so-"+this.name,{props:{data:this.data}},[])}},v=n("Z8es"),h=n.n(v),m={name:"screen-preview",components:{"view-section":p},props:{},data:function(){return{sections:[]}},methods:{addSection:function(e){e.id=h.a.generate(),e.hover=!1,delete e.tmpl,this.sections.push(e)},moveUp:function(e){if(this.sections[0]!==e)for(var t=0;t<this.sections.length;t++)if(this.sections[t]===e){var n=this.sections[t-1];this.$set(this.sections,t-1,e),this.$set(this.sections,t,n);break}},moveDown:function(e){if(this.sections[this.sections.length-1]!==e)for(var t=0;t<this.sections.length;t++)if(this.sections[t]===e){var n=this.sections[t+1];this.$set(this.sections,t+1,e),this.$set(this.sections,t,n);break}},editSection:function(e){this.$emit("edit-section",e)},choose:function(e){var t=!0,n=!1,i=void 0;try{for(var s,o=r()(this.sections);!(t=(s=o.next()).done);t=!0){s.value.hover=!1}}catch(e){n=!0,i=e}finally{try{!t&&o.return&&o.return()}finally{if(n)throw i}}e.hover=!0},unChoose:function(e){e.hover=!1},getSections:function(){return this.sections},removeSection:function(e){for(var t=0;t<this.sections.length;t++)if(this.sections[t]===e){this.sections.splice(t,1);break}}}},g={render:function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("transition-group",{staticClass:"screen-content",attrs:{name:"flip-list",tag:"div"}},e._l(e.sections,function(t){return n("div",{key:t.id,staticClass:"section",on:{click:function(n){e.choose(t)}}},[t.hover?n("div",{staticClass:"operations",on:{click:function(n){if(n.stopPropagation(),n.target!==n.currentTarget)return null;e.unChoose(t)}}},[n("el-button",{attrs:{type:"primary",icon:"el-icon-arrow-up",circle:""},on:{click:function(n){n.stopPropagation(),e.moveUp(t)}}}),e._v(" "),n("el-button",{attrs:{type:"primary",icon:"el-icon-edit",circle:""},on:{click:function(n){n.stopPropagation(),e.editSection(t)}}}),e._v(" "),n("el-button",{attrs:{type:"primary",icon:"el-icon-arrow-down",circle:""},on:{click:function(n){n.stopPropagation(),e.moveDown(t)}}})],1):e._e(),e._v(" "),n("view-section",{attrs:{name:t.name,data:t.data}})],1)}))},staticRenderFns:[]};var x=n("VU/8")(m,g,!1,function(e){n("/sFg")},null,null).exports,b={name:"ElButton",inject:{elForm:{default:""},elFormItem:{default:""}},props:{type:{type:String,default:"default"},size:String,icon:{type:String,default:""},nativeType:{type:String,default:"button"},loading:Boolean,disabled:Boolean,plain:Boolean,autofocus:Boolean,round:Boolean,circle:Boolean},computed:{_elFormItemSize:function(){return(this.elFormItem||{}).elFormItemSize},buttonSize:function(){return this.size||this._elFormItemSize||(this.$ELEMENT||{}).size},buttonDisabled:function(){return this.disabled||(this.elForm||{}).disabled}},methods:{handleClick:function(e){this.$emit("click",e)}}},w={render:function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("button",{staticClass:"el-button",class:[e.type?"el-button--"+e.type:"",e.buttonSize?"el-button--"+e.buttonSize:"",{"is-disabled":e.buttonDisabled,"is-loading":e.loading,"is-plain":e.plain,"is-round":e.round,"is-circle":e.circle}],attrs:{disabled:e.buttonDisabled||e.loading,autofocus:e.autofocus,type:e.nativeType},on:{click:e.handleClick}},[e.loading?n("i",{staticClass:"el-icon-loading"}):e._e(),e._v(" "),e.icon&&!e.loading?n("i",{class:e.icon}):e._e(),e._v(" "),e.$slots.default?n("span",[e._t("default")],2):e._e()])},staticRenderFns:[]},y=n("VU/8")(b,w,!1,null,null,null).exports,S=(n("GXEp"),n("+BTi"),n("mtrD")),_={name:"edit-section",components:{"el-button":n.n(S).a},props:{section:{type:Object}},methods:{close:function(){this.$emit("close")},replaceImage:function(){},remove:function(){this.$emit("remove")}}},k={render:function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"edit-section"},[n("div",{staticClass:"header"},[n("div",{staticClass:"title"},[e._v("配置 "+e._s(e.section.title))]),e._v(" "),n("el-button",{staticClass:"btn-close",attrs:{type:"text",icon:"el-icon-close"},on:{click:e.close}})],1),e._v(" "),n("div",{staticClass:"config"},[e._l(e.section.data,function(t,i){return n("div",{key:i,staticClass:"field"},[n("label",[e._v(e._s(t.desc||i))]),e._v(" "),"text"===t.type?n("div",{staticClass:"text inline"},[n("input",{directives:[{name:"model",rawName:"v-model",value:t.value,expression:"item.value"}],attrs:{type:"text"},domProps:{value:t.value},on:{input:function(n){n.target.composing||e.$set(t,"value",n.target.value)}}})]):e._e(),e._v(" "),"textarea"===t.type?n("div",{staticClass:"textarea inline"},[n("textarea",{directives:[{name:"model",rawName:"v-model",value:t.value,expression:"item.value"}],attrs:{rows:"4"},domProps:{value:t.value},on:{input:function(n){n.target.composing||e.$set(t,"value",n.target.value)}}})]):e._e(),e._v(" "),"image"===t.type?n("div",{staticClass:"edit-image block"},[n("div",{staticClass:"image-box",style:{backgroundImage:"url("+t.value+")"}}),e._v(" "),n("el-button",{attrs:{type:"text",icon:"el-icon-refresh"},on:{click:e.replaceImage}},[e._v("更换")])],1):e._e()])}),e._v(" "),n("div",{staticClass:"footer"},[n("el-button",{attrs:{icon:"el-icon-delete",type:"text"},on:{click:e.remove}},[e._v("删除")])],1)],2)])},staticRenderFns:[]};var C={name:"page-builder",components:{ElButton:y,"edit-section":n("VU/8")(_,k,!1,function(e){n("AaOd")},null,null).exports,"screen-preview":x},created:function(){this.loadThemeSections(this.theme)},data:function(){return{imageBaseUrl:this.ctx.servers.theme.options.baseURL,theme:"bonfire",showSectionTemplateList:!1,showEditSection:!1,currentSection:{},sectionTemplates:[],themeStyles:[],seq:1}},computed:{},methods:{onAddSectionClick:function(){var e=this;return l()(a.a.mark(function t(){return a.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:e.showSectionTemplateList=!0;case 1:case"end":return t.stop()}},t,e)}))()},loadThemeSections:function(e){var t=this;return l()(a.a.mark(function n(){var i,s,o,c,u,l,p;return a.a.wrap(function(n){for(;;)switch(n.prev=n.next){case 0:return n.next=2,d.default.getThemeSections({theme:e},t.ctx);case 2:i=n.sent,s=!0,o=!1,c=void 0,n.prev=6,u=r()(i.sections);case 8:if(s=(l=u.next()).done){n.next=18;break}return p=l.value,n.next=12,d.default.loadSectionTemplate({theme:e,section:p},t.ctx);case 12:p.tmpl=n.sent,f.default.component("so-"+p.name,{props:{data:{type:Object}},template:p.tmpl}),t.sectionTemplates.push(p);case 15:s=!0,n.next=8;break;case 18:n.next=24;break;case 20:n.prev=20,n.t0=n.catch(6),o=!0,c=n.t0;case 24:n.prev=24,n.prev=25,!s&&u.return&&u.return();case 27:if(n.prev=27,!o){n.next=30;break}throw c;case 30:return n.finish(27);case 31:return n.finish(24);case 32:t.themeStyles=i.styles;case 33:case"end":return n.stop()}},n,t,[[6,20,24,32],[25,,27,31]])}))()},savePage:function(){var e=this;return l()(a.a.mark(function t(){return a.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,d.default.savePage({page:"test",type:"index",sections:e.$refs.screenPreview.sections},e.ctx);case 2:case"end":return t.stop()}},t,e)}))()},addSection:function(e){var t=this;return l()(a.a.mark(function n(){var i;return a.a.wrap(function(n){for(;;)switch(n.prev=n.next){case 0:t.showSectionTemplateList=!1,i=t.cloneObject(e),t.$refs.screenPreview.addSection(i),t.currentSection=i,t.showEditSection=!0;case 5:case"end":return n.stop()}},n,t)}))()},removeCurrentSection:function(){var e=this;return l()(a.a.mark(function t(){return a.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:e.showEditSection=!1,e.$refs.screenPreview.removeSection(e.currentSection),e.currentSection=null;case 3:case"end":return t.stop()}},t,e)}))()},editSection:function(e){this.currentSection=e,this.showEditSection=!0},cloneObject:function(e){return JSON.parse(s()(e))},closeEdit:function(){this.showEditSection=!1}}},E={render:function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"site-builder"},[n("el-button",{staticClass:"btn-add",attrs:{type:"primary",icon:"el-icon-plus",circle:""},on:{click:e.onAddSectionClick}}),e._v(" "),n("div",{staticClass:"screen-viewport"},[e._l(e.themeStyles,function(t){return n("link",{key:t,attrs:{href:e.imageBaseUrl+"/themes/"+e.theme+"/styles/"+t,rel:"stylesheet"}})}),e._v(" "),n("screen-preview",{ref:"screenPreview",on:{"edit-section":e.editSection}})],2),e._v(" "),n("transition",{attrs:{name:"slide-left"}},[e.showSectionTemplateList?n("div",{staticClass:"section-list"},e._l(e.sectionTemplates,function(t,i){return n("div",{key:i,staticClass:"section-entry"},[n("span",{staticClass:"name"},[e._v(e._s(t.title))]),e._v(" "),n("el-button",{attrs:{type:"primary",size:"mini"},on:{click:function(n){e.addSection(t)}}},[e._v("添加")])],1)})):e._e()]),e._v(" "),n("transition",{attrs:{name:"slide-left"}},[e.showEditSection?n("edit-section",{attrs:{section:e.currentSection},on:{close:e.closeEdit,remove:e.removeCurrentSection}}):e._e()],1)],1)},staticRenderFns:[]};var $=n("VU/8")(C,E,!1,function(e){n("49lo")},null,null);t.default=$.exports}});