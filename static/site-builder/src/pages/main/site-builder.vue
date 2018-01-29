<template>
    <div class="builder-root">
        <div class="left-sider-bar" :class="viewPort==='wide'?'hidden': ''">
            <page-sections :sections="pageSections" :has-section-list="hasSectionList" :common-sections="commonSections"
                           @add-section="showAddSection" @setting="settingSection" @sort="updateSort"></page-sections>
            <section-templates :templates="reusableSections" :show="isAddingSection" @close="closeAddSection" @choose="addSection"></section-templates>
            <section-setting :show="isSettingSection" :section="currentSection" @close="closeSettingSection" @remove="removeCurrentSection"></section-setting>
        </div>

        <div class="right-content-preview">
            <header class="top-bar">
                <div class="page-selector">
                    <select v-model="currentPage">
                        <option v-for="page in templates" :value="page.template">{{page.name}}</option>
                    </select>
                </div>
                <div class="view-ports">
                    <div class="viewport-selector">
                        <div class="mobile" :class="viewPort==='mobile'?'current': ''" @click="onPreview('mobile')"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path fill="currentColor" d="M3 1h14v18H3V1z"></path><path d="M17 0c.552 0 1 .447 1 1v18c0 .553-.448 1-1 1H3c-.552 0-1-.447-1-1V1c0-.553.448-1 1-1h14zM4 18h12V2H4v16zM9 6h2c.552 0 1-.447 1-1s-.448-1-1-1H9c-.552 0-1 .447-1 1s.448 1 1 1zm1 8c-.552 0-1 .447-1 1s.448 1 1 1 1-.447 1-1-.448-1-1-1z"></path></svg></div>
                        <div class="desktop" :class="viewPort==='desktop'?'current': ''" @click="onPreview('desktop')"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path fill="currentColor" d="M1 1h18v10H1V1z"></path><path d="M13 14H2v-2h16v2h-5zm-.606 4H7.606c.16-.522.295-1.182.357-2h4.074c.062.818.196 1.478.357 2zM2 10V2h16v8H2zM19 0H1C.448 0 0 .447 0 1v14c0 .553.448 1 1 1h4.95c-.156 1.657-.66 2.293-.658 2.293-.285.286-.37.716-.216 1.09S5.596 20 6 20h8c.39 0 .734-.242.897-.598s.09-.788-.166-1.084c-.004-.007-.52-.64-.68-2.318H19c.552 0 1-.447 1-1V1c0-.553-.448-1-1-1z"></path></svg></div>
                        <div class="wide" :class="viewPort==='wide'?'current': ''" @click="onPreview('wide')"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Viewport-Wide</title><path d="M16.707 6.293l3 3c.39.39.39 1.023 0 1.414l-3 3c-.195.195-.45.293-.707.293s-.512-.098-.707-.293c-.39-.39-.39-1.023 0-1.414L16.586 11H12c-.552 0-1-.447-1-1s.448-1 1-1h4.586l-1.293-1.293c-.39-.39-.39-1.023 0-1.414s1.023-.39 1.414 0zm-12 0c.39.39.39 1.023 0 1.414L3.414 9H8c.552 0 1 .447 1 1s-.448 1-1 1H3.414l1.293 1.293c.39.39.39 1.023 0 1.414-.195.195-.45.293-.707.293s-.512-.098-.707-.293l-3-3c-.39-.39-.39-1.023 0-1.414l3-3c.39-.39 1.023-.39 1.414 0zM19 0c.552 0 1 .447 1 1v2c0 .553-.448 1-1 1s-1-.447-1-1V2H2v2c0 .553-.448 1-1 1s-1-.447-1-1V1c0-.553.448-1 1-1h18zm0 15c.552 0 1 .447 1 1v3c0 .553-.448 1-1 1H1c-.552 0-1-.447-1-1v-3c0-.553.448-1 1-1s1 .447 1 1v2h16v-2c0-.553.448-1 1-1z"></path></svg></div>
                    </div>
                </div>
                <div class="buttons">
                    <button @click="savePage">Save</button>
                </div>
            </header>
            <div class="preview" id="preview">
                <!--<link v-for="style in sectionStyles" rel="stylesheet" media="all" :href="websiteServer + 'static/assets/' + style" crossorigin="anonymous" />-->
                <div class="iframe-wrapper" :class="viewPort" id="preview-wrapper">
                    <iframe ref="iframe" :src="iframeUrl" @load="iframeLoaded"></iframe>
                    <!--<div id="preview-container">
                    </div>-->
                    <!--<site-preview :sections="pageSections" ref="sitePreview"></site-preview>-->
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue';
    import PageSections from './page-sections';
    import SectionTemplates from './section-templates';
    import SectionList from './section-list.vue';
    import SectionSetting from './section-setting';

    Vue.component('section-list', SectionList);

    export default {
        data () {
            return {
                templates: [],
                currentPage: 'index',
                sectionInc: 1,
                isAddingSection: false,
                isSettingSection: false,
                allSections: [],  //所有section
                hasSectionList: false,      //是否有section-list 组件
                reusableSections: [],       //可以在section-list组件中动态添加的section
                commonSections: [],          //页面固定部分的组件 例如 菜单、头部、左侧栏 这些组件特点就是所有页面表现一致，不能动态增删
                //commonSectionsData: {},     //通用部分的数据
                currentSection: {},          //正在设置属性的当前section
                pageSections: [],
                viewPort: 'desktop',
                pageConfig: {},
                globalData: {},
                sectionStyles: [], //需要引入的样式
                iframeUrl: null,
                iframeVue: null,
            };
        },

        components: {
            PageSections,
            SectionTemplates,
            SectionSetting,
        },

        watch:  {
            currentPage: async function (value) {
                await this.loadPage(value);
            }
        },

        async created() {
            this.loadSections().then(async ()=>{
                await this.loadTemplates();
                await this.loadPage(this.currentPage);
            });
        },

        methods: {
            async loadTemplates() {
                const response = await this.ctx.models.website.getAllTemplates();
                this.templates =  response.templates;
            },

            /**
             * 加载所有section
             **/
            async loadSections() {
                const response = await this.ctx.models.website.getAllSections();

                const allSections = response.settings;
                this.allSections = allSections;

                for(let i=0; i<allSections.length; i++) {
                    if (!allSections[i].isCommon) {
                        this.reusableSections.push(allSections[i]);
                    } else {
                        //对于单例的section， 默认data是保存其内的，
                        //this.commonSectionsData[camelize(allSections[i].component)] = allSections[i].data;
                    }
                }
                //this.reusableSections = response.settings;

                for(const section of allSections) {
                    section.template = this.ctx.models.website.loadSectionTemplate({
                        section: section.path
                    });
                    if (section.style) {
                        this.sectionStyles.push(section.style);
                    }
                }

                for(const section of allSections) {
                    section.template = await section.template;
                    let dataFunction = function() {
                        return this.$root.pageData;
                    };

                    Vue.component(section.component, {
                        props: {
                            setting: {
                                type: Object,
                            }
                        },
                        data: dataFunction,
                        template: section.template
                    });
                }
            },

            async loadPage(page) {
                for(let config of this.templates) {
                    if (config.template === page) {
                        this.pageConfig = config;
                        break;
                    }
                }
                const jsonConfig = this.pageConfig;

                //加载页面配置文件 例如 index
                //const jsonConfig = await this.ctx.models.website.loadStaticFile('/templates/' + page + '.json');
                //this.pageConfig = jsonConfig;

                //获取页面模板
                const contentTemplate = await this.ctx.models.website.loadStaticFile('/templates/' + jsonConfig.path);

                //获取页面使用的layout
                const layoutTemplate = await this.ctx.models.website.loadStaticFile('/layout/' + jsonConfig.layout + '.html');
                const layoutConfig = await this.ctx.models.website.loadStaticFile('/layout/' + jsonConfig.layout + '.json');

                //设置页面的固定部分组件
                this.commonSections.length = 0;
                if (layoutConfig.components) {
                    for(let commonSection in layoutConfig.components) {
                        const def = this.getSectionDef(commonSection);
                        // def.data = Object.assign(this.commonSectionsData[camelize(def.component)], layoutConfig.common[commonSection].data);
                        def.data = layoutConfig.components[commonSection].data;
                        this.commonSections.push(def);
                    }
                }

                //增加页面内部的固定组件
                this.pageSections.length = 0;
                this.hasSectionList = false;

                for(const pageComponent in jsonConfig.components) {
                    if (pageComponent === 'section-list') { //表示页面有动态增加组件
                        this.hasSectionList = true;
                        for(const section of jsonConfig.components[pageComponent].sections) {
                            for(const one of this.reusableSections) {
                                if (one.component === section.component) {
                                    //这里拷贝section定义过来， 以便于按类型定义配置字段
                                    const addedSection = JSON.parse(JSON.stringify(one)); //深度拷贝
                                    addedSection._id = 'section-' + this.sectionInc;
                                    this.sectionInc ++;
                                    addedSection.data = section.data;
                                    this.pageSections.push(addedSection);
                                    break;
                                }
                            }
                        }
                    } else {
                        //非动态组件， 直接获取定义
                        const def = this.getSectionDef(pageComponent);
                        // def.data = Object.assign(this.commonSectionsData[camelize(def.component)], jsonConfig.components[pageComponent]);
                        def._id = 'section-' + this.sectionInc;
                        this.sectionInc ++;
                        def.data = jsonConfig.components[pageComponent].data;
                        this.commonSections.push(def);
                    }
                }

                //将配置好的动态列表数据回写
                if (jsonConfig.components['section-list']) {
                    jsonConfig.components['section-list'].sections = this.pageSections;
                }

                const pageData = await this.ctx.models.website.getPageData({
                    template: jsonConfig.template,
                    key: jsonConfig.defaultKey || 'default',
                });

                this.globalData = pageData.response;

                //加载layout主入口文件
                const vueOptions  = {
                    el: '#preview-container'
                };
                vueOptions.template = layoutTemplate;
                vueOptions.components = {
                    'main-content': {
                        template: contentTemplate,
                        data: function() {
                            return Object.assign({
                                setting: jsonConfig
                            }, pageData.response);
                        }
                    }
                };

                //this.commonSectionsData.pageData = pageData.response;
                vueOptions.data = {
                    setting: layoutConfig,
                    pageData: pageData.response
                };
                this.vueOptions = vueOptions;
                //this.preview = new Vue(vueOptions);
                this.closeSettingSection();
                const iframeUrl = '/static/layout/' + jsonConfig.layout + '.html?' + new Date().getTime();
                this.iframeUrl = iframeUrl;
                /*if (this.iframeUrl != iframeUrl) {
                } else {
                    debugger;
                    this.preview = new Vue({
                        el: this.$refs.iframe.contentWindow.document.body,
                        components: this.vueOptions.components,
                        data: this.vueOptions.data
                    });
                }*/
            },

            iframeLoaded() {
                if (this.$refs.iframe.src) {
                    this.preview = new Vue({
                        el: this.$refs.iframe.contentWindow.document.body,
                        components: this.vueOptions.components,
                        data: this.vueOptions.data
                    });
                }
            },


            getSectionDef(componentName) {
                for (const section of this.allSections) {
                    if (section.component === componentName) {
                        return JSON.parse(JSON.stringify(section));
                    }
                }
            },

            back(){
                this.$router.back();
            },

            showAddSection() {
                this.isAddingSection = true;
            },

            async dynamicImportComponent(template){
                const section = JSON.parse(JSON.stringify(template)); //深度拷贝
                section._id = 'section-' + this.sectionInc;
                this.sectionInc ++;
                this.pageSections.push(section);
                this.preview.$refs.main.setting.components['section-list'].sections = this.pageSections;
                //$refs.main.setting.sections =
                //this.pageConfig.data = this.pageSections;
                /*import("@/" + template.path).then((component)=> {
                    this.$refs.sitePreview.$options.components[component.default.name] = component.default;
                    const section = JSON.parse(JSON.stringify(template)); //深度拷贝
                    section._id = 'section-' + this.sectionInc;
                    this.sectionInc ++;
                    this.pageSections.push(section);
                });*/
            },

            addSection(template) {
                this.isAddingSection = false;
                this.dynamicImportComponent(template);
            },

            settingSection(section) {
                if (section.isCommon) {
                    const target = this.findByTagRecursive(this.preview, section.component);
                    if (target) {
                        this.$refs.iframe.contentWindow.scrollTo(0, target.$el.offsetTop);
                    }
                } else if (section._id) {
                    var anchor = this.$refs.iframe.contentWindow.document.getElementById(section._id);
                    this.$refs.iframe.contentWindow.scrollTo(0, anchor.offsetTop);
                }
                this.isSettingSection = true;
                this.currentSection = section;
            },

            findByTagRecursive(vue, tag) {
                for(const child of vue.$children) {
                    if (child.$options._componentTag === tag) {
                        return child;
                    }
                    if (child.$children.length) {
                        const found = this.findByTagRecursive(child, tag);
                        if (found) {
                            return found;
                        }
                    }
                }
                return null;
            },

            closeAddSection() {
                this.isAddingSection = false;
            },

            closeSettingSection() {
                this.isSettingSection = false;
            },

            removeCurrentSection() {
                for(let i=0; i<this.pageSections.length; i++) {
                    if (this.pageSections[i]._id && this.pageSections[i]._id===this.currentSection._id) {
                        this.pageSections.splice(i, 1);
                        break;
                    }
                }
                this.closeSettingSection();
                //this.preview.$refs.main.setting.components['section-list'].sections = this.pageSections;
            },
            onPreview(viewPort) {
                this.viewPort = viewPort;
            },

            async savePage() {
                const indexSections = [];

                for(const section of this.pageSections) {
                    indexSections.push({
                        component: section.component,
                        data: section.data
                    });
                }

                let pageSetting = {
                    'components': {
                        'section-list': {
                            'sections': indexSections
                        }
                    }
                };

                const layoutSections = {};
                for(const section of this.commonSections) {
                    if(this.pageConfig.components[section.component]) {
                        pageSetting.components[section.component] = {
                            data: section.data
                        };
                    } else {
                        layoutSections[section.component] = {
                            data: section.data
                        };
                    }
                }
                pageSetting.layoutComponents = layoutSections;
                pageSetting.page = this.currentPage;

                await this.ctx.models.website.updatePageSections(pageSetting);
                alert('保存完成');
            },

            updateSort(list) {
                this.pageSections = list;
                this.preview.$refs.main.setting.components['section-list'].sections = this.pageSections;
            }
        }
    };

</script>


<style lang="less">

    html, body {
        font: 14px/150% tahoma,arial,Microsoft YaHei,Hiragino Sans GB,"\u5b8b\u4f53",sans-serif;
        -webkit-font-smoothing: antialiased;
        color: #666;
        background: #fff;
        padding: 0;
        margin: 0;
    }

    .builder-root {
        display: flex;
        height: 100%;
        overflow: hidden;
    }

    .top-bar {
        background: #f9fafb;
        text-align: center;
        height: 40px;
        line-height: 40px;
        padding: 5px;
        box-shadow: 0 0 0 1px rgba(63,63,68,0.05), 0 1px 3px 0 rgba(63,63,68,0.15);
    }


    .left-sider-bar {
        position: relative;
        display: flex;
        flex-direction: column;
        z-index: 2;
        overflow: hidden;
        height: 100vh;
        max-height: 100%;
        width: 280px;
        background: #f9fafb;
        border-right: 1px solid #dfe4e8;

        &.hidden {
            width: 0;
        }

        .tabs {
            display: flex;
            .tab {
                flex: 1;
                padding: 5px;
                text-align: center;
                height: 32px;
                line-height: 32px;
            }
        }
    }


    .right-content-preview {
        flex-direction: column;
        flex-grow: 1;
        display: flex;
        height: 100vh;
        max-height: 100%;

        -webkit-transition: all 150ms cubic-bezier(0.19, 1, 0.22, 1);
        transition: all 150ms cubic-bezier(0.19, 1, 0.22, 1);
        -webkit-box-shadow: 0 0 3px rgba(0,0,0,0.1), 0 0 12px rgba(0,0,0,0.1);
        box-shadow: 0 0 3px rgba(0,0,0,0.1), 0 0 12px rgba(0,0,0,0.1);

        .top-bar {
            background: #f9fafb;
            box-shadow: 0 0 0 1px rgba(63,63,68,0.05), 0 1px 3px 0 rgba(63,63,68,0.15);
            .page-selector  {
                width: 20%;
                float: left;
                select {
                    padding: 8px;
                    border-radius: 3px;
                    box-shadow: 0 0 0 1px rgba(63, 63, 68, 0.05), 0 1px 3px 0 rgba(63, 63, 68, 0.15);
                    border: none;
                    option {
                        padding: 8px;
                    }
                }
            }

            .view-ports {
                float: left;
                width: 60%;
                .viewport-selector {
                    >div {
                        width: 18px;
                        padding: 0px 10px;
                        display: inline-block;
                        cursor: pointer;
                        svg {
                            fill: #637381;
                            color: transparent;
                        }
                        &.current {
                            border-bottom: 2px solid #212b35;
                            svg {
                                fill: #212b35;
                            }
                        }
                    }

                }
            }

            .buttons {
                width: 20%;
                text-align: right;
                float: right;
                button {
                    background: -webkit-gradient(linear, left top, left bottom, from(#6371c7), to(#5563c1));
                    background: linear-gradient(to bottom, #6371c7, #5563c1);
                    -webkit-box-shadow: inset 0 1px 0 0 #6f7bcb;
                    box-shadow: inset 0 1px 0 0 #6f7bcb;
                    color: #ffffff;
                    padding: 7px 10px;
                    border: none;
                    cursor: pointer;
                }
            }

        }

        .preview {
            flex-grow: 1;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100%;
            background: #f4f6f8;
            position: relative;
            padding: 0.8rem;

            .iframe-wrapper {
                background: #fff;
                width: 100%;
                height: 100%;
                max-width: 100%;
                max-height: 100%;
                -webkit-transition: all 150ms cubic-bezier(0.19, 1, 0.22, 1);
                transition: all 150ms cubic-bezier(0.19, 1, 0.22, 1);
                -webkit-box-shadow: 0 0 3px rgba(0,0,0,0.1), 0 0 12px rgba(0,0,0,0.1);
                box-shadow: 0 0 3px rgba(0,0,0,0.1), 0 0 12px rgba(0,0,0,0.1);
                -webkit-overflow-scrolling: touch;
                overflow: auto;


                &.mobile {
                    width: 375px;
                }

                iframe {
                    width: 1px;
                    min-width: 100%;
                    display: block;
                    height: 100%;
                    padding: 0;
                    border: 0;
                    background-color: #ffffff;
                }
            }
        }
    }

    .ui-button {
        position: relative;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        display: inline-block;
        height: auto;
        margin: 0;
        background: inherit;
        font-family: inherit;
        font-weight: 400;
        white-space: nowrap;
        cursor: pointer;
        text-transform: none;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        vertical-align: middle;
        -webkit-appearance: none;
        -moz-appearance: none;
        padding: 5px 10px;
        background: -webkit-gradient(linear, left top, left bottom, from(#fff), to(#f9fafb));
        background: linear-gradient(to bottom, #fff, #f9fafb);
        border: 1px solid #c4cdd5;
        -webkit-box-shadow: 0 1px 0 0 rgba(22,29,37,0.05);
        box-shadow: 0 1px 0 0 rgba(22,29,37,0.05);
        border-radius: 3px;
        font-size: 14px;
        color: #212b35;
        -webkit-transition-property: background, border, -webkit-box-shadow;
        transition-property: background, border, -webkit-box-shadow;
        transition-property: background, border, box-shadow;
        transition-property: background, border, box-shadow, -webkit-box-shadow;
        -webkit-transition-timing-function: cubic-bezier(0.64, 0, 0.35, 1);
        transition-timing-function: cubic-bezier(0.64, 0, 0.35, 1);
        -webkit-transition-duration: 200ms;
        transition-duration: 200ms;
        -webkit-tap-highlight-color: transparent;
    }
</style>
