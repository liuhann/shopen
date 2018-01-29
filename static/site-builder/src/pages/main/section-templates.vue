<template>
    <div class="section-templates" :style="showStyle">
        <header class="top-bar">
            <div class="title">Add Section</div>
            <div class="close" @click="close">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M18.263 16l10.07-10.07c.625-.625.625-1.636 0-2.26s-1.638-.627-2.263 0L16 13.737 5.933 3.667c-.626-.624-1.637-.624-2.262 0s-.624 1.64 0 2.264L13.74 16 3.67 26.07c-.626.625-.626 1.636 0 2.26.312.313.722.47 1.13.47s.82-.157 1.132-.47l10.07-10.068 10.068 10.07c.312.31.722.468 1.13.468s.82-.157 1.132-.47c.626-.625.626-1.636 0-2.26L18.262 16z"></path></svg>
            </div>
        </header>
        <div class="template-list">
            <ul>
                <li v-for="template in templates" @click="chooseTemplate(template)">
                    {{template.name}}
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    export default {
        name: "SectionTemplates",
        props: {
            show: {
                type: Boolean,
                default: false,
            },
            templates: {
                type: Array
            }
        },
        data() {
            return {};
        },

        computed: {
            showStyle() {
                if (this.show) {
                    return {
                        transform: 'translateY(0)'
                    };
                } else {
                    return {
                        transform: 'translateY(100%)'
                    };
                }
            }
        },

        methods: {
            close() {
                this.$emit('close');
            },
            chooseTemplate(template) {
                this.$emit('choose', template);
            },
        }
    };
</script>

<style lang="less" scoped>
    .section-templates {
        position: absolute;
        z-index: 2;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #fff;
        transition: all 300ms cubic-bezier(0.19, 1, 0.22, 1);
        .top-bar {
            display: flex;
            .title {
                flex: 1;
            }
            .close {
                cursor: pointer;
                width: 18px;
                margin-right: 10px;
            }
        }
    }

    .template-list {
        ul, li {
            list-style: none;
            padding: 0;
            margin: 0;
        }

        li {
            cursor: pointer;
            padding: 10px;
            border-bottom: 1px solid #ccc;
        }
    }
</style>