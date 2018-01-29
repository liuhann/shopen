<template>
    <div class="page-sections">
        <header class="top-bar">
            <div class="title">Theme Hello</div>
        </header>
        <div class="tabs">
            <div class="tab">区块</div>
            <div class="tab">主题设置</div>
        </div>
        <div class="sections">
            <!--<ul class="section-header">
                <li class="header-section">
                    <div class="icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>header</title><path d="M19 0c.552 0 1 .448 1 1v7c0 .552-.448 1-1 1H1c-.552 0-1-.448-1-1V1c0-.552.448-1 1-1h18zM2 7h16V2H2v5zm6 11c.552 0 1 .448 1 1s-.448 1-1 1H6c-.552 0-1-.448-1-1s.448-1 1-1h2zm6 0h-2c-.552 0-1 .448-1 1s.448 1 1 1h2c.552 0 1-.448 1-1s-.448-1-1-1zm5-1c-.552 0-1 .448-1 1-.552 0-1 .448-1 1s.448 1 1 1h1c.552 0 1-.448 1-1v-1c0-.552-.448-1-1-1zM2 18c0-.552-.448-1-1-1s-1 .448-1 1v1c0 .552.448 1 1 1h1c.552 0 1-.448 1-1s-.448-1-1-1zm-1-3c.552 0 1-.448 1-1v-2c0-.552-.448-1-1-1s-1 .448-1 1v2c0 .552.448 1 1 1zm18-4c-.552 0-1 .448-1 1v2c0 .552.448 1 1 1s1-.448 1-1v-2c0-.552-.448-1-1-1z"></path></svg>
                    </div>
                    <div class="text">Header</div>
                </li>
            </ul>-->

            <ul class="section-body">
                <div class="seperator">
                    固定区块
                </div>
                <li class="section singleton" v-for="section in commonSections" @click="editSection(section)" >
                    <div class="icon">
                        <span v-html="section.icon"></span>
                    </div>
                    <div class="text">{{section.name}}</div>
                </li>

                <div v-if="hasSectionList">
                    <div class="seperator">
                        可定义区块
                    </div>
                    <draggable v-model="list" :options="{draggable:'.section'}" @end="sortEnd" @update="sortUpdate">
                        <li class="section" v-for="section in list" @click="editSection(section)">
                            <div class="icon">
                                <span v-html="section.icon"></span>
                            </div>
                            <div class="text">{{section.name}}</div>
                        </li>
                    </draggable>
                    <li class="add-section" @click="addSection">
                        <div class="icon">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>add-section</title><path d="M2 0H1C.448 0 0 .448 0 1v1c0 .552.448 1 1 1s1-.448 1-1c.552 0 1-.448 1-1s-.448-1-1-1zm4 2h2c.552 0 1-.448 1-1s-.448-1-1-1H6c-.552 0-1 .448-1 1s.448 1 1 1zm8-2h-2c-.552 0-1 .448-1 1s.448 1 1 1h2c.552 0 1-.448 1-1s-.448-1-1-1zM8 18H6c-.552 0-1 .448-1 1s.448 1 1 1h2c.552 0 1-.448 1-1s-.448-1-1-1zm6 0h-2c-.552 0-1 .448-1 1s.448 1 1 1h2c.552 0 1-.448 1-1s-.448-1-1-1zm5-18h-1c-.552 0-1 .448-1 1s.448 1 1 1c0 .552.448 1 1 1s1-.448 1-1V1c0-.552-.448-1-1-1zm0 17c-.552 0-1 .448-1 1-.552 0-1 .448-1 1s.448 1 1 1h1c.552 0 1-.448 1-1v-1c0-.552-.448-1-1-1zM2 18c0-.552-.448-1-1-1s-1 .448-1 1v1c0 .552.448 1 1 1h1c.552 0 1-.448 1-1s-.448-1-1-1zm-1-3c.552 0 1-.448 1-1v-2c0-.552-.448-1-1-1s-1 .448-1 1v2c0 .552.448 1 1 1zm0-6c.552 0 1-.448 1-1V6c0-.552-.448-1-1-1s-1 .448-1 1v2c0 .552.448 1 1 1zm18 2c-.552 0-1 .448-1 1v2c0 .552.448 1 1 1s1-.448 1-1v-2c0-.552-.448-1-1-1zm0-6c-.552 0-1 .448-1 1v2c0 .552.448 1 1 1s1-.448 1-1V6c0-.552-.448-1-1-1zm-5 4h-3V6c0-.552-.448-1-1-1s-1 .448-1 1v3H6c-.552 0-1 .448-1 1s.448 1 1 1h3v3c0 .552.448 1 1 1s1-.448 1-1v-3h3c.552 0 1-.448 1-1s-.448-1-1-1z"></path></svg>
                        </div>
                        <div class="text">Add section</div>
                    </li>
                </div>
            </ul>
            <!--<ul class="section-footer">
                <li class="footer-section">
                    <div class="icon">
                        <svg data-v-511bcee7="" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title data-v-511bcee7="">header</title><path data-v-511bcee7="" d="M19 0c.552 0 1 .448 1 1v7c0 .552-.448 1-1 1H1c-.552 0-1-.448-1-1V1c0-.552.448-1 1-1h18zM2 7h16V2H2v5zm6 11c.552 0 1 .448 1 1s-.448 1-1 1H6c-.552 0-1-.448-1-1s.448-1 1-1h2zm6 0h-2c-.552 0-1 .448-1 1s.448 1 1 1h2c.552 0 1-.448 1-1s-.448-1-1-1zm5-1c-.552 0-1 .448-1 1-.552 0-1 .448-1 1s.448 1 1 1h1c.552 0 1-.448 1-1v-1c0-.552-.448-1-1-1zM2 18c0-.552-.448-1-1-1s-1 .448-1 1v1c0 .552.448 1 1 1h1c.552 0 1-.448 1-1s-.448-1-1-1zm-1-3c.552 0 1-.448 1-1v-2c0-.552-.448-1-1-1s-1 .448-1 1v2c0 .552.448 1 1 1zm18-4c-.552 0-1 .448-1 1v2c0 .552.448 1 1 1s1-.448 1-1v-2c0-.552-.448-1-1-1z"></path></svg>
                    </div>
                    <div class="text">Footer</div>
                </li>
            </ul>-->
        </div>
    </div>
</template>

<script>

    import draggable from 'vuedraggable';

    export default {
        name: "PageSections",
        components: {
            draggable,
        },

        data() {
            return {
                list: this.sections
            };
        },
        props: {
            commonSections: {
                type: Array,
            },
            commonSectionData: {
                type: Object,
            },
            hasSectionList: {
                type: Boolean
            },
            sections: {
                type: Array,
            },
        },

        methods: {
            addSection() {
                this.$emit('add-section');
            },

            editSection(section) {
                this.$emit('setting', section);
            },

            sortEnd() {
                this.$emit('sort', this.list);
            },

            sortUpdate() {

            }

        }

    };
</script>

<style lang="less" scoped>
    .page-sections {
        height: 100%;
        position: relative;
        .sections {
            position: absolute;
            bottom: 0;
            top: 100px;
            width: 100%;

            overflow: auto;
            ul {
                margin: 0;
                border-bottom: 1px solid #dfe4e8;
            }
            ul,li {
                list-style: none;
                padding: 0;
            }
            li {
                cursor: pointer;
                background: #fff;
                border-top: 1px solid #dfe4e8;
                display: flex;
                padding: 10px 15px;
                transition: all 300ms cubic-bezier(0.19, 1, 0.22, 1);
                .icon {
                    width: 20px;
                    height: 20px;
                    margin: 6px;
                    color: #efefef;
                    fill: #454f5b;
                }
                &.add-section {
                    color: #5c6ac4;
                    .icon {
                        fill: #5c6ac4;
                    }
                }

                &.singleton {
                    color: #5c6ac4;
                    .icon {
                        fill: #5c6ac4;
                    }
                }

                .text {
                    flex: 1;
                    padding: 5px;
                }
            }

            .seperator {
                height: 20px;
                border-top: 1px solid #dfe4e8;
                padding: 10px;
                font-size: 14px;
            }

            .add-section {

            }
        }
    }



</style>